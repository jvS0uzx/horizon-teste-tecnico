import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function iniciar() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.API_PORTA ?? 3000);
}

await iniciar();
