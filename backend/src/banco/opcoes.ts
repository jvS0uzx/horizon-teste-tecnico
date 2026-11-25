import { DataSourceOptions } from 'typeorm';
import { Consulta } from '../consultas/consulta.entity.js';
import { CriarConsultas1795649071703 } from './migrations/1795649071703-CriarConsultas.js';

export function opcoesDoBanco(
  variavel: (nome: string) => string,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: variavel('BANCO_HOST'),
    port: Number(variavel('BANCO_PORTA')),
    username: variavel('BANCO_USUARIO'),
    password: variavel('BANCO_SENHA'),
    database: variavel('BANCO_NOME'),
    entities: [Consulta],
    migrations: [CriarConsultas1795649071703],
  };
}
