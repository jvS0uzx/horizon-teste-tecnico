import type { ReactNode } from 'react';

interface AlertaProps {
  mensagens: string[];
  children?: ReactNode;
}

export function Alerta({ mensagens, children }: AlertaProps) {
  return (
    <div
      role="alert"
      className="border-l-4 border-amarelo bg-preto px-4 py-3 text-branco"
    >
      <ul className="space-y-1 text-sm">
        {mensagens.map((mensagem) => (
          <li key={mensagem}>{mensagem}</li>
        ))}
      </ul>
      {children}
    </div>
  );
}
