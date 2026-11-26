import { useEffect, useId, useRef, type ReactNode } from 'react';

interface DialogoProps {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
}

export function Dialogo({ aberto, titulo, onFechar, children }: DialogoProps) {
  const referencia = useRef<HTMLDialogElement>(null);
  const idDoTitulo = useId();

  useEffect(() => {
    const dialogo = referencia.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={referencia}
      onClose={onFechar}
      aria-labelledby={idDoTitulo}
      className="m-auto w-[calc(100%-2rem)] max-w-lg bg-branco p-0 text-grafite backdrop:bg-preto/70"
    >
      <div className="flex items-center justify-between gap-4 border-b-4 border-amarelo px-5 py-4">
        <h2 id={idDoTitulo} className="text-lg font-bold text-preto">
          {titulo}
        </h2>
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="grid size-9 place-items-center text-2xl text-preto hover:bg-cinza-claro focus-visible:outline-2 focus-visible:outline-preto"
        >
          ×
        </button>
      </div>
      <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto p-5">
        {aberto && children}
      </div>
    </dialog>
  );
}
