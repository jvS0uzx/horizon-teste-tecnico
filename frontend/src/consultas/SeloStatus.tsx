import type { StatusConsulta } from '../api/consultas.ts';

const APARENCIA: Record<StatusConsulta, { rotulo: string; estilo: string }> = {
  AGENDADA: {
    rotulo: 'Agendada',
    estilo: 'border-amarelo bg-amarelo text-preto',
  },
  REALIZADA: {
    rotulo: 'Realizada',
    estilo: 'border-preto bg-preto text-branco',
  },
  CANCELADA: {
    rotulo: 'Cancelada',
    estilo: 'border-grafite bg-branco text-grafite',
  },
};

export function SeloStatus({ status }: { status: StatusConsulta }) {
  const { rotulo, estilo } = APARENCIA[status];
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${estilo}`}
    >
      {rotulo}
    </span>
  );
}
