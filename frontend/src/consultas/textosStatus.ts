import type { StatusFinal } from '../api/consultas.ts';

export const TEXTOS_STATUS: Record<
  StatusFinal,
  { titulo: string; confirmar: string; sucesso: string }
> = {
  REALIZADA: {
    titulo: 'Marcar como realizada',
    confirmar: 'Marcar como realizada',
    sucesso: 'Consulta marcada como realizada.',
  },
  CANCELADA: {
    titulo: 'Cancelar consulta',
    confirmar: 'Cancelar consulta',
    sucesso: 'Consulta cancelada.',
  },
};
