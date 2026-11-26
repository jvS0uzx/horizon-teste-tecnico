<p align="center">
  <img src="frontend/src/assets/horizon-logo.svg" alt="Horizon Tecnologia" width="240">
</p>

# Agendamento de Consultas

Sistema de agendamento de consultas de uma clínica: cadastro, edição, remarcação, mudança de
status, exclusão e listagem de consultas com paginação e filtros. Todas as regras de negócio são
aplicadas no servidor; a tela só oferece as ações que o servidor aceitaria.

| Parte | Tecnologia |
|---|---|
| Back-end | NestJS 12 (TypeScript, padrão MVC) com TypeORM 1.1 |
| Banco de dados | PostgreSQL 18 (imagem `postgres:18-alpine`, testado na 18.6) |
| Front-end | React 19 + Vite 8 (TypeScript) com Tailwind CSS 4 |
| Ambiente | Docker Compose (banco, API e front-end) |

## Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura](#estrutura)
3. [Como rodar com Docker](#como-rodar-com-docker)
4. [Banco de dados](#banco-de-dados)
5. [Migrations](#migrations)
6. [Seed](#seed)
7. [Como rodar sem Docker](#como-rodar-sem-docker)
8. [API](#api)
9. [Regras de negócio e decisões](#regras-de-negócio-e-decisões)
10. [Como testar cada seção](#como-testar-cada-seção)

## Pré-requisitos

| Ferramenta | Versão | Quando é necessária |
|---|---|---|
| Docker com Docker Compose v2 (`docker compose`) | Docker 24 ou mais recente (testado no 29.10 com o Compose 5.4) | sempre |
| Node.js e npm | Node.js 24 com npm 11 | só para rodar a API ou o front-end fora do Docker |
| Git | qualquer versão recente ([download](https://git-scm.com/downloads)) | para clonar o repositório |

Portas livres: **5433** (banco), **3000** (API) e **5173** (front-end). Para usar outras, veja
[Portas](#portas).

No Windows, rode os comandos deste README no PowerShell. Os exemplos com `curl` da seção
[Como testar cada seção](#como-testar-cada-seção) usam a sintaxe do bash: rode-os no Git Bash ou no
WSL.

### Instalar o Docker no Windows

O Docker Desktop já traz o Docker Engine e o Docker Compose v2. Guia oficial:
<https://docs.docker.com/desktop/setup/install/windows-install/>.

Requisitos: Windows 10 22H2 (build 19045) ou Windows 11 23H2 (build 22631) ou mais recente, 64
bits, virtualização ativada na BIOS/UEFI e WSL 2 na versão 2.1.5 ou mais recente.

1. No PowerShell **como administrador**, instale ou atualize o WSL 2 e reinicie o computador:

   ```powershell
   wsl --install
   wsl --update
   ```

2. Instale o Docker Desktop por uma das opções:
   - **Instalador:** baixe o
     [Docker Desktop Installer.exe](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe)
     e siga o assistente.
   - **Linha de comando**, no PowerShell:

     ```powershell
     winget install -e --id Docker.DockerDesktop
     ```

3. Abra o Docker Desktop pelo menu Iniciar e aceite os termos de uso. Ele precisa estar aberto
   sempre que você for usar o projeto.

### Instalar o Docker no Ubuntu

Guia oficial: <https://docs.docker.com/engine/install/ubuntu/> (Ubuntu 22.04, 24.04, 26.04 e
26.10, 64 bits). Se já houver pacotes Docker não oficiais instalados, como `docker.io` ou
`docker-compose`, remova-os antes, como mostra o guia.

```bash
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

### Instalar o Docker no Fedora

Guia oficial: <https://docs.docker.com/engine/install/fedora/> (Fedora 43, 44 e 45).

```bash
sudo dnf config-manager addrepo --from-repofile https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

Se o `dnf` pedir para aceitar a chave GPG, confira se a impressão digital é
`060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35`.

### Usar o Docker sem `sudo` no Linux

Os comandos deste README chamam `docker` sem `sudo`. Para isso, adicione seu usuário ao grupo
`docker` (guia oficial: <https://docs.docker.com/engine/install/linux-postinstall/>):

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

O primeiro comando só avisa se o grupo já existir. Depois, saia da sessão e entre de novo para o
grupo valer. Atenção: quem está no grupo `docker` tem, na prática, permissão de administrador na
máquina. Se preferir não fazer isso, coloque `sudo` antes de cada comando `docker`.

### Conferir o Docker

```bash
docker --version
docker compose version
```

Esperado: Docker 24 ou mais recente e o Compose respondendo com a versão 2 ou mais recente.

### Instalar o Node.js 24 e o npm 11

Só é necessário para rodar a API ou o front-end fora do Docker. O npm 11 já vem junto com o
Node.js 24. Página oficial da versão 24: <https://nodejs.org/en/download/archive/v24>. A versão
LTS mais recente do site já é a 26; instale a **24**.

**Windows**, por uma das opções:

- **Instalador:** baixe o `node-v24.<versão>-x64.msi` em <https://nodejs.org/dist/latest-v24.x/> e
  siga o assistente.
- **Linha de comando**, com o gerenciador de versões [fnm](https://github.com/Schniz/fnm), no
  PowerShell. Instale o fnm, feche e abra o PowerShell de novo e instale o Node.js 24:

  ```powershell
  winget install Schniz.fnm
  ```

  ```powershell
  fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
  fnm install 24
  fnm use 24
  ```

  Para o `node` continuar disponível nas próximas janelas, adicione a linha `fnm env ...` acima ao
  seu perfil do PowerShell (`notepad $PROFILE`).

**Linux (Ubuntu e Fedora)**, com o gerenciador de versões [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
```

### Conferir o Node.js e o npm

```bash
node -v
npm -v
```

Esperado: `v24.` seguido da versão e `11.` seguido da versão.

## Estrutura

```
.
├── docker-compose.yml        serviços banco, api e web
├── .env.example              variáveis do Docker Compose
├── backend/                  API REST em NestJS
│   ├── Dockerfile
│   ├── .env.example          variáveis da API fora do Docker
│   └── src/
│       ├── main.ts           inicialização, CORS, validação e filtro de erros
│       ├── banco/            conexão, migration e seed
│       ├── comum/            erros de domínio, filtro de exceções e validação
│       └── consultas/        módulo de consultas
│           ├── consulta.entity.ts        Model: dados e regras da consulta
│           ├── consultas.repository.ts   acesso ao banco
│           ├── consultas.service.ts      casos de uso
│           ├── consultas.controller.ts   rotas REST
│           └── dto/                      entrada validada e formato da resposta
└── frontend/                 interface em React
    ├── Dockerfile
    ├── .env.example          endereço da API usado pelo front-end
    └── src/
        ├── api/              cliente HTTP e chamadas da API
        ├── componentes/      botões, campos, diálogo e paginação
        ├── consultas/        lista, filtros, formulários e ações
        └── utilitarios/      datas no fuso da clínica e máscara de CPF
```

O back-end segue o MVC: o **Controller** recebe a requisição já validada pelos DTOs, o
**Service** coordena o caso de uso, o **Repository** fala com o banco e o **Model** (`Consulta`)
guarda as regras de status, de datas e das ações permitidas. A **View** é o front-end em React.

## Como rodar com Docker

Caminho recomendado: sobe banco, API e front-end sem instalar Node.js.

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/jvS0uzx/horizon-teste-tecnico.git
   cd horizon-teste-tecnico
   ```

2. Copie as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

3. Construa as imagens e suba os três serviços:

   ```bash
   docker compose up -d --build
   ```

4. Crie a tabela de consultas:

   ```bash
   docker compose exec api npm run migration:run
   ```

5. Carregue as consultas de exemplo:

   ```bash
   docker compose exec api npm run seed
   ```

6. Acesse:
   - Front-end: <http://localhost:5173>
   - API: <http://localhost:3000/consultas>

Para parar: `docker compose down` (os dados continuam no volume `dados-banco`). Para parar e
apagar os dados: `docker compose down -v`.

### Portas

| Variável no `.env` | Padrão | Serviço |
|---|---|---|
| `PORTA_BANCO` | 5433 | PostgreSQL |
| `PORTA_API` | 3000 | API |
| `PORTA_WEB` | 5173 | Front-end |

Se alguma porta estiver ocupada, altere o valor no `.env` e rode `docker compose up -d --build`
de novo. O Compose ajusta sozinho o endereço da API usado pelo front-end e a origem liberada no
CORS da API.

## Banco de dados

- **Versão:** PostgreSQL 18, imagem oficial `postgres:18-alpine` (testado na 18.6).
- **Criação:** na primeira subida, o serviço `banco` cria o usuário, a senha e o banco
  `agendamento` a partir das variáveis `BANCO_USUARIO`, `BANCO_SENHA` e `BANCO_NOME` do `.env`. Os
  dados ficam no volume `dados-banco`.
- **Porta:** 5433 na sua máquina, para não conflitar com um PostgreSQL local na 5432.

Para subir só o banco: `docker compose up -d banco`. Para conferir a versão:

```bash
docker compose exec banco psql -U agendamento -d agendamento -c "select version();"
```

Resultado esperado: `PostgreSQL 18.x`.

### Tabela `consultas`

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | chave primária, gerada pelo banco |
| `nome_paciente` | `varchar(150)` | obrigatório, de 3 a 150 caracteres |
| `cpf_paciente` | `char(14)` | obrigatório, formato `000.000.000-00` |
| `data_hora` | `timestamptz` | obrigatório, gravado com fuso horário |
| `especialidade` | `varchar(100)` | obrigatório, de 3 a 100 caracteres |
| `observacoes` | `varchar(1000)` | opcional, até 1000 caracteres |
| `status` | enum `status_consulta` | `AGENDADA` (padrão), `REALIZADA` ou `CANCELADA` |
| `criado_em` | `timestamptz` | preenchido na criação |
| `atualizado_em` | `timestamptz` | atualizado a cada alteração |

O banco também garante as regras com `CHECK` (tamanho mínimo do nome e da especialidade, formato
do CPF) e com o índice único parcial `uq_consultas_cpf_data_hora_ativa`, que impede duas consultas
não canceladas com o mesmo CPF na mesma data e hora.

## Migrations

A migration `CriarConsultas` cria o enum `status_consulta`, a tabela `consultas`, as regras
`CHECK`, o índice único de duplicidade e um índice por data e hora.

| Ação | Com Docker | Sem Docker (em `backend/`) |
|---|---|---|
| Aplicar | `docker compose exec api npm run migration:run` | `npm run build && npm run migration:run` |
| Desfazer a última | `docker compose exec api npm run migration:revert` | `npm run migration:revert` |

Resultado esperado ao aplicar: `Migration CriarConsultas1795649071703 has been executed
successfully.` No Docker, os comandos `migration:run`, `migration:revert` e `seed` mostram antes a
linha `.env not found. Continuing without it.`: é só um aviso do Node, porque dentro do contêiner
as variáveis vêm do Docker Compose e não de um arquivo `.env`. Para conferir a tabela:

```bash
docker compose exec banco psql -U agendamento -d agendamento -c "\d consultas"
```

## Seed

O seed cria **18 consultas de exemplo** com datas relativas ao dia em que ele roda, no fuso da
clínica:

- **4 Realizadas**, em dias anteriores.
- **4 Canceladas**, no passado e no futuro.
- **10 Agendadas**: duas para **hoje** (a ação "Realizar" aparece nelas) e oito para os próximos
  dias.
- A paciente Fernanda Costa tem uma consulta Cancelada e outra Agendada no mesmo dia e horário,
  mostrando que o cancelamento libera o horário para o mesmo CPF.

| Com Docker | Sem Docker (em `backend/`, depois do `npm run build`) |
|---|---|
| `docker compose exec api npm run seed` | `npm run seed` |

Resultado esperado: `Seed aplicado: 18 consultas de exemplo criadas.` O seed só insere dados se a
tabela estiver vazia; rodando de novo, ele responde `A tabela de consultas já tem dados. O seed
não foi aplicado.` e não altera nada. Para recomeçar do zero, desfaça a migration, aplique de novo
e rode o seed.

## Como rodar sem Docker

Útil para desenvolver. O banco continua no Docker; API e front-end rodam com Node.js 24.

1. Na raiz, suba o banco:

   ```bash
   cp .env.example .env
   docker compose up -d banco
   ```

2. Em outro terminal, a API:

   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run build
   npm run migration:run
   npm run seed
   npm run start:dev
   ```

   A API fica em <http://localhost:3000>. Para rodar a versão compilada:
   `npm run start:prod`.

3. Em outro terminal, o front-end:

   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

   O front-end fica em <http://localhost:5173>. Para gerar a versão de produção:
   `npm run build`.

Variáveis da API (`backend/.env`):

| Variável | Padrão | Uso |
|---|---|---|
| `API_PORTA` | 3000 | porta da API |
| `ORIGEM_FRONTEND` | `http://localhost:5173` | origem liberada no CORS |
| `BANCO_HOST`, `BANCO_PORTA` | `localhost`, 5433 | endereço do banco |
| `BANCO_USUARIO`, `BANCO_SENHA`, `BANCO_NOME` | iguais ao `.env` da raiz | acesso ao banco |

Variável do front-end (`frontend/.env`): `VITE_API_URL`, endereço da API
(`http://localhost:3000`).

## API

Base: `http://localhost:3000`. Corpo e resposta em JSON. Datas no formato ISO 8601 **com fuso
horário**, por exemplo `2030-01-15T10:00:00-03:00`.

| Método | Rota | Ação | Sucesso |
|---|---|---|---|
| `GET` | `/consultas` | lista com paginação e filtros | 200 |
| `GET` | `/consultas/:id` | busca uma consulta | 200 |
| `POST` | `/consultas` | agenda | 201 |
| `PATCH` | `/consultas/:id` | edita os campos enviados | 200 |
| `PATCH` | `/consultas/:id/data-hora` | remarca (só data e hora) | 200 |
| `PATCH` | `/consultas/:id/status` | marca como `REALIZADA` ou `CANCELADA` | 200 |
| `DELETE` | `/consultas/:id` | exclui definitivamente | 204 |

Parâmetros de `GET /consultas`:

| Parâmetro | Exemplo | Efeito |
|---|---|---|
| `pagina` | `2` | página, a partir de 1 (padrão 1) |
| `limite` | `10` | itens por página, de 1 a 100 (padrão 10) |
| `busca` | `maria` ou `123.456` | parte do nome (sem diferenciar maiúsculas) ou do CPF, com ou sem máscara |
| `status` | `AGENDADA` | `AGENDADA`, `REALIZADA` ou `CANCELADA` |
| `data` | `2030-01-15` | consultas do dia, no fuso da clínica |

A listagem é ordenada por data e hora e responde `{ "dados": [...], "meta": { "total",
"pagina", "limite", "totalPaginas" } }`. Cada consulta traz o campo `acoesPermitidas`, com as
ações que o servidor aceita naquele momento; é ele que define os botões da tela.

Exemplo de agendamento:

```bash
curl -X POST http://localhost:3000/consultas \
  -H "Content-Type: application/json" \
  -d '{"nomePaciente":"Maria Souza","cpfPaciente":"123.456.789-00","dataHora":"2030-01-15T10:00:00-03:00","especialidade":"Cardiologia","observacoes":"Trazer exames."}'
```

### Erros

Todo erro responde no mesmo formato, com mensagens em português e sem detalhes internos:

```json
{
  "statusCode": 422,
  "erro": "Regra de negócio violada",
  "mensagens": ["Esta consulta já foi realizada e não pode mudar de status."],
  "caminho": "/consultas/…/status",
  "dataHora": "2030-01-15T13:00:00.000Z"
}
```

| Código | Quando |
|---|---|
| 400 | campo inválido, ausente ou não permitido; JSON malformado; data no passado; id malformado; parâmetro de listagem inválido |
| 404 | consulta ou rota inexistente |
| 409 | já existe consulta não cancelada para o mesmo CPF na mesma data e hora |
| 413 | corpo da requisição grande demais |
| 415 | tipo de conteúdo não suportado |
| 422 | regra de negócio: mudar status de consulta finalizada, editar ou remarcar fora de Agendada, realizar fora do dia agendado |
| 500 | erro inesperado ou banco fora do ar, com mensagem genérica (o detalhe fica só no log) |

## Regras de negócio e decisões

- **Status:** toda consulta nasce `AGENDADA`. Ela pode ir para `REALIZADA` ou `CANCELADA`, e
  essas mudanças são definitivas: não há volta para Agendada nem troca entre Realizada e
  Cancelada.
- **Agendar:** nome de 3 a 150 caracteres, CPF no formato `000.000.000-00` (só o formato, sem
  conferir dígitos verificadores), data e hora no futuro, especialidade de 3 a 100 caracteres e
  observações opcionais até 1000 caracteres. Espaços nas pontas são removidos antes da
  validação.
- **Duplicidade:** não pode haver duas consultas com o mesmo CPF na mesma data e hora. Consulta
  Cancelada **não** bloqueia: depois de cancelar, o paciente pode agendar de novo naquele
  horário. A regra é verificada no Service e garantida pelo índice único parcial, inclusive em
  requisições simultâneas.
- **Editar:** só enquanto Agendada. Nome, CPF, data e hora, especialidade e observações podem
  mudar; a nova data e hora não pode estar no passado nem gerar duplicidade. O status não muda
  pela edição.
- **Remarcar:** só enquanto Agendada; muda apenas a data e a hora, para o futuro e sem
  duplicidade.
- **Realizar:** só no dia agendado (de 00:00 a 23:59 no fuso da clínica), antes ou depois do
  horário marcado.
- **Cancelar:** só enquanto Agendada.
- **Excluir:** permitido em qualquer status, apaga definitivamente.
- **Consulta Realizada ou Cancelada** não pode ser editada nem remarcada; só excluída.
- **Fuso da clínica:** `America/Sao_Paulo`. "No passado", "hoje" e o filtro por data usam esse
  fuso, e as datas são gravadas com fuso (`timestamptz`).
- **Filtro de data:** um dia por vez (`AAAA-MM-DD`).

## Como testar cada seção

Com o sistema no ar e o seed aplicado, abra <http://localhost:5173>. No celular (ou com a largura
da janela reduzida) a tabela vira uma lista de cartões, com as mesmas ações. Os botões de editar,
remarcar, cancelar e excluir são ícones; o nome de cada ação aparece ao passar o mouse.

### Listar e paginar

1. Abra a tela inicial.
   - Esperado: as 10 primeiras das 18 consultas, por data e hora, com o selo de status em
     amarelo (Agendada), verde (Realizada) ou vermelho (Cancelada), e o texto "Página 1 de 2 · 18
     consultas".
2. Clique em "Próxima".
   - Esperado: as 8 consultas restantes e "Página 2 de 2"; "Próxima" fica desabilitado.

### Filtrar

Os filtros se aplicam sozinhos, sem botão: a busca filtra enquanto você digita (depois de uma
pausa curta) e o status e a data, assim que mudam.

1. Em "Nome ou CPF", digite `fernanda`.
   - Esperado: 3 consultas da Fernanda Costa.
2. Troque a busca pelo CPF `345.678.901-23` e depois por `34567890123`.
   - Esperado: as mesmas 3 consultas nas duas buscas, achadas pelo CPF com ou sem máscara.
3. Apague a busca e escolha o status "Cancelada".
   - Esperado: 4 consultas Canceladas.
4. Volte o status para "Todos" e selecione a data de hoje.
   - Esperado: as 2 consultas Agendadas para hoje.
5. Selecione uma data sem consultas.
   - Esperado: "Nenhuma consulta encontrada com esses filtros."
6. Clique em "Limpar".
   - Esperado: as 18 consultas de volta, na página 1.

### Agendar

1. Clique em "Nova consulta", preencha nome, CPF (a máscara é aplicada ao digitar), uma data e
   hora futura e a especialidade, e clique em "Agendar consulta".
   - Esperado: aviso "Consulta agendada com sucesso." e a consulta na lista como Agendada.
2. Tente agendar com o nome `Jo`.
   - Esperado: "O nome do paciente deve ter entre 3 e 150 caracteres."
3. Tente agendar com o CPF incompleto, por exemplo `123.456`.
   - Esperado: "O CPF do paciente deve estar no formato 000.000.000-00."
4. Tente agendar com uma data e hora que já passou.
   - Esperado: "Não é possível agendar uma consulta no passado."
5. Agende com o CPF `901.234.567-89` para amanhã às 08:30 (mesmo CPF e horário da Camila
   Ferreira, que está Agendada).
   - Esperado: "Já existe uma consulta para este CPF nesta data e hora."
6. Cancele uma consulta Agendada para os próximos dias e agende outra com o mesmo CPF, data e
   hora.
   - Esperado: agendamento aceito, porque o cancelamento libera o horário.

### Editar

1. Numa consulta Agendada, clique no ícone de lápis, troque a especialidade e clique em "Salvar
   alterações".
   - Esperado: aviso "Consulta atualizada." e a especialidade nova na lista.
2. Abra a edição e salve sem mudar nada.
   - Esperado: "Nenhuma alteração para salvar."
3. Numa consulta Realizada ou Cancelada:
   - Esperado: não há ícone de lápis; só o de excluir.

### Remarcar

1. Numa consulta Agendada, clique no ícone de calendário, escolha uma data e hora futura e
   confirme.
   - Esperado: aviso "Consulta remarcada." e a nova data na lista.
2. Tente remarcar para uma data e hora que já passou.
   - Esperado: "Não é possível remarcar para uma data e hora no passado."
3. Agende para a Camila Ferreira (CPF `901.234.567-89`) uma consulta depois de amanhã às 10:00
   e remarque essa consulta nova para amanhã às 08:30, horário da outra consulta dela.
   - Esperado: "Já existe uma consulta para este CPF nesta data e hora."

### Realizar

1. Numa das consultas Agendadas para hoje (Juliana Martins ou Paulo Henrique Dias), clique em
   "Realizar" e confirme.
   - Esperado: aviso "Consulta marcada como realizada.", selo verde e só o ícone de excluir.
2. Nas consultas Agendadas de outros dias:
   - Esperado: não há botão "Realizar".

### Cancelar

1. Numa consulta Agendada, clique no ícone de X e confirme.
   - Esperado: aviso "Consulta cancelada.", selo vermelho e só o ícone de excluir.

### Excluir

1. Em qualquer consulta, clique no ícone de lixeira.
   - Esperado: confirmação avisando que a exclusão é definitiva.
2. Confirme.
   - Esperado: aviso "Consulta excluída." e a consulta some da lista. Se ela era a última da
     página, a tela volta para a página anterior.

### Erros e casos de borda

1. Pare a API (`docker compose stop api`) e recarregue a tela.
   - Esperado: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
     Suba de novo com `docker compose start api`.
2. Pare o banco (`docker compose stop banco`) e recarregue a tela.
   - Esperado: "Ocorreu um erro inesperado. Tente novamente em instantes." Suba de novo com
     `docker compose start banco`.
3. Pela API, teste as validações do servidor, que valem mesmo sem passar pela tela:

   ```bash
   curl -i "http://localhost:3000/consultas?status=ADIADA"
   curl -i http://localhost:3000/consultas/123
   curl -i http://localhost:3000/consultas/00000000-0000-0000-0000-000000000000
   curl -i -X POST http://localhost:3000/consultas \
     -H "Content-Type: application/json" -d '{"nomePaciente":'
   curl -i -X POST http://localhost:3000/consultas \
     -H "Content-Type: application/json" \
     -d '{"nomePaciente":"Maria Souza","cpfPaciente":"123.456.789-00","dataHora":"2030-01-15T10:00:00-03:00","especialidade":"ab"}'
   ```

   - Esperado, na ordem: 400 "O status deve ser AGENDADA, REALIZADA ou CANCELADA."; 400 "O
     identificador da consulta é inválido."; 404 "Consulta não encontrada."; 400 "O corpo da
     requisição não é um JSON válido."; 400 "A especialidade deve ter entre 3 e 100
     caracteres."
4. Pela API, tente mudar o status de uma consulta Realizada (troque `<id>` pelo `id` de uma
   consulta Realizada, visto em `GET /consultas?status=REALIZADA`):

   ```bash
   curl -i -X PATCH http://localhost:3000/consultas/<id>/status \
     -H "Content-Type: application/json" -d '{"status":"CANCELADA"}'
   ```

   - Esperado: 422 "Esta consulta já foi realizada e não pode mudar de status."
