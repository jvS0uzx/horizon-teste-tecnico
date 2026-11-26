import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { Consulta } from './consulta.entity.js';
import { StatusConsulta } from './status-consulta.enum.js';

const VIOLACAO_DE_UNICIDADE = '23505';

@Injectable()
export class ConsultasRepository {
  constructor(
    @InjectRepository(Consulta)
    private readonly repositorio: Repository<Consulta>,
  ) {}

  salvar(consulta: Consulta): Promise<Consulta> {
    return this.repositorio.save(consulta);
  }

  existeAtivaNoHorario(cpfPaciente: string, dataHora: Date): Promise<boolean> {
    return this.repositorio.exists({
      where: {
        cpfPaciente,
        dataHora,
        status: Not(StatusConsulta.Cancelada),
      },
    });
  }

  ehHorarioOcupado(erro: unknown): boolean {
    return (
      erro instanceof QueryFailedError &&
      (erro.driverError as { code?: string }).code === VIOLACAO_DE_UNICIDADE
    );
  }
}
