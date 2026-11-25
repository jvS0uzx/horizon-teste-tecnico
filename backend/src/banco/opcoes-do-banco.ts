import { DataSourceOptions } from 'typeorm';
import { Consulta } from '../consultas/consulta.entity.js';
import { CriarTabelaConsultas1764100000000 } from './migrations/1764100000000-criar-tabela-consultas.js';

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
    migrations: [CriarTabelaConsultas1764100000000],
  };
}
