import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { FiltroExcecoes } from './comum/filtro-excecoes.js';
import { pipeValidacao } from './comum/validacao.js';

async function iniciar() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({ origin: config.getOrThrow<string>('ORIGEM_FRONTEND') });
  app.useGlobalPipes(pipeValidacao);
  app.useGlobalFilters(new FiltroExcecoes());

  await app.listen(config.get<string>('API_PORTA') ?? 3000);
}

await iniciar();
