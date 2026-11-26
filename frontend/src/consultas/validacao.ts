import { paraIsoNaClinica } from '../utilitarios/datas.ts';

export interface CamposDaConsulta {
  nomePaciente: string;
  cpfPaciente: string;
  dataHora: string;
  especialidade: string;
  observacoes: string;
}

export type ErrosDaConsulta = Partial<Record<keyof CamposDaConsulta, string>>;

const FORMATO_CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

function validarTamanho(
  valor: string,
  minimo: number,
  maximo: number,
  obrigatorio: string,
  tamanho: string,
): string | undefined {
  const texto = valor.trim();
  if (!texto) return obrigatorio;
  if (texto.length < minimo || texto.length > maximo) return tamanho;
  return undefined;
}

const AGENDAR_NO_PASSADO = 'Não é possível agendar uma consulta no passado.';

export function validarDataHora(
  valor: string,
  agora: Date,
  mensagemDePassado = AGENDAR_NO_PASSADO,
): string | undefined {
  if (!valor) return 'A data e hora da consulta é obrigatória.';
  if (new Date(paraIsoNaClinica(valor)) <= agora) return mensagemDePassado;
  return undefined;
}

export function validarConsulta(
  campos: CamposDaConsulta,
  agora = new Date(),
  dataHoraOriginal?: string,
): ErrosDaConsulta {
  const erros: ErrosDaConsulta = {
    nomePaciente: validarTamanho(
      campos.nomePaciente,
      3,
      150,
      'O nome do paciente é obrigatório.',
      'O nome do paciente deve ter entre 3 e 150 caracteres.',
    ),
    cpfPaciente: !campos.cpfPaciente
      ? 'O CPF do paciente é obrigatório.'
      : FORMATO_CPF.test(campos.cpfPaciente)
        ? undefined
        : 'O CPF do paciente deve estar no formato 000.000.000-00.',
    dataHora:
      campos.dataHora && campos.dataHora === dataHoraOriginal
        ? undefined
        : validarDataHora(campos.dataHora, agora),
    especialidade: validarTamanho(
      campos.especialidade,
      3,
      100,
      'A especialidade é obrigatória.',
      'A especialidade deve ter entre 3 e 100 caracteres.',
    ),
    observacoes:
      campos.observacoes.trim().length > 1000
        ? 'As observações devem ter no máximo 1000 caracteres.'
        : undefined,
  };

  return Object.fromEntries(
    Object.entries(erros).filter(([, mensagem]) => mensagem),
  );
}
