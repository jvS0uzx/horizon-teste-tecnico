import { Botao } from './Botao.tsx';

interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  total: number;
  onIrPara: (pagina: number) => void;
}

export function Paginacao({
  pagina,
  totalPaginas,
  total,
  onIrPara,
}: PaginacaoProps) {
  if (total === 0) return null;

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-grafite">
        Página {pagina} de {totalPaginas} · {total}{' '}
        {total === 1 ? 'consulta' : 'consultas'}
      </p>
      <div className="flex gap-2">
        <Botao
          variante="secundario"
          disabled={pagina <= 1}
          onClick={() => onIrPara(pagina - 1)}
        >
          Anterior
        </Botao>
        <Botao
          variante="secundario"
          disabled={pagina >= totalPaginas}
          onClick={() => onIrPara(pagina + 1)}
        >
          Próxima
        </Botao>
      </div>
    </nav>
  );
}
