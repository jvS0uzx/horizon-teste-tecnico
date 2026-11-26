import { DataHora } from './campos.js';

export class RemarcarConsultaDto {
  @DataHora()
  dataHora: string;
}
