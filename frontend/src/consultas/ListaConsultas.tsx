import type { Consulta } from '../api/consultas.ts';
import { Alerta } from '../componentes/Alerta.tsx';
import { Botao } from '../componentes/Botao.tsx';
import { formatarDataHora } from '../utilitarios/datas.ts';
import { AcoesConsulta } from './AcoesConsulta.tsx';
import type { Acao } from './acoes.ts';
import { SeloStatus } from './SeloStatus.tsx';

interface ListaConsultasProps {
  consultas: Consulta[];
  carregando: boolean;
  filtrando: boolean;
  erro?: string[];
  onTentarNovamente: () => void;
  onEscolherAcao: (consulta: Consulta, acao: Acao) => void;
}

export function ListaConsultas({
  consultas,
  carregando,
  filtrando,
  erro,
  onTentarNovamente,
  onEscolherAcao,
}: ListaConsultasProps) {
  if (erro) {
    return (
      <Alerta mensagens={erro}>
        <Botao className="mt-3" onClick={onTentarNovamente}>
          Tentar novamente
        </Botao>
      </Alerta>
    );
  }

  if (carregando && consultas.length === 0) {
    return (
      <p className="py-10 text-center text-grafite">Carregando consultas…</p>
    );
  }

  if (consultas.length === 0) {
    return (
      <div className="border border-dashed border-grafite bg-branco px-6 py-12 text-center">
        <p className="font-semibold text-preto">
          {filtrando
            ? 'Nenhuma consulta encontrada com esses filtros.'
            : 'Nenhuma consulta agendada.'}
        </p>
        <p className="mt-1 text-sm text-grafite">
          {filtrando
            ? 'Ajuste ou limpe os filtros para ver outras consultas.'
            : 'Use “Nova consulta” para agendar a primeira.'}
        </p>
      </div>
    );
  }

  return (
    <div aria-busy={carregando}>
      <ul className="space-y-3 md:hidden">
        {consultas.map((consulta) => (
          <li key={consulta.id} className="border border-grafite bg-branco p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-preto">
                {consulta.nomePaciente}
              </p>
              <SeloStatus status={consulta.status} />
            </div>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-grafite">Data</dt>
              <dd className="font-medium text-preto">
                {formatarDataHora(consulta.dataHora)}
              </dd>
              <dt className="text-grafite">CPF</dt>
              <dd className="text-preto">{consulta.cpfPaciente}</dd>
              <dt className="text-grafite">Especialidade</dt>
              <dd className="text-preto">{consulta.especialidade}</dd>
              {consulta.observacoes && (
                <>
                  <dt className="text-grafite">Obs.</dt>
                  <dd className="break-words text-preto">
                    {consulta.observacoes}
                  </dd>
                </>
              )}
            </dl>
            <div className="mt-4">
              <AcoesConsulta consulta={consulta} onEscolher={onEscolherAcao} />
            </div>
          </li>
        ))}
      </ul>

      <table className="hidden w-full border border-grafite bg-branco text-left text-sm md:table">
        <thead className="bg-preto text-xs tracking-wide text-branco uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Paciente
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Data e hora
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Especialidade
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((consulta) => (
            <tr key={consulta.id} className="border-t border-grafite align-top">
              <td className="px-4 py-3">
                <p className="font-semibold text-preto">
                  {consulta.nomePaciente}
                </p>
                <p className="whitespace-nowrap text-grafite">
                  {consulta.cpfPaciente}
                </p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-preto">
                {formatarDataHora(consulta.dataHora)}
              </td>
              <td className="px-4 py-3">
                <p className="text-preto">{consulta.especialidade}</p>
                {consulta.observacoes && (
                  <p className="mt-1 line-clamp-2 break-words text-grafite">
                    {consulta.observacoes}
                  </p>
                )}
              </td>
              <td className="px-4 py-3">
                <SeloStatus status={consulta.status} />
              </td>
              <td className="px-4 py-3">
                <AcoesConsulta
                  consulta={consulta}
                  onEscolher={onEscolherAcao}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
