import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ErroRegraDeNegocio, ErroValidacao } from '../comum/erros.js';
import { mesmoDiaNaClinica } from './calendario.js';
import { StatusConsulta } from './status-consulta.enum.js';

export interface DadosDoAgendamento {
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: Date;
  especialidade: string;
  observacoes?: string | null;
}

type StatusFinal = Exclude<StatusConsulta, StatusConsulta.Agendada>;

const MENSAGEM_STATUS_FINAL: Record<StatusFinal, string> = {
  [StatusConsulta.Realizada]:
    'Esta consulta já foi realizada e não pode mudar de status.',
  [StatusConsulta.Cancelada]:
    'Esta consulta foi cancelada e não pode mudar de status.',
};

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
  especialidade: string;

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
    const dataHora = Consulta.semSegundos(dados.dataHora);

    if (dataHora <= agora) {
      throw new ErroValidacao(
        'Não é possível agendar uma consulta no passado.',
      );
    }

    const consulta = new Consulta();
    consulta.nomePaciente = dados.nomePaciente;
    consulta.cpfPaciente = dados.cpfPaciente;
    consulta.dataHora = dataHora;
    consulta.especialidade = dados.especialidade;
    consulta.observacoes = dados.observacoes ?? null;
    consulta.status = StatusConsulta.Agendada;
    return consulta;
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
    this.exigirAgendada();

    if (!mesmoDiaNaClinica(this.dataHora, agora)) {
      throw new ErroRegraDeNegocio(
        'A consulta só pode ser marcada como realizada no dia agendado.',
      );
    }

    this.status = StatusConsulta.Realizada;
  }

  cancelar(): void {
    this.exigirAgendada();
    this.status = StatusConsulta.Cancelada;
  }

  private exigirAgendada(): void {
    if (this.status !== StatusConsulta.Agendada) {
      throw new ErroRegraDeNegocio(MENSAGEM_STATUS_FINAL[this.status]);
    }
  }

  private static semSegundos(data: Date): Date {
    const semSegundos = new Date(data);
    semSegundos.setUTCSeconds(0, 0);
    return semSegundos;
  }
}
