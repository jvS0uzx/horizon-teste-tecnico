import {
  CpfPaciente,
  DataHora,
  Especialidade,
  NomePaciente,
  Observacoes,
} from './campos.js';

export class CriarConsultaDto {
  @NomePaciente()
  nomePaciente: string;

  @CpfPaciente()
  cpfPaciente: string;

  @DataHora()
  dataHora: string;

  @Especialidade()
  especialidade: string;

  @Observacoes()
  observacoes?: string | null;
}
