import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Consulta } from './consulta.entity.js';
import { ConsultasService, PaginaDeConsultas } from './consultas.service.js';
import { CriarConsultaDto } from './dto/criar-consulta.dto.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';

const ID_DA_CONSULTA = new ParseUUIDPipe({
  exceptionFactory: () =>
    new BadRequestException('O identificador da consulta é inválido.'),
});

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly servico: ConsultasService) {}

  @Get()
  listar(@Query() filtro: ListarConsultasDto): Promise<PaginaDeConsultas> {
    return this.servico.listar(filtro);
  }

  @Get(':id')
  buscar(@Param('id', ID_DA_CONSULTA) id: string): Promise<Consulta> {
    return this.servico.buscar(id);
  }

  @Post()
  agendar(@Body() dados: CriarConsultaDto): Promise<Consulta> {
    return this.servico.agendar(dados);
  }
}
