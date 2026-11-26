import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ConsultasService } from './consultas.service.js';
import { AlterarStatusDto } from './dto/alterar-status.dto.js';
import {
  ConsultaResposta,
  PaginaDeConsultas,
} from './dto/consulta-resposta.js';
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
  buscar(@Param('id', ID_DA_CONSULTA) id: string): Promise<ConsultaResposta> {
    return this.servico.buscar(id);
  }

  @Post()
  agendar(@Body() dados: CriarConsultaDto): Promise<ConsultaResposta> {
    return this.servico.agendar(dados);
  }

  @Patch(':id/status')
  alterarStatus(
    @Param('id', ID_DA_CONSULTA) id: string,
    @Body() dados: AlterarStatusDto,
  ): Promise<ConsultaResposta> {
    return this.servico.alterarStatus(id, dados);
  }
}
