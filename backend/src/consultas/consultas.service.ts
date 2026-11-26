import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Consulta } from './consulta.entity.js';
import { ConsultasRepository } from './consultas.repository.js';
import { CriarConsultaDto } from './dto/criar-consulta.dto.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';

const MENSAGEM_HORARIO_OCUPADO =
  'Já existe uma consulta para este CPF nesta data e hora.';

export interface PaginaDeConsultas {
  dados: Consulta[];
  meta: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}

@Injectable()
export class ConsultasService {
  constructor(private readonly repositorio: ConsultasRepository) {}

  async listar({
    pagina,
    limite,
  }: ListarConsultasDto): Promise<PaginaDeConsultas> {
    const [dados, total] = await this.repositorio.listar(pagina, limite);
    return {
      dados,
      meta: { total, pagina, limite, totalPaginas: Math.ceil(total / limite) },
    };
  }

  async buscar(id: string): Promise<Consulta> {
    const consulta = await this.repositorio.buscarPorId(id);
    if (!consulta) {
      throw new NotFoundException('Consulta não encontrada.');
    }
    return consulta;
  }

  async agendar(dados: CriarConsultaDto): Promise<Consulta> {
    const consulta = Consulta.agendar(
      { ...dados, dataHora: new Date(dados.dataHora) },
      new Date(),
    );
    await this.exigirHorarioLivre(consulta);
    return this.salvar(consulta);
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
