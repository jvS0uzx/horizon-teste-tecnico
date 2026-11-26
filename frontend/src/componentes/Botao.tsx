import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario';

const ESTILO_DA_VARIANTE: Record<Variante, string> = {
  primario:
    'border-amarelo bg-amarelo text-preto hover:bg-preto hover:text-amarelo',
  secundario: 'border-preto bg-branco text-preto hover:bg-cinza-claro',
};

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  soIcone?: boolean;
}

export function Botao({
  variante = 'primario',
  soIcone = false,
  className = '',
  type = 'button',
  ...propriedades
}: BotaoProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 border-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amarelo disabled:cursor-not-allowed disabled:border-cinza-claro disabled:bg-cinza-claro disabled:text-grafite ${soIcone ? 'w-11' : 'px-5'} ${ESTILO_DA_VARIANTE[variante]} ${className}`}
      {...propriedades}
    />
  );
}
