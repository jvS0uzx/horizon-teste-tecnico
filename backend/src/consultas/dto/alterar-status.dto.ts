import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusConsulta } from '../status-consulta.enum.js';

export class AlterarStatusDto {
  @IsEnum(StatusConsulta, {
    message: 'O status deve ser AGENDADA, REALIZADA ou CANCELADA.',
  })
  @IsNotEmpty({ message: 'O status é obrigatório.' })
  status: StatusConsulta;
}
