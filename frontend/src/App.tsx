import { useEffect, useState } from 'react';
import type { Consulta } from './api/consultas.ts';
import { Botao } from './componentes/Botao.tsx';
import { Cabecalho } from './componentes/Cabecalho.tsx';
import { Dialogo } from './componentes/Dialogo.tsx';
import { Paginacao } from './componentes/Paginacao.tsx';
import { ConfirmarAcao } from './consultas/ConfirmarAcao.tsx';
import { FiltrosConsultas } from './consultas/FiltrosConsultas.tsx';
import { FormularioConsulta } from './consultas/FormularioConsulta.tsx';
import { FormularioRemarcacao } from './consultas/FormularioRemarcacao.tsx';
import { ListaConsultas } from './consultas/ListaConsultas.tsx';
import { CONFIRMACOES, type Acao } from './consultas/acoes.ts';
import { useConsultas } from './consultas/useConsultas.ts';

const DURACAO_DO_AVISO_MS = 5000;

type DialogoAberto = { tipo: 'NOVA' } | { tipo: Acao; consulta: Consulta };

function tituloDe(dialogo: DialogoAberto): string {
  switch (dialogo.tipo) {
    case 'NOVA':
      return 'Nova consulta';
    case 'EDITAR':
      return 'Editar consulta';
    case 'REMARCAR':
      return 'Remarcar consulta';
    default:
      return CONFIRMACOES[dialogo.tipo].titulo;
  }
}

export function App() {
  const {
    consultas,
    meta,
    filtros,
    filtrando,
    carregando,
    erro,
    recarregar,
    irParaPagina,
    aplicarFiltros,
  } = useConsultas();
  const [dialogo, setDialogo] = useState<DialogoAberto>();
  const [aviso, setAviso] = useState<string>();

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(
      () => setAviso(undefined),
      DURACAO_DO_AVISO_MS,
    );
    return () => clearTimeout(temporizador);
  }, [aviso]);

  function fechar() {
    setDialogo(undefined);
  }

  function concluir(mensagem: string) {
    fechar();
    setAviso(mensagem);
    recarregar();
  }

  function conteudoDe(aberto: DialogoAberto) {
    if (aberto.tipo === 'NOVA') {
      return <FormularioConsulta onSalvo={concluir} onCancelar={fechar} />;
    }
    if (aberto.tipo === 'EDITAR') {
      return (
        <FormularioConsulta
          consulta={aberto.consulta}
          onSalvo={concluir}
          onCancelar={fechar}
        />
      );
    }
    if (aberto.tipo === 'REMARCAR') {
      return (
        <FormularioRemarcacao
          consulta={aberto.consulta}
          onSalvo={concluir}
          onCancelar={fechar}
        />
      );
    }
    return (
      <ConfirmarAcao
        consulta={aberto.consulta}
        acao={aberto.tipo}
        onConcluida={concluir}
        onVoltar={fechar}
      />
    );
  }

  return (
    <div className="min-h-dvh">
      <Cabecalho />

      <section className="bg-preto">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-6 pb-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pt-10 sm:pb-14 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amarelo uppercase">
              Sistema de agendamento
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-branco sm:text-5xl">
              Consultas
            </h1>
            <div className="mt-5 h-1.5 w-20 bg-amarelo" />
          </div>
          <Botao onClick={() => setDialogo({ tipo: 'NOVA' })}>
            Nova consulta
          </Botao>
        </div>
      </section>

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        {aviso && (
          <p
            role="status"
            className="bg-amarelo px-4 py-3 text-sm font-semibold text-preto"
          >
            {aviso}
          </p>
        )}
        <FiltrosConsultas filtros={filtros} onAplicar={aplicarFiltros} />
        <ListaConsultas
          consultas={consultas}
          carregando={carregando}
          filtrando={filtrando}
          erro={erro}
          onTentarNovamente={recarregar}
          onEscolherAcao={(consulta, acao) =>
            setDialogo({ tipo: acao, consulta })
          }
        />
        {meta && !erro && (
          <Paginacao
            pagina={meta.pagina}
            totalPaginas={meta.totalPaginas}
            total={meta.total}
            onIrPara={irParaPagina}
          />
        )}
      </main>

      <Dialogo
        aberto={Boolean(dialogo)}
        titulo={dialogo ? tituloDe(dialogo) : ''}
        onFechar={fechar}
      >
        {dialogo && conteudoDe(dialogo)}
      </Dialogo>
    </div>
  );
}
