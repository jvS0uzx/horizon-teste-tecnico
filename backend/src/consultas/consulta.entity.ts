import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ErroRegraDeNegocio, ErroValidacao } from '../comum/erros.js';
import { mesmoDiaNaClinica } from './calendario.js';
import { EspecialidadeConsulta } from './especialidade-consulta.enum.js';
import { StatusConsulta } from './status-consulta.enum.js';

export interface DadosDoAgendamento {
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: Date;
  especialidade: EspecialidadeConsulta;
  observacoes?: string | null;
}

export type DadosDaEdicao = Partial<DadosDoAgendamento>;

export interface AcoesPermitidas {
  editar: boolean;
  remarcar: boolean;
  realizar: boolean;
  cancelar: boolean;
  excluir: boolean;
}

type StatusFinal = Exclude<StatusConsulta, StatusConsulta.Agendada>;

const SITUACAO_FINAL: Record<StatusFinal, string> = {
  [StatusConsulta.Realizada]: 'Esta consulta já foi realizada',
  [StatusConsulta.Cancelada]: 'Esta consulta foi cancelada',
};

const AGENDAR_NO_PASSADO = 'Não é possível agendar uma consulta no passado.';

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome_paciente', type: 'varchar', length: 150 })
  nomePaciente: string;

  @Column({ name: 'cpf_paciente', type: 'char', length: 14 })
  cpfPaciente: string;

  @Column({ name: 'data_hora', type: 'timestamptz' })
  dataHora: Date;

  @Column({ type: 'varchar', length: 100 })
  especialidade: EspecialidadeConsulta;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observacoes: string | null;

  @Column({
    type: 'enum',
    enum: StatusConsulta,
    enumName: 'status_consulta',
    default: StatusConsulta.Agendada,
  })
  status: StatusConsulta;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamptz' })
  atualizadoEm: Date;

  static agendar(dados: DadosDoAgendamento, agora: Date): Consulta {
    const consulta = new Consulta();
    consulta.dataHora = Consulta.exigirFutura(
      dados.dataHora,
      agora,
      AGENDAR_NO_PASSADO,
    );
    consulta.nomePaciente = dados.nomePaciente;
    consulta.cpfPaciente = dados.cpfPaciente;
    consulta.especialidade = dados.especialidade;
    consulta.observacoes = dados.observacoes ?? null;
    consulta.status = StatusConsulta.Agendada;
    return consulta;
  }

  acoesPermitidas(agora: Date): AcoesPermitidas {
    const agendada = this.status === StatusConsulta.Agendada;
    return {
      editar: agendada,
      remarcar: agendada,
      realizar: agendada && mesmoDiaNaClinica(this.dataHora, agora),
      cancelar: agendada,
      excluir: true,
    };
  }

  editar(dados: DadosDaEdicao, agora: Date): void {
    this.exigirAgendada('ser editada');

    if (dados.dataHora) {
      const dataHora = Consulta.semSegundos(dados.dataHora);
      if (dataHora.getTime() !== this.dataHora.getTime()) {
        this.dataHora = Consulta.exigirFutura(
          dataHora,
          agora,
          AGENDAR_NO_PASSADO,
        );
      }
    }

    this.nomePaciente = dados.nomePaciente ?? this.nomePaciente;
    this.cpfPaciente = dados.cpfPaciente ?? this.cpfPaciente;
    this.especialidade = dados.especialidade ?? this.especialidade;
    if (dados.observacoes !== undefined) {
      this.observacoes = dados.observacoes;
    }
  }

  remarcar(novaDataHora: Date, agora: Date): void {
    this.exigirAgendada('ser remarcada');
    this.dataHora = Consulta.exigirFutura(
      novaDataHora,
      agora,
      'Não é possível remarcar para uma data e hora no passado.',
    );
  }

  alterarStatus(novoStatus: StatusConsulta, agora: Date): void {
    switch (novoStatus) {
      case StatusConsulta.Realizada:
        return this.realizar(agora);
      case StatusConsulta.Cancelada:
        return this.cancelar();
      case StatusConsulta.Agendada:
        throw new ErroRegraDeNegocio(
          'Uma consulta não pode voltar para o status Agendada.',
        );
    }
  }

  realizar(agora: Date): void {
    this.exigirAgendada('mudar de status');

    if (!mesmoDiaNaClinica(this.dataHora, agora)) {
      throw new ErroRegraDeNegocio(
        'A consulta só pode ser marcada como realizada no dia agendado.',
      );
    }

    this.status = StatusConsulta.Realizada;
  }

  cancelar(): void {
    this.exigirAgendada('mudar de status');
    this.status = StatusConsulta.Cancelada;
  }

  private exigirAgendada(acao: string): void {
    if (this.status !== StatusConsulta.Agendada) {
      throw new ErroRegraDeNegocio(
        `${SITUACAO_FINAL[this.status]} e não pode ${acao}.`,
      );
    }
  }

  private static exigirFutura(data: Date, agora: Date, mensagem: string): Date {
    const dataHora = Consulta.semSegundos(data);
    if (dataHora <= agora) {
      throw new ErroValidacao(mensagem);
    }
    return dataHora;
  }

  private static semSegundos(data: Date): Date {
    const semSegundos = new Date(data);
    semSegundos.setUTCSeconds(0, 0);
    return semSegundos;
  }
}
