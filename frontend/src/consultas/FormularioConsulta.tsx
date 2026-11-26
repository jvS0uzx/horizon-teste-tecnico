import { useState, type FormEvent } from 'react';
import { mensagensDoErro } from '../api/cliente.ts';
import { agendarConsulta } from '../api/consultas.ts';
import { Alerta } from '../componentes/Alerta.tsx';
import { Botao } from '../componentes/Botao.tsx';
import { Campo, ESTILO_DE_ENTRADA } from '../componentes/Campo.tsx';
import { mascararCpf } from '../utilitarios/cpf.ts';
import { agoraParaCampo, paraIsoNaClinica } from '../utilitarios/datas.ts';
import {
  validarConsulta,
  type CamposDaConsulta,
  type ErrosDaConsulta,
} from './validacao.ts';

const CAMPOS_VAZIOS: CamposDaConsulta = {
  nomePaciente: '',
  cpfPaciente: '',
  dataHora: '',
  especialidade: '',
  observacoes: '',
};

interface FormularioConsultaProps {
  onAgendada: () => void;
  onCancelar: () => void;
}

export function FormularioConsulta({
  onAgendada,
  onCancelar,
}: FormularioConsultaProps) {
  const [campos, setCampos] = useState(CAMPOS_VAZIOS);
  const [erros, setErros] = useState<ErrosDaConsulta>({});
  const [errosDoServidor, setErrosDoServidor] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);

  function alterar(campo: keyof CamposDaConsulta, valor: string) {
    setCampos((atuais) => ({
      ...atuais,
      [campo]: campo === 'cpfPaciente' ? mascararCpf(valor) : valor,
    }));
    setErros((atuais) => ({ ...atuais, [campo]: undefined }));
  }

  function propriedadesDe(campo: keyof CamposDaConsulta) {
    return {
      id: campo,
      name: campo,
      value: campos[campo],
      'aria-invalid': Boolean(erros[campo]),
      'aria-describedby': erros[campo] ? `${campo}-erro` : undefined,
      className: ESTILO_DE_ENTRADA,
    };
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const encontrados = validarConsulta(campos);
    setErros(encontrados);
    setErrosDoServidor([]);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      await agendarConsulta({
        nomePaciente: campos.nomePaciente.trim(),
        cpfPaciente: campos.cpfPaciente,
        dataHora: paraIsoNaClinica(campos.dataHora),
        especialidade: campos.especialidade.trim(),
        observacoes: campos.observacoes.trim() || undefined,
      });
      onAgendada();
    } catch (falha) {
      setErrosDoServidor(mensagensDoErro(falha));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-4">
      {errosDoServidor.length > 0 && <Alerta mensagens={errosDoServidor} />}

      <Campo
        id="nomePaciente"
        rotulo="Nome do paciente"
        erro={erros.nomePaciente}
      >
        <input
          {...propriedadesDe('nomePaciente')}
          autoComplete="name"
          maxLength={150}
          onChange={(evento) => alterar('nomePaciente', evento.target.value)}
        />
      </Campo>

      <Campo id="cpfPaciente" rotulo="CPF do paciente" erro={erros.cpfPaciente}>
        <input
          {...propriedadesDe('cpfPaciente')}
          inputMode="numeric"
          placeholder="000.000.000-00"
          maxLength={14}
          onChange={(evento) => alterar('cpfPaciente', evento.target.value)}
        />
      </Campo>

      <Campo id="dataHora" rotulo="Data e hora" erro={erros.dataHora}>
        <input
          {...propriedadesDe('dataHora')}
          type="datetime-local"
          min={agoraParaCampo()}
          onChange={(evento) => alterar('dataHora', evento.target.value)}
        />
      </Campo>

      <Campo
        id="especialidade"
        rotulo="Especialidade / motivo"
        erro={erros.especialidade}
      >
        <input
          {...propriedadesDe('especialidade')}
          maxLength={100}
          onChange={(evento) => alterar('especialidade', evento.target.value)}
        />
      </Campo>

      <Campo
        id="observacoes"
        rotulo="Observações"
        erro={erros.observacoes}
        opcional
      >
        <textarea
          {...propriedadesDe('observacoes')}
          rows={3}
          maxLength={1000}
          onChange={(evento) => alterar('observacoes', evento.target.value)}
        />
      </Campo>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Botao variante="secundario" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </Botao>
        <Botao type="submit" disabled={enviando}>
          {enviando ? 'Agendando…' : 'Agendar consulta'}
        </Botao>
      </div>
    </form>
  );
}
