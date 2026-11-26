import { requisitar } from './cliente.ts';

export type StatusConsulta = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';

export type StatusFinal = Exclude<StatusConsulta, 'AGENDADA'>;

export interface AcoesPermitidas {
  editar: boolean;
  remarcar: boolean;
  realizar: boolean;
  cancelar: boolean;
  excluir: boolean;
}

export interface Consulta {
  id: string;
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: string;
  especialidade: string;
  observacoes: string | null;
  status: StatusConsulta;
  criadoEm: string;
  atualizadoEm: string;
  acoesPermitidas: AcoesPermitidas;
}

export interface PaginaDeConsultas {
  dados: Consulta[];
  meta: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}

export interface DadosDaConsulta {
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: string;
  especialidade: string;
  observacoes: string | null;
}

export const listarConsultas = (pagina: number) =>
  requisitar<PaginaDeConsultas>(`/consultas?pagina=${pagina}`);

export const agendarConsulta = (dados: DadosDaConsulta) =>
  requisitar<Consulta>('/consultas', 'POST', dados);

export const editarConsulta = (id: string, dados: Partial<DadosDaConsulta>) =>
  requisitar<Consulta>(`/consultas/${id}`, 'PATCH', dados);

export const remarcarConsulta = (id: string, dataHora: string) =>
  requisitar<Consulta>(`/consultas/${id}/data-hora`, 'PATCH', { dataHora });

export const excluirConsulta = (id: string) =>
  requisitar<void>(`/consultas/${id}`, 'DELETE');

export const alterarStatus = (id: string, status: StatusFinal) =>
  requisitar<Consulta>(`/consultas/${id}/status`, 'PATCH', { status });
