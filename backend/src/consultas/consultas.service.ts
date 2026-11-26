import { ConflictException, Injectable } from '@nestjs/common';
import { Consulta } from './consulta.entity.js';
import { ConsultasRepository } from './consultas.repository.js';
import { CriarConsultaDto } from './dto/criar-consulta.dto.js';

const MENSAGEM_HORARIO_OCUPADO =
  'Já existe uma consulta para este CPF nesta data e hora.';

@Injectable()
export class ConsultasService {
  constructor(private readonly repositorio: ConsultasRepository) {}

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
