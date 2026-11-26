import { requisitar } from './cliente.ts';

export type StatusConsulta = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';

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

export interface NovaConsulta {
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: string;
  especialidade: string;
  observacoes?: string;
}

export const listarConsultas = (pagina: number) =>
  requisitar<PaginaDeConsultas>(`/consultas?pagina=${pagina}`);

export const agendarConsulta = (consulta: NovaConsulta) =>
  requisitar<Consulta>('/consultas', 'POST', consulta);
