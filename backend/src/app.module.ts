import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { opcoesDoBanco } from './banco/opcoes.js';
import { ConsultasModule } from './consultas/consultas.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        opcoesDoBanco((nome) => config.getOrThrow<string>(nome)),
    }),
    ConsultasModule,
  ],
})
export class AppModule {}
