import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { EditarConsultaDto } from './dto/editar-consulta.dto.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';
import { RemarcarConsultaDto } from './dto/remarcar-consulta.dto.js';

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

  @Patch(':id')
  editar(
    @Param('id', ID_DA_CONSULTA) id: string,
    @Body() dados: EditarConsultaDto,
  ): Promise<ConsultaResposta> {
    return this.servico.editar(id, dados);
  }

  @Patch(':id/data-hora')
  remarcar(
    @Param('id', ID_DA_CONSULTA) id: string,
    @Body() dados: RemarcarConsultaDto,
  ): Promise<ConsultaResposta> {
    return this.servico.remarcar(id, dados);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  excluir(@Param('id', ID_DA_CONSULTA) id: string): Promise<void> {
    return this.servico.excluir(id);
  }

  @Patch(':id/status')
  alterarStatus(
    @Param('id', ID_DA_CONSULTA) id: string,
    @Body() dados: AlterarStatusDto,
  ): Promise<ConsultaResposta> {
    return this.servico.alterarStatus(id, dados);
  }
}
