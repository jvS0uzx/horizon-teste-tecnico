import { useState, type FormEvent } from 'react';
import { mensagensDoErro } from '../api/cliente.ts';
import { remarcarConsulta, type Consulta } from '../api/consultas.ts';
import { Alerta } from '../componentes/Alerta.tsx';
import { Botao } from '../componentes/Botao.tsx';
import { Campo, ESTILO_DE_ENTRADA } from '../componentes/Campo.tsx';
import {
  formatarDataHora,
  paraCampo,
  paraIsoNaClinica,
} from '../utilitarios/datas.ts';
import { validarDataHora } from './validacao.ts';

interface FormularioRemarcacaoProps {
  consulta: Consulta;
  onSalvo: (mensagem: string) => void;
  onCancelar: () => void;
}

export function FormularioRemarcacao({
  consulta,
  onSalvo,
  onCancelar,
}: FormularioRemarcacaoProps) {
  const [dataHora, setDataHora] = useState(() =>
    paraCampo(new Date(consulta.dataHora)),
  );
  const [erro, setErro] = useState<string>();
  const [errosGerais, setErrosGerais] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const encontrado = validarDataHora(
      dataHora,
      new Date(),
      'Não é possível remarcar para uma data e hora no passado.',
    );
    setErro(encontrado);
    setErrosGerais([]);
    if (encontrado) return;

    setEnviando(true);
    try {
      await remarcarConsulta(consulta.id, paraIsoNaClinica(dataHora));
      onSalvo('Consulta remarcada.');
    } catch (falha) {
      setErrosGerais(mensagensDoErro(falha));
      setEnviando(false);
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-4">
      {errosGerais.length > 0 && <Alerta mensagens={errosGerais} />}
      <div>
        <p className="font-semibold text-preto">{consulta.nomePaciente}</p>
        <p className="text-sm text-grafite">
          Data atual: {formatarDataHora(consulta.dataHora)}
        </p>
      </div>
      <Campo id="novaDataHora" rotulo="Nova data e hora" erro={erro}>
        <input
          id="novaDataHora"
          type="datetime-local"
          value={dataHora}
          min={paraCampo()}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? 'novaDataHora-erro' : undefined}
          className={ESTILO_DE_ENTRADA}
          onChange={(evento) => {
            setDataHora(evento.target.value);
            setErro(undefined);
          }}
        />
      </Campo>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Botao variante="secundario" onClick={onCancelar} disabled={enviando}>
          Voltar
        </Botao>
        <Botao type="submit" disabled={enviando}>
          {enviando ? 'Salvando…' : 'Remarcar consulta'}
        </Botao>
      </div>
    </form>
  );
}
