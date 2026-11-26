import type { ReactNode } from 'react';

export const ESTILO_DE_ENTRADA =
  'w-full border border-grafite bg-branco px-3 py-2.5 text-base text-preto focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-preto aria-invalid:border-2 aria-invalid:border-preto';

interface CampoProps {
  id: string;
  rotulo: string;
  erro?: string;
  opcional?: boolean;
  children: ReactNode;
}

export function Campo({ id, rotulo, erro, opcional, children }: CampoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-preto">
        {rotulo}
        {opcional && (
          <span className="font-normal text-grafite"> (opcional)</span>
        )}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="text-sm font-medium text-preto">
          {erro}
        </p>
      )}
    </div>
  );
}
