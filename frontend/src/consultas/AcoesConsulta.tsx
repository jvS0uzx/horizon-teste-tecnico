import type { Consulta, StatusFinal } from '../api/consultas.ts';
import { Botao } from '../componentes/Botao.tsx';

interface AcoesConsultaProps {
  consulta: Consulta;
  onAlterarStatus: (consulta: Consulta, status: StatusFinal) => void;
}

export function AcoesConsulta({
  consulta,
  onAlterarStatus,
}: AcoesConsultaProps) {
  const { realizar, cancelar } = consulta.acoesPermitidas;
  if (!realizar && !cancelar) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {realizar && (
        <Botao onClick={() => onAlterarStatus(consulta, 'REALIZADA')}>
          Realizar
        </Botao>
      )}
      {cancelar && (
        <Botao
          variante="secundario"
          onClick={() => onAlterarStatus(consulta, 'CANCELADA')}
        >
          Cancelar
        </Botao>
      )}
    </div>
  );
}
