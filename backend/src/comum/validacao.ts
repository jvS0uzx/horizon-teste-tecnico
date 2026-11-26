import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function mensagensDe(erros: ValidationError[]): string[] {
  return erros.flatMap((erro) =>
    Object.entries(erro.constraints ?? {}).map(([regra, mensagem]) =>
      regra === 'whitelistValidation'
        ? `O campo ${erro.property} não é permitido.`
        : mensagem,
    ),
  );
}

export const pipeValidacao = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (erros) => new BadRequestException(mensagensDe(erros)),
});
