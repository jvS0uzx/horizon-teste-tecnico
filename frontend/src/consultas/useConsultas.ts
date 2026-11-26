import { useCallback, useEffect, useState } from 'react';
import { mensagensDoErro } from '../api/cliente.ts';
import { listarConsultas, type PaginaDeConsultas } from '../api/consultas.ts';

export function useConsultas() {
  const [resultado, setResultado] = useState<PaginaDeConsultas>();
  const [erro, setErro] = useState<string[]>();
  const [carregando, setCarregando] = useState(true);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    listarConsultas(1)
      .then((pagina) => {
        if (!ativo) return;
        setResultado(pagina);
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
  }, [versao]);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setVersao((atual) => atual + 1);
  }, []);

  return {
    consultas: resultado?.dados ?? [],
    carregando,
    erro,
    recarregar,
  };
}
