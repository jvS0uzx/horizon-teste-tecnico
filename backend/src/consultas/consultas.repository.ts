import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, QueryFailedError, Repository } from 'typeorm';
import { FUSO_DA_CLINICA } from './calendario.js';
import { Consulta } from './consulta.entity.js';
import { StatusConsulta } from './status-consulta.enum.js';

const INDICE_HORARIO_OCUPADO = 'uq_consultas_cpf_data_hora_ativa';

export interface FiltroDaListagem {
  pagina: number;
  limite: number;
  busca?: string;
  status?: StatusConsulta;
  data?: string;
}

const comoTextoLiteral = (texto: string) => texto.replace(/[\\%_]/g, '\\$&');

@Injectable()
export class ConsultasRepository {
  constructor(
    @InjectRepository(Consulta)
    private readonly repositorio: Repository<Consulta>,
  ) {}

  salvar(consulta: Consulta): Promise<Consulta> {
    return this.repositorio.save(consulta);
  }

  async remover(consulta: Consulta): Promise<void> {
    await this.repositorio.remove(consulta);
  }

  buscarPorId(id: string): Promise<Consulta | null> {
    return this.repositorio.findOneBy({ id });
  }

  listar({
    pagina,
    limite,
    busca,
    status,
    data,
  }: FiltroDaListagem): Promise<[Consulta[], number]> {
    const consulta = this.repositorio
      .createQueryBuilder('consulta')
      .orderBy('consulta.dataHora', 'ASC')
      .addOrderBy('consulta.id', 'ASC')
      .skip((pagina - 1) * limite)
      .take(limite);

    if (busca) {
      const digitos = busca.replace(/\D/g, '');
      consulta.andWhere(
        new Brackets((condicao) => {
          condicao.where('consulta.nomePaciente ILIKE :nome', {
            nome: `%${comoTextoLiteral(busca)}%`,
          });
          if (digitos) {
            condicao.orWhere(
              "translate(consulta.cpfPaciente, '.-', '') LIKE :digitos",
              { digitos: `%${digitos}%` },
            );
          }
        }),
      );
    }

    if (status) {
      consulta.andWhere('consulta.status = :status', { status });
    }

    if (data) {
      consulta.andWhere(
        "consulta.dataHora >= CAST(:data AS timestamp) AT TIME ZONE :fuso AND consulta.dataHora < (CAST(:data AS timestamp) + interval '1 day') AT TIME ZONE :fuso",
        { data, fuso: FUSO_DA_CLINICA },
      );
    }

    return consulta.getManyAndCount();
  }

  existeAtivaNoHorario(
    cpfPaciente: string,
    dataHora: Date,
    ignorarId?: string,
  ): Promise<boolean> {
    return this.repositorio.exists({
      where: {
        cpfPaciente,
        dataHora,
        status: Not(StatusConsulta.Cancelada),
        ...(ignorarId ? { id: Not(ignorarId) } : {}),
      },
    });
  }

  ehHorarioOcupado(erro: unknown): boolean {
    return (
      erro instanceof QueryFailedError &&
      (erro.driverError as { constraint?: string }).constraint ===
        INDICE_HORARIO_OCUPADO
    );
  }
}
