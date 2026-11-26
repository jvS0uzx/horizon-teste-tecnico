import type { Consulta } from '../api/consultas.ts';
import { Botao } from '../componentes/Botao.tsx';
import { BOTOES_DE_ACAO, type Acao } from './acoes.ts';

interface AcoesConsultaProps {
  consulta: Consulta;
  onEscolher: (consulta: Consulta, acao: Acao) => void;
}

export function AcoesConsulta({ consulta, onEscolher }: AcoesConsultaProps) {
  const botoes = BOTOES_DE_ACAO.filter(
    ({ permissao }) => consulta.acoesPermitidas[permissao],
  );

  return (
    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
      {botoes.map(({ acao, rotulo, variante, icone: Icone }) => (
        <Botao
          key={acao}
          variante={variante}
          soIcone={Boolean(Icone)}
          aria-label={rotulo}
          title={rotulo}
          onClick={() => onEscolher(consulta, acao)}
        >
          {Icone ? <Icone size={18} aria-hidden /> : rotulo}
        </Botao>
      ))}
    </div>
  );
}
