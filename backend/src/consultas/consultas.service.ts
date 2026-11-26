import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Consulta } from './consulta.entity.js';
import { ConsultasRepository } from './consultas.repository.js';
import { AlterarStatusDto } from './dto/alterar-status.dto.js';
import {
  ConsultaResposta,
  PaginaDeConsultas,
  paraResposta,
} from './dto/consulta-resposta.js';
import { CriarConsultaDto } from './dto/criar-consulta.dto.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';

const MENSAGEM_HORARIO_OCUPADO =
  'Já existe uma consulta para este CPF nesta data e hora.';

@Injectable()
export class ConsultasService {
  constructor(private readonly repositorio: ConsultasRepository) {}

  async listar({
    pagina,
    limite,
  }: ListarConsultasDto): Promise<PaginaDeConsultas> {
    const [consultas, total] = await this.repositorio.listar(pagina, limite);
    const agora = new Date();
    return {
      dados: consultas.map((consulta) => paraResposta(consulta, agora)),
      meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async buscar(id: string): Promise<ConsultaResposta> {
    return paraResposta(await this.buscarConsulta(id), new Date());
  }

  async agendar(dados: CriarConsultaDto): Promise<ConsultaResposta> {
    const agora = new Date();
    const consulta = Consulta.agendar(
      { ...dados, dataHora: new Date(dados.dataHora) },
      agora,
    );
    await this.exigirHorarioLivre(consulta);
    return paraResposta(await this.salvar(consulta), agora);
  }

  async alterarStatus(
    id: string,
    { status }: AlterarStatusDto,
  ): Promise<ConsultaResposta> {
    const agora = new Date();
    const consulta = await this.buscarConsulta(id);
    consulta.alterarStatus(status, agora);
    return paraResposta(await this.salvar(consulta), agora);
  }

  private async buscarConsulta(id: string): Promise<Consulta> {
    const consulta = await this.repositorio.buscarPorId(id);
    if (!consulta) {
      throw new NotFoundException('Consulta não encontrada.');
    }
    return consulta;
  }

  private async exigirHorarioLivre(consulta: Consulta): Promise<void> {
    const ocupado = await this.repositorio.existeAtivaNoHorario(
      consulta.cpfPaciente,
      consulta.dataHora,
    );
    if (ocupado) {
      throw new ConflictException(MENSAGEM_HORARIO_OCUPADO);
    }
  }

  private async salvar(consulta: Consulta): Promise<Consulta> {
    try {
      return await this.repositorio.salvar(consulta);
    } catch (erro) {
      if (this.repositorio.ehHorarioOcupado(erro)) {
        throw new ConflictException(MENSAGEM_HORARIO_OCUPADO);
      }
      throw erro;
    }
  }
}
