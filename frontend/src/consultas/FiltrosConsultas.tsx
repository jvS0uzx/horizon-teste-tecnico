import { useState, type FormEvent } from 'react';
import type { FiltrosDaListagem } from '../api/consultas.ts';
import { Botao } from '../componentes/Botao.tsx';
import { Campo, ESTILO_DE_ENTRADA } from '../componentes/Campo.tsx';
import { FILTROS_VAZIOS } from './useConsultas.ts';

interface FiltrosConsultasProps {
  filtros: FiltrosDaListagem;
  onAplicar: (filtros: FiltrosDaListagem) => void;
}

export function FiltrosConsultas({
  filtros,
  onAplicar,
}: FiltrosConsultasProps) {
  const [rascunho, setRascunho] = useState(filtros);

  function alterar(campo: keyof FiltrosDaListagem, valor: string) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  function aplicar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onAplicar(rascunho);
  }

  function limpar() {
    setRascunho(FILTROS_VAZIOS);
    onAplicar(FILTROS_VAZIOS);
  }

  return (
    <form
      role="search"
      noValidate
      onSubmit={aplicar}
      className="grid gap-4 border border-grafite bg-branco p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end"
    >
      <Campo id="filtroBusca" rotulo="Nome ou CPF">
        <input
          id="filtroBusca"
          type="search"
          value={rascunho.busca}
          maxLength={150}
          placeholder="Buscar por nome ou CPF"
          className={ESTILO_DE_ENTRADA}
          onChange={(evento) => alterar('busca', evento.target.value)}
        />
      </Campo>
      <Campo id="filtroStatus" rotulo="Status">
        <select
          id="filtroStatus"
          value={rascunho.status}
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
          value={rascunho.data}
          className={ESTILO_DE_ENTRADA}
          onChange={(evento) => alterar('data', evento.target.value)}
        />
      </Campo>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
        <Botao type="submit" className="flex-1 lg:flex-none">
          Filtrar
        </Botao>
        <Botao
          variante="secundario"
          className="flex-1 lg:flex-none"
          onClick={limpar}
        >
          Limpar
        </Botao>
      </div>
    </form>
  );
}
