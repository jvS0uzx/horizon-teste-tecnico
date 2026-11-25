<p align="center">
  <img src="frontend/src/assets/horizon-logo.svg" alt="Horizon Tecnologia" width="240">
</p>

# Agendamento de Consultas

Sistema de agendamento de consultas de uma clínica: cadastro, edição, remarcação, mudança de
status, exclusão e listagem de consultas, com as regras de negócio aplicadas no servidor.

| Parte | Tecnologia |
|---|---|
| Back-end | NestJS 12 (TypeScript, padrão MVC) |
| Banco de dados | PostgreSQL 18 (imagem `postgres:18-alpine`, testado na 18.6) |
| Front-end | React 19 + Vite 8 (TypeScript) |
| Ambiente | Docker Compose |

## Pré-requisitos

- Docker 24 ou mais recente, com o Docker Compose v2 (`docker compose`).
- Node.js 24 e npm 11, apenas para rodar a API ou o front-end fora do Docker e para os testes.

## Estrutura

```
.
├── docker-compose.yml   serviços do ambiente
├── .env.example         variáveis do Docker Compose
├── backend/             API REST em NestJS
└── frontend/            interface em React
```

## Banco de dados

O PostgreSQL 18 roda no serviço `banco` do Docker Compose, com o banco `agendamento` e os dados
persistidos no volume `dados-banco`. Ele fica exposto na porta **5433** da sua máquina, para não
conflitar com um PostgreSQL instalado localmente na 5432; para mudar, altere `PORTA_BANCO` no
`.env`.

1. Copie as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Suba o banco da aplicação:

   ```bash
   docker compose up -d banco
   ```

3. Confira a versão:

   ```bash
   docker compose exec banco psql -U agendamento -d agendamento -c "select version();"
   ```

   Resultado esperado: `PostgreSQL 18.x`.

## Migrations

A migration cria o tipo `status_consulta`, a tabela `consultas` e as regras que o próprio banco
garante: tamanho mínimo do nome e da especialidade, formato do CPF (`000.000.000-00`) e um índice
único que impede duas consultas não canceladas com o mesmo CPF na mesma data e hora.

1. Configure e instale a API:

   ```bash
   cd backend
   cp .env.example .env
   npm install
   ```

2. Compile e rode as migrations:

   ```bash
   npm run build
   npm run migration:run
   ```

3. Confira a tabela:

   ```bash
   docker compose exec banco psql -U agendamento -d agendamento -c "\d consultas"
   ```

Para desfazer a última migration: `npm run migration:revert`.
