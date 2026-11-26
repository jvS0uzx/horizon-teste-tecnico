import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { StatusConsulta } from '../status-consulta.enum.js';

const MENSAGEM_PAGINA =
  'A página deve ser um número inteiro maior ou igual a 1.';
const MENSAGEM_LIMITE = 'O limite deve ser um número inteiro entre 1 e 100.';

export class ListarConsultasDto {
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'A página informada é grande demais.',
  })
  @Min(1, { message: MENSAGEM_PAGINA })
  @IsInt({ message: MENSAGEM_PAGINA })
  @Type(() => Number)
  pagina: number = 1;

  @Max(100, { message: MENSAGEM_LIMITE })
  @Min(1, { message: MENSAGEM_LIMITE })
  @IsInt({ message: MENSAGEM_LIMITE })
  @Type(() => Number)
  limite: number = 10;

  @MaxLength(150, { message: 'A busca deve ter no máximo 150 caracteres.' })
  @IsString({ message: 'A busca deve ser um texto.' })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || undefined : value,
  )
  busca?: string;

  @IsEnum(StatusConsulta, {
    message: 'O status deve ser AGENDADA, REALIZADA ou CANCELADA.',
  })
  @IsOptional()
  status?: StatusConsulta;

  @IsISO8601({ strict: true }, { message: 'A data informada não é válida.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data deve estar no formato AAAA-MM-DD.',
  })
  @IsOptional()
  data?: string;
}
