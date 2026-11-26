import { useCallback, useEffect, useState } from 'react';
import { mensagensDoErro } from '../api/cliente.ts';
import {
  listarConsultas,
  type FiltrosDaListagem,
  type PaginaDeConsultas,
} from '../api/consultas.ts';

export const FILTROS_VAZIOS: FiltrosDaListagem = {
  busca: '',
  status: '',
  data: '',
};

export function useConsultas() {
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [resultado, setResultado] = useState<PaginaDeConsultas>();
  const [erro, setErro] = useState<string[]>();
  const [carregando, setCarregando] = useState(true);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    listarConsultas(pagina, filtros)
      .then((resposta) => {
        if (!ativo) return;
        const { totalPaginas } = resposta.meta;
        if (pagina > 1 && pagina > totalPaginas) {
          setPagina(Math.max(totalPaginas, 1));
          return;
        }
        setResultado(resposta);
        setErro(undefined);
      })
      .catch((falha: unknown) => {
        if (ativo) setErro(mensagensDoErro(falha));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [pagina, filtros, versao]);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setVersao((atual) => atual + 1);
  }, []);

  const irParaPagina = useCallback((novaPagina: number) => {
    setCarregando(true);
    setPagina(novaPagina);
  }, []);

  const aplicarFiltros = useCallback((novosFiltros: FiltrosDaListagem) => {
    setCarregando(true);
    setPagina(1);
    setFiltros(novosFiltros);
  }, []);

  return {
    consultas: resultado?.dados ?? [],
    meta: resultado?.meta,
    filtros,
    filtrando: Object.values(filtros).some(Boolean),
    carregando,
    erro,
    recarregar,
    irParaPagina,
    aplicarFiltros,
  };
}
