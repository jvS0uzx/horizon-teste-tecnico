import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriarConsultas1795649071703 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "status_consulta" AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA')
    `);

    await queryRunner.query(`
      CREATE TABLE "consultas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "nome_paciente" varchar(150) NOT NULL,
        "cpf_paciente" char(14) NOT NULL,
        "data_hora" timestamptz NOT NULL,
        "especialidade" varchar(100) NOT NULL,
        "observacoes" varchar(1000),
        "status" "status_consulta" NOT NULL DEFAULT 'AGENDADA',
        "criado_em" timestamptz NOT NULL DEFAULT now(),
        "atualizado_em" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "pk_consultas" PRIMARY KEY ("id"),
        CONSTRAINT "ck_consultas_nome_paciente" CHECK (char_length("nome_paciente") >= 3),
        CONSTRAINT "ck_consultas_cpf_paciente" CHECK ("cpf_paciente" ~ '^[0-9]{3}[.][0-9]{3}[.][0-9]{3}-[0-9]{2}$'),
        CONSTRAINT "ck_consultas_especialidade" CHECK (char_length("especialidade") >= 3)
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_consultas_cpf_data_hora_ativa"
        ON "consultas" ("cpf_paciente", "data_hora")
        WHERE "status" <> 'CANCELADA'
    `);

    await queryRunner.query(`
      CREATE INDEX "ix_consultas_data_hora" ON "consultas" ("data_hora")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "consultas"`);
    await queryRunner.query(`DROP TYPE "status_consulta"`);
  }
}
