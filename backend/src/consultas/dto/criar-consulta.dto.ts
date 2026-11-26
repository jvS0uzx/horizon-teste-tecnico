import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

const FORMATO_CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const FORMATO_DATA_HORA =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

const aparar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const apararOuOmitir = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() || undefined : value;

export class CriarConsultaDto {
  @Transform(aparar)
  @Length(3, 150, {
    message: 'O nome do paciente deve ter entre 3 e 150 caracteres.',
  })
  @IsString({ message: 'O nome do paciente deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do paciente é obrigatório.' })
  nomePaciente: string;

  @Matches(FORMATO_CPF, {
    message: 'O CPF do paciente deve estar no formato 000.000.000-00.',
  })
  @IsNotEmpty({ message: 'O CPF do paciente é obrigatório.' })
  cpfPaciente: string;

  @IsISO8601(
    { strict: true },
    { message: 'A data e hora da consulta não é uma data válida.' },
  )
  @Matches(FORMATO_DATA_HORA, {
    message:
      'A data e hora da consulta deve estar no formato ISO 8601 com fuso horário, como 2030-01-15T10:00:00-03:00.',
  })
  @IsNotEmpty({ message: 'A data e hora da consulta é obrigatória.' })
  dataHora: string;

  @Transform(aparar)
  @Length(3, 100, {
    message: 'A especialidade deve ter entre 3 e 100 caracteres.',
  })
  @IsString({ message: 'A especialidade deve ser um texto.' })
  @IsNotEmpty({ message: 'A especialidade é obrigatória.' })
  especialidade: string;

  @Transform(apararOuOmitir)
  @MaxLength(1000, {
    message: 'As observações devem ter no máximo 1000 caracteres.',
  })
  @IsString({ message: 'As observações devem ser um texto.' })
  @IsOptional()
  observacoes?: string;
}
