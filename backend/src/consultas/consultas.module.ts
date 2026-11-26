import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './consulta.entity.js';
import { ConsultasController } from './consultas.controller.js';
import { ConsultasRepository } from './consultas.repository.js';
import { ConsultasService } from './consultas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta])],
  controllers: [ConsultasController],
  providers: [ConsultasService, ConsultasRepository],
})
export class ConsultasModule {}
