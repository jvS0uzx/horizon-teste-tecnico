export const FUSO_DA_CLINICA = 'America/Sao_Paulo';

const formatadorDeDia = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO_DA_CLINICA,
  dateStyle: 'short',
});

export function saoDoMesmoDiaNaClinica(primeira: Date, segunda: Date): boolean {
  return formatadorDeDia.format(primeira) === formatadorDeDia.format(segunda);
}
