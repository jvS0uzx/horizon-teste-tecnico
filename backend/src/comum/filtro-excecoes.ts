import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErroRegraDeNegocio, ErroValidacao } from './erros.js';

interface ErroTraduzido {
  statusCode: number;
  mensagens: string[];
}

const TITULO_POR_STATUS: Record<number, string> = {
  400: 'Requisição inválida',
  404: 'Recurso não encontrado',
  409: 'Conflito',
  413: 'Requisição muito grande',
  415: 'Tipo de conteúdo não suportado',
  422: 'Regra de negócio violada',
  500: 'Erro interno',
};

const MENSAGEM_ANTES_DA_ROTA: Record<number, string> = {
  400: 'O corpo da requisição não é um JSON válido.',
  404: 'O recurso solicitado não existe.',
  413: 'O corpo da requisição excede o tamanho máximo permitido.',
  415: 'O tipo de conteúdo da requisição não é suportado.',
};

const ERRO_INESPERADO: ErroTraduzido = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  mensagens: ['Ocorreu um erro inesperado. Tente novamente em instantes.'],
};

@Catch()
export class FiltroExcecoes implements ExceptionFilter {
  private readonly logger = new Logger(FiltroExcecoes.name);

  catch(excecao: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const requisicao = http.getRequest<Request>();
    const resposta = http.getResponse<Response>();
    const { statusCode, mensagens } = this.traduzir(excecao, requisicao);

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        excecao instanceof Error ? excecao.stack : String(excecao),
      );
    }

    resposta.status(statusCode).json({
      statusCode,
      erro: TITULO_POR_STATUS[statusCode] ?? 'Erro',
      mensagens,
      caminho: requisicao.originalUrl,
      dataHora: new Date().toISOString(),
    });
  }

  private traduzir(excecao: unknown, requisicao: Request): ErroTraduzido {
    if (excecao instanceof ErroValidacao) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        mensagens: [excecao.message],
      };
    }

    if (excecao instanceof ErroRegraDeNegocio) {
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        mensagens: [excecao.message],
      };
    }

    if (requisicao.route === undefined) {
      return this.traduzirErroAntesDaRota(excecao);
    }

    if (excecao instanceof HttpException) {
      return {
        statusCode: excecao.getStatus(),
        mensagens: this.mensagensDe(excecao),
      };
    }

    return ERRO_INESPERADO;
  }

  private traduzirErroAntesDaRota(excecao: unknown): ErroTraduzido {
    const statusCode =
      excecao instanceof HttpException
        ? excecao.getStatus()
        : (excecao as { status?: unknown }).status;

    if (typeof statusCode !== 'number' || statusCode >= 500) {
      return ERRO_INESPERADO;
    }

    return {
      statusCode,
      mensagens: [
        MENSAGEM_ANTES_DA_ROTA[statusCode] ?? 'A requisição é inválida.',
      ],
    };
  }

  private mensagensDe(excecao: HttpException): string[] {
    const corpo = excecao.getResponse();
    const mensagem =
      typeof corpo === 'string'
        ? corpo
        : (corpo as { message?: string | string[] }).message;

    if (Array.isArray(mensagem)) {
      return mensagem;
    }

    return [mensagem ?? excecao.message];
  }
}
