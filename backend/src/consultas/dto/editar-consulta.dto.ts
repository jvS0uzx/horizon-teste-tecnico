import { IsOptional } from 'class-validator';
import {
  CpfPaciente,
  DataHora,
  Especialidade,
  NomePaciente,
  Observacoes,
} from './campos.js';

export class EditarConsultaDto {
  @IsOptional()
  @NomePaciente()
  nomePaciente?: string;

  @IsOptional()
  @CpfPaciente()
  cpfPaciente?: string;

  @IsOptional()
  @DataHora()
  dataHora?: string;

  @IsOptional()
  @Especialidade()
  especialidade?: string;

  @Observacoes()
  observacoes?: string | null;
}
