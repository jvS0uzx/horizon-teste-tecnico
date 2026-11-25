import {
  ErroRegraDeNegocio,
  ErroValidacao,
} from '../comum/erros/erros-de-dominio.js';
import { saoDoMesmoDiaNaClinica } from './calendario-da-clinica.js';
import { StatusConsulta } from './status-consulta.enum.js';

export interface DadosDoAgendamento {
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: Date;
  especialidade: string;
  observacoes?: string | null;
}

type StatusFinal = Exclude<StatusConsulta, StatusConsulta.Agendada>;

const MENSAGEM_DE_STATUS_FINAL: Record<StatusFinal, string> = {
  [StatusConsulta.Realizada]:
    'Esta consulta já foi realizada e não pode mudar de status.',
  [StatusConsulta.Cancelada]:
    'Esta consulta foi cancelada e não pode mudar de status.',
};

export class Consulta {
  id: string;
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: Date;
  especialidade: string;
  observacoes: string | null;
  status: StatusConsulta;
  criadoEm: Date;
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
    this.garantirQueEstaAgendada();

    if (!saoDoMesmoDiaNaClinica(this.dataHora, agora)) {
      throw new ErroRegraDeNegocio(
        'A consulta só pode ser marcada como realizada no dia agendado.',
      );
    }

    this.status = StatusConsulta.Realizada;
  }

  cancelar(): void {
    this.garantirQueEstaAgendada();
    this.status = StatusConsulta.Cancelada;
  }

  private garantirQueEstaAgendada(): void {
    if (this.status !== StatusConsulta.Agendada) {
      throw new ErroRegraDeNegocio(MENSAGEM_DE_STATUS_FINAL[this.status]);
    }
  }

  private static semSegundos(data: Date): Date {
    const semSegundos = new Date(data);
    semSegundos.setUTCSeconds(0, 0);
    return semSegundos;
  }
}
