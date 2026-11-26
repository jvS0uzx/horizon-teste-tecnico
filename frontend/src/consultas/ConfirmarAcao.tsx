import { useState } from 'react';
import { mensagensDoErro } from '../api/cliente.ts';
import type { Consulta } from '../api/consultas.ts';
import { Alerta } from '../componentes/Alerta.tsx';
import { Botao } from '../componentes/Botao.tsx';
import { formatarDataHora } from '../utilitarios/datas.ts';
import { CONFIRMACOES, type AcaoConfirmada } from './acoes.ts';

interface ConfirmarAcaoProps {
  consulta: Consulta;
  acao: AcaoConfirmada;
  onConcluida: (mensagem: string) => void;
  onVoltar: () => void;
}

export function ConfirmarAcao({
  consulta,
  acao,
  onConcluida,
  onVoltar,
}: ConfirmarAcaoProps) {
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const confirmacao = CONFIRMACOES[acao];

  async function confirmar() {
    setEnviando(true);
    setErros([]);
    try {
      await confirmacao.executar(consulta.id);
      onConcluida(confirmacao.sucesso);
    } catch (falha) {
      setErros(mensagensDoErro(falha));
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {erros.length > 0 && <Alerta mensagens={erros} />}
      <div>
        <p className="font-semibold text-preto">{consulta.nomePaciente}</p>
        <p className="text-sm text-grafite">
          {formatarDataHora(consulta.dataHora)} · {consulta.especialidade}
        </p>
      </div>
      <p className="text-sm text-preto">{confirmacao.aviso}</p>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Botao variante="secundario" onClick={onVoltar} disabled={enviando}>
          Voltar
        </Botao>
        <Botao onClick={confirmar} disabled={enviando}>
          {enviando ? 'Salvando…' : confirmacao.confirmar}
        </Botao>
      </div>
    </div>
  );
}
