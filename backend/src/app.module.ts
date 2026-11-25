import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { opcoesDoBanco } from './banco/opcoes-do-banco.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        opcoesDoBanco((nome) => config.getOrThrow<string>(nome)),
    }),
  ],
})
export class AppModule {}
