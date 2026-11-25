import { DataSource } from 'typeorm';
import { opcoesDoBanco } from './opcoes-do-banco.js';

function variavelDeAmbiente(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`A variável de ambiente ${nome} não foi definida.`);
  }
  return valor;
}

export default new DataSource(opcoesDoBanco(variavelDeAmbiente));
