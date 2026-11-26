import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

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
}
