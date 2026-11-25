import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { FiltroExcecoes } from './comum/filtro-excecoes.js';
import { pipeValidacao } from './comum/validacao.js';

async function iniciar() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(pipeValidacao);
  app.useGlobalFilters(new FiltroExcecoes());
  await app.listen(process.env.API_PORTA ?? 3000);
}

await iniciar();
