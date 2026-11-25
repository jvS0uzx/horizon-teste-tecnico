export abstract class ErroDeDominio extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = new.target.name;
  }
}

export class ErroValidacao extends ErroDeDominio {}

export class ErroRegraDeNegocio extends ErroDeDominio {}
