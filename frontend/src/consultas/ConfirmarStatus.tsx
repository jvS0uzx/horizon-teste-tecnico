import { useState } from 'react';
import { mensagensDoErro } from '../api/cliente.ts';
import {
  alterarStatus,
  type Consulta,
  type StatusFinal,
} from '../api/consultas.ts';
import { Alerta } from '../componentes/Alerta.tsx';
import { Botao } from '../componentes/Botao.tsx';
import { formatarDataHora } from '../utilitarios/datas.ts';
import { TEXTOS_STATUS } from './textosStatus.ts';

interface ConfirmarStatusProps {
  consulta: Consulta;
  status: StatusFinal;
  onConcluido: (mensagem: string) => void;
  onVoltar: () => void;
}

export function ConfirmarStatus({
  consulta,
  status,
  onConcluido,
  onVoltar,
}: ConfirmarStatusProps) {
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const textos = TEXTOS_STATUS[status];

  async function confirmar() {
    setEnviando(true);
    setErros([]);
    try {
      await alterarStatus(consulta.id, status);
      onConcluido(textos.sucesso);
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
      <p className="text-sm text-preto">
        A mudança de status é definitiva e não pode ser desfeita.
      </p>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Botao variante="secundario" onClick={onVoltar} disabled={enviando}>
          Voltar
        </Botao>
        <Botao onClick={confirmar} disabled={enviando}>
          {enviando ? 'Salvando…' : textos.confirmar}
        </Botao>
      </div>
    </div>
  );
}
