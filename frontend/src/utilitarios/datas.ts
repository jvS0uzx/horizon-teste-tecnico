const FUSO_DA_CLINICA = 'America/Sao_Paulo';

const formatadorDeData = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO_DA_CLINICA,
  dateStyle: 'short',
});

const formatadorDeHora = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO_DA_CLINICA,
  timeStyle: 'short',
});

const formatadorDeCampo = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO_DA_CLINICA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const formatadorDeDeslocamento = new Intl.DateTimeFormat('en-US', {
  timeZone: FUSO_DA_CLINICA,
  timeZoneName: 'longOffset',
});

function deslocamentoNaClinica(instante: Date): string {
  const nome = formatadorDeDeslocamento
    .formatToParts(instante)
    .find((parte) => parte.type === 'timeZoneName')?.value;
  return nome && nome !== 'GMT' ? nome.replace('GMT', '') : '+00:00';
}

export function paraIsoNaClinica(valorDoCampo: string): string {
  const deslocamento = deslocamentoNaClinica(new Date(`${valorDoCampo}:00Z`));
  return `${valorDoCampo}:00${deslocamento}`;
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  return `${formatadorDeData.format(data)} às ${formatadorDeHora.format(data)}`;
}

export function agoraParaCampo(agora = new Date()): string {
  const partes = Object.fromEntries(
    formatadorDeCampo
      .formatToParts(agora)
      .map((parte) => [parte.type, parte.value]),
  );
  return `${partes.year}-${partes.month}-${partes.day}T${partes.hour}:${partes.minute}`;
}
