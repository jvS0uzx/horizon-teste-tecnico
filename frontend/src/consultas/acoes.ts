import {
  CalendarClock,
  Pencil,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  alterarStatus,
  excluirConsulta,
  type AcoesPermitidas,
} from '../api/consultas.ts';

export type AcaoConfirmada = 'REALIZAR' | 'CANCELAR' | 'EXCLUIR';
export type Acao = 'EDITAR' | 'REMARCAR' | AcaoConfirmada;

export const BOTOES_DE_ACAO: {
  acao: Acao;
  rotulo: string;
  permissao: keyof AcoesPermitidas;
  variante: 'primario' | 'secundario';
  icone?: LucideIcon;
}[] = [
  {
    acao: 'REALIZAR',
    rotulo: 'Realizar',
    permissao: 'realizar',
    variante: 'primario',
  },
  {
    acao: 'EDITAR',
    rotulo: 'Editar',
    permissao: 'editar',
    variante: 'secundario',
    icone: Pencil,
  },
  {
    acao: 'REMARCAR',
    rotulo: 'Remarcar',
    permissao: 'remarcar',
    variante: 'secundario',
    icone: CalendarClock,
  },
  {
    acao: 'CANCELAR',
    rotulo: 'Cancelar',
    permissao: 'cancelar',
    variante: 'secundario',
    icone: X,
  },
  {
    acao: 'EXCLUIR',
    rotulo: 'Excluir',
    permissao: 'excluir',
    variante: 'secundario',
    icone: Trash2,
  },
];

const STATUS_DEFINITIVO =
  'A mudança de status é definitiva e não pode ser desfeita.';

export const CONFIRMACOES: Record<
  AcaoConfirmada,
  {
    titulo: string;
    aviso: string;
    confirmar: string;
    sucesso: string;
    executar: (id: string) => Promise<unknown>;
  }
> = {
  REALIZAR: {
    titulo: 'Marcar como realizada',
    aviso: STATUS_DEFINITIVO,
    confirmar: 'Marcar como realizada',
    sucesso: 'Consulta marcada como realizada.',
    executar: (id) => alterarStatus(id, 'REALIZADA'),
  },
  CANCELAR: {
    titulo: 'Cancelar consulta',
    aviso: STATUS_DEFINITIVO,
    confirmar: 'Cancelar consulta',
    sucesso: 'Consulta cancelada.',
    executar: (id) => alterarStatus(id, 'CANCELADA'),
  },
  EXCLUIR: {
    titulo: 'Excluir consulta',
    aviso:
      'A exclusão é definitiva: a consulta será apagada e não poderá ser recuperada.',
    confirmar: 'Excluir consulta',
    sucesso: 'Consulta excluída.',
    executar: excluirConsulta,
  },
};
