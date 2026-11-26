const FUSO_DA_CLINICA = 'America/Sao_Paulo';
const DESLOCAMENTO_DA_CLINICA = '-03:00';

const formatadorDeData = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO_DA_CLINICA,
  dateStyle: 'short',
});

const formatadorDeHora = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO_DA_CLINICA,
  timeStyle: 'short',
});

export function paraIsoNaClinica(valorDoCampo: string): string {
  return `${valorDoCampo}:00${DESLOCAMENTO_DA_CLINICA}`;
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  return `${formatadorDeData.format(data)} às ${formatadorDeHora.format(data)}`;
}

export function agoraParaCampo(agora = new Date()): string {
  const partes = new Intl.DateTimeFormat('sv-SE', {
    timeZone: FUSO_DA_CLINICA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(agora);
  return partes.replace(' ', 'T');
}
