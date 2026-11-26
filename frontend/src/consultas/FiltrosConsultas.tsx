import { useEffect, useState } from 'react';
import type { FiltrosDaListagem } from '../api/consultas.ts';
import { Botao } from '../componentes/Botao.tsx';
import { Campo, ESTILO_DE_ENTRADA } from '../componentes/Campo.tsx';
import { FILTROS_VAZIOS } from './useConsultas.ts';

const ESPERA_DA_BUSCA_MS = 300;

interface FiltrosConsultasProps {
  filtros: FiltrosDaListagem;
  onAplicar: (filtros: FiltrosDaListagem) => void;
}

export function FiltrosConsultas({
  filtros,
  onAplicar,
}: FiltrosConsultasProps) {
  const [busca, setBusca] = useState(filtros.busca);

  useEffect(() => {
    const buscaAparada = busca.trim();
    if (buscaAparada === filtros.busca) return;
    const espera = setTimeout(
      () => onAplicar({ ...filtros, busca: buscaAparada }),
      ESPERA_DA_BUSCA_MS,
    );
    return () => clearTimeout(espera);
  }, [busca, filtros, onAplicar]);

  function alterar(campo: 'status' | 'data', valor: string) {
    onAplicar({ ...filtros, busca: busca.trim(), [campo]: valor });
  }

  function limpar() {
    setBusca('');
    onAplicar(FILTROS_VAZIOS);
  }

  return (
    <form
      role="search"
      noValidate
      onSubmit={(evento) => evento.preventDefault()}
      className="grid gap-4 border border-grafite bg-branco p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end"
    >
      <Campo id="filtroBusca" rotulo="Nome ou CPF">
        <input
          id="filtroBusca"
          type="search"
          value={busca}
          maxLength={150}
          placeholder="Buscar por nome ou CPF"
          className={ESTILO_DE_ENTRADA}
          onChange={(evento) => setBusca(evento.target.value)}
        />
      </Campo>
      <Campo id="filtroStatus" rotulo="Status">
        <select
          id="filtroStatus"
          value={filtros.status}
          className={ESTILO_DE_ENTRADA}
          onChange={(evento) => alterar('status', evento.target.value)}
        >
          <option value="">Todos</option>
          <option value="AGENDADA">Agendada</option>
          <option value="REALIZADA">Realizada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </Campo>
      <Campo id="filtroData" rotulo="Data">
        <input
          id="filtroData"
          type="date"
          value={filtros.data}
          className={ESTILO_DE_ENTRADA}
          onChange={(evento) => alterar('data', evento.target.value)}
        />
      </Campo>
      <Botao
        variante="secundario"
        className="sm:col-span-2 lg:col-span-1"
        onClick={limpar}
      >
        Limpar
      </Botao>
    </form>
  );
}
