import { useEffect, useState } from 'react';
import type { Consulta, StatusFinal } from './api/consultas.ts';
import { Botao } from './componentes/Botao.tsx';
import { Cabecalho } from './componentes/Cabecalho.tsx';
import { Dialogo } from './componentes/Dialogo.tsx';
import { ConfirmarStatus } from './consultas/ConfirmarStatus.tsx';
import { FormularioConsulta } from './consultas/FormularioConsulta.tsx';
import { ListaConsultas } from './consultas/ListaConsultas.tsx';
import { TEXTOS_STATUS } from './consultas/textosStatus.ts';
import { useConsultas } from './consultas/useConsultas.ts';

const DURACAO_DO_AVISO_MS = 5000;

interface MudancaDeStatus {
  consulta: Consulta;
  status: StatusFinal;
}

export function App() {
  const { consultas, carregando, erro, recarregar } = useConsultas();
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [mudancaDeStatus, setMudancaDeStatus] = useState<MudancaDeStatus>();
  const [aviso, setAviso] = useState<string>();

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(
      () => setAviso(undefined),
      DURACAO_DO_AVISO_MS,
    );
    return () => clearTimeout(temporizador);
  }, [aviso]);

  function concluir(mensagem: string) {
    setFormularioAberto(false);
    setMudancaDeStatus(undefined);
    setAviso(mensagem);
    recarregar();
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
          <Botao onClick={() => setFormularioAberto(true)}>Nova consulta</Botao>
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
        <ListaConsultas
          consultas={consultas}
          carregando={carregando}
          erro={erro}
          onTentarNovamente={recarregar}
          onAlterarStatus={(consulta, status) =>
            setMudancaDeStatus({ consulta, status })
          }
        />
      </main>

      <Dialogo
        aberto={formularioAberto}
        titulo="Nova consulta"
        onFechar={() => setFormularioAberto(false)}
      >
        <FormularioConsulta
          onAgendada={() => concluir('Consulta agendada com sucesso.')}
          onCancelar={() => setFormularioAberto(false)}
        />
      </Dialogo>

      <Dialogo
        aberto={Boolean(mudancaDeStatus)}
        titulo={
          mudancaDeStatus ? TEXTOS_STATUS[mudancaDeStatus.status].titulo : ''
        }
        onFechar={() => setMudancaDeStatus(undefined)}
      >
        {mudancaDeStatus && (
          <ConfirmarStatus
            consulta={mudancaDeStatus.consulta}
            status={mudancaDeStatus.status}
            onConcluido={concluir}
            onVoltar={() => setMudancaDeStatus(undefined)}
          />
        )}
      </Dialogo>
    </div>
  );
}
