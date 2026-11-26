import { AcoesPermitidas, Consulta } from '../consulta.entity.js';
import { StatusConsulta } from '../status-consulta.enum.js';

export interface ConsultaResposta {
  id: string;
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: Date;
  especialidade: string;
  observacoes: string | null;
  status: StatusConsulta;
  criadoEm: Date;
  atualizadoEm: Date;
  acoesPermitidas: AcoesPermitidas;
}

export interface PaginaDeConsultas {
  dados: ConsultaResposta[];
  meta: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}

export function paraResposta(
  consulta: Consulta,
  agora: Date,
): ConsultaResposta {
  return {
    id: consulta.id,
    nomePaciente: consulta.nomePaciente,
    cpfPaciente: consulta.cpfPaciente,
    dataHora: consulta.dataHora,
    especialidade: consulta.especialidade,
    observacoes: consulta.observacoes,
    status: consulta.status,
    criadoEm: consulta.criadoEm,
    atualizadoEm: consulta.atualizadoEm,
    acoesPermitidas: consulta.acoesPermitidas(agora),
  };
}
