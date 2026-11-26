import { useState, type FormEvent } from 'react';
import { mensagensDoErro } from '../api/cliente.ts';
import {
  agendarConsulta,
  editarConsulta,
  type Consulta,
  type DadosDaConsulta,
} from '../api/consultas.ts';
import { Alerta } from '../componentes/Alerta.tsx';
import { Botao } from '../componentes/Botao.tsx';
import { Campo, ESTILO_DE_ENTRADA } from '../componentes/Campo.tsx';
import { mascararCpf } from '../utilitarios/cpf.ts';
import { paraCampo, paraIsoNaClinica } from '../utilitarios/datas.ts';
import { ESPECIALIDADES } from './especialidades.ts';
import {
  validarConsulta,
  type CamposDaConsulta,
  type ErrosDaConsulta,
} from './validacao.ts';

function camposDe(consulta?: Consulta): CamposDaConsulta {
  return {
    nomePaciente: consulta?.nomePaciente ?? '',
    cpfPaciente: consulta?.cpfPaciente ?? '',
    dataHora: consulta ? paraCampo(new Date(consulta.dataHora)) : '',
    especialidade: consulta?.especialidade ?? '',
    observacoes: consulta?.observacoes ?? '',
  };
}

function paraEnvio(campos: CamposDaConsulta): DadosDaConsulta {
  return {
    nomePaciente: campos.nomePaciente.trim(),
    cpfPaciente: campos.cpfPaciente,
    dataHora: paraIsoNaClinica(campos.dataHora),
    especialidade: campos.especialidade.trim(),
    observacoes: campos.observacoes.trim() || null,
  };
}

function apenasAlterados(
  dados: DadosDaConsulta,
  originais: DadosDaConsulta,
): Partial<DadosDaConsulta> {
  return Object.fromEntries(
    Object.entries(dados).filter(
      ([campo, valor]) => originais[campo as keyof DadosDaConsulta] !== valor,
    ),
  );
}

interface FormularioConsultaProps {
  consulta?: Consulta;
  onSalvo: (mensagem: string) => void;
  onCancelar: () => void;
}

export function FormularioConsulta({
  consulta,
  onSalvo,
  onCancelar,
}: FormularioConsultaProps) {
  const [originais] = useState(() => camposDe(consulta));
  const [campos, setCampos] = useState(originais);
  const [erros, setErros] = useState<ErrosDaConsulta>({});
  const [errosGerais, setErrosGerais] = useState<string[]>([]);
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

  async function salvar(): Promise<string | undefined> {
    if (!consulta) {
      await agendarConsulta(paraEnvio(campos));
      return 'Consulta agendada com sucesso.';
    }
    const alterados = apenasAlterados(paraEnvio(campos), paraEnvio(originais));
    if (Object.keys(alterados).length === 0) {
      setErrosGerais(['Nenhuma alteração para salvar.']);
      return undefined;
    }
    await editarConsulta(consulta.id, alterados);
    return 'Consulta atualizada.';
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const encontrados = validarConsulta(
      campos,
      new Date(),
      consulta ? originais.dataHora : undefined,
    );
    setErros(encontrados);
    setErrosGerais([]);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      const mensagem = await salvar();
      if (mensagem) {
        onSalvo(mensagem);
        return;
      }
    } catch (falha) {
      setErrosGerais(mensagensDoErro(falha));
    }
    setEnviando(false);
  }

  return (
    <form noValidate onSubmit={enviar} className="flex flex-col gap-4">
      {errosGerais.length > 0 && <Alerta mensagens={errosGerais} />}

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
          min={paraCampo()}
          onChange={(evento) => alterar('dataHora', evento.target.value)}
        />
      </Campo>

      <Campo
        id="especialidade"
        rotulo="Especialidade"
        erro={erros.especialidade}
      >
        <select
          {...propriedadesDe('especialidade')}
          onChange={(evento) => alterar('especialidade', evento.target.value)}
        >
          <option value="">Selecione a especialidade</option>
          {ESPECIALIDADES.map((especialidade) => (
            <option key={especialidade} value={especialidade}>
              {especialidade}
            </option>
          ))}
        </select>
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
          Voltar
        </Botao>
        <Botao type="submit" disabled={enviando}>
          {enviando
            ? 'Salvando…'
            : consulta
              ? 'Salvar alterações'
              : 'Agendar consulta'}
        </Botao>
      </div>
    </form>
  );
}
