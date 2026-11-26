import { Body, Controller, Post } from '@nestjs/common';
import { Consulta } from './consulta.entity.js';
import { ConsultasService } from './consultas.service.js';
import { CriarConsultaDto } from './dto/criar-consulta.dto.js';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly servico: ConsultasService) {}

  @Post()
  agendar(@Body() dados: CriarConsultaDto): Promise<Consulta> {
    return this.servico.agendar(dados);
  }
}
