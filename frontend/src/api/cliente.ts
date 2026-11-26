const URL_DA_API = import.meta.env.VITE_API_URL;

const SEM_CONEXAO =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
const FALHA_GENERICA = 'Não foi possível concluir a operação. Tente novamente.';

export class ErroDaApi extends Error {
  readonly mensagens: string[];

  constructor(mensagens: string[]) {
    super(mensagens.join(' '));
    this.mensagens = mensagens;
  }
}

export function mensagensDoErro(erro: unknown): string[] {
  return erro instanceof ErroDaApi ? erro.mensagens : [FALHA_GENERICA];
}

export async function requisitar<T>(
  caminho: string,
  metodo = 'GET',
  corpo?: unknown,
): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`${URL_DA_API}${caminho}`, {
      method: metodo,
      headers:
        corpo === undefined
          ? undefined
          : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ErroDaApi([SEM_CONEXAO]);
  }

  const conteudo: unknown =
    resposta.status === 204
      ? undefined
      : await resposta.json().catch(() => undefined);

  if (!resposta.ok) {
    const mensagens = (conteudo as { mensagens?: string[] } | undefined)
      ?.mensagens;
    throw new ErroDaApi(mensagens ?? [FALHA_GENERICA]);
  }

  return conteudo as T;
}
