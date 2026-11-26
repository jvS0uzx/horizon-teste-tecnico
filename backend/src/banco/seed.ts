import { FUSO_DA_CLINICA } from '../consultas/calendario.js';
import { Consulta } from '../consultas/consulta.entity.js';
import { EspecialidadeConsulta } from '../consultas/especialidade-consulta.enum.js';
import { StatusConsulta } from '../consultas/status-consulta.enum.js';
import fonteDados from './fonte-dados.js';

interface ConsultaDeExemplo {
  nomePaciente: string;
  cpfPaciente: string;
  diasAPartirDeHoje: number;
  horario: string;
  especialidade: EspecialidadeConsulta;
  status: StatusConsulta;
  observacoes?: string;
}

const { Agendada, Realizada, Cancelada } = StatusConsulta;

const CONSULTAS_DE_EXEMPLO: ConsultaDeExemplo[] = [
  {
    nomePaciente: 'Maria Oliveira Santos',
    cpfPaciente: '123.456.789-01',
    diasAPartirDeHoje: -10,
    horario: '09:00',
    especialidade: EspecialidadeConsulta.Cardiologia,
    status: Realizada,
    observacoes: 'Trazer exames de sangue recentes.',
  },
  {
    nomePaciente: 'Carlos Eduardo Lima',
    cpfPaciente: '234.567.890-12',
    diasAPartirDeHoje: -7,
    horario: '14:30',
    especialidade: EspecialidadeConsulta.Ortopedia,
    status: Realizada,
  },
  {
    nomePaciente: 'Fernanda Costa',
    cpfPaciente: '345.678.901-23',
    diasAPartirDeHoje: -5,
    horario: '11:00',
    especialidade: EspecialidadeConsulta.Dermatologia,
    status: Cancelada,
    observacoes: 'Paciente pediu o cancelamento por telefone.',
  },
  {
    nomePaciente: 'João Pedro Almeida',
    cpfPaciente: '456.789.012-34',
    diasAPartirDeHoje: -3,
    horario: '10:00',
    especialidade: EspecialidadeConsulta.ClinicaGeral,
    status: Realizada,
  },
  {
    nomePaciente: 'Ana Beatriz Rocha',
    cpfPaciente: '567.890.123-45',
    diasAPartirDeHoje: -2,
    horario: '15:00',
    especialidade: EspecialidadeConsulta.Pediatria,
    status: Cancelada,
  },
  {
    nomePaciente: 'Ricardo Souza',
    cpfPaciente: '678.901.234-56',
    diasAPartirDeHoje: -1,
    horario: '16:00',
    especialidade: EspecialidadeConsulta.Oftalmologia,
    status: Realizada,
    observacoes: 'Retorno em seis meses.',
  },
  {
    nomePaciente: 'Juliana Martins',
    cpfPaciente: '789.012.345-67',
    diasAPartirDeHoje: 0,
    horario: '09:00',
    especialidade: EspecialidadeConsulta.Ginecologia,
    status: Agendada,
  },
  {
    nomePaciente: 'Paulo Henrique Dias',
    cpfPaciente: '890.123.456-78',
    diasAPartirDeHoje: 0,
    horario: '17:30',
    especialidade: EspecialidadeConsulta.Neurologia,
    status: Agendada,
    observacoes: 'Primeira consulta.',
  },
  {
    nomePaciente: 'Camila Ferreira',
    cpfPaciente: '901.234.567-89',
    diasAPartirDeHoje: 1,
    horario: '08:30',
    especialidade: EspecialidadeConsulta.Endocrinologia,
    status: Agendada,
  },
  {
    nomePaciente: 'Lucas Gabriel Ribeiro',
    cpfPaciente: '012.345.678-90',
    diasAPartirDeHoje: 1,
    horario: '10:00',
    especialidade: EspecialidadeConsulta.ClinicaGeral,
    status: Agendada,
  },
  {
    nomePaciente: 'Beatriz Nascimento',
    cpfPaciente: '135.246.357-46',
    diasAPartirDeHoje: 2,
    horario: '14:00',
    especialidade: EspecialidadeConsulta.Psiquiatria,
    status: Agendada,
  },
  {
    nomePaciente: 'Fernanda Costa',
    cpfPaciente: '345.678.901-23',
    diasAPartirDeHoje: 3,
    horario: '09:30',
    especialidade: EspecialidadeConsulta.Dermatologia,
    status: Cancelada,
  },
  {
    nomePaciente: 'Fernanda Costa',
    cpfPaciente: '345.678.901-23',
    diasAPartirDeHoje: 3,
    horario: '09:30',
    especialidade: EspecialidadeConsulta.Dermatologia,
    status: Agendada,
    observacoes: 'Reagendada no mesmo horário após o cancelamento.',
  },
  {
    nomePaciente: 'Marcos Vinícius Teixeira',
    cpfPaciente: '246.357.468-57',
    diasAPartirDeHoje: 4,
    horario: '09:00',
    especialidade: EspecialidadeConsulta.Cardiologia,
    status: Agendada,
  },
  {
    nomePaciente: 'Patrícia Gomes',
    cpfPaciente: '357.468.579-68',
    diasAPartirDeHoje: 6,
    horario: '13:00',
    especialidade: EspecialidadeConsulta.Ortopedia,
    status: Cancelada,
  },
  {
    nomePaciente: 'Rafael Mendes',
    cpfPaciente: '468.579.680-79',
    diasAPartirDeHoje: 7,
    horario: '11:30',
    especialidade: EspecialidadeConsulta.Urologia,
    status: Agendada,
  },
  {
    nomePaciente: 'Larissa Carvalho',
    cpfPaciente: '579.680.791-80',
    diasAPartirDeHoje: 10,
    horario: '15:00',
    especialidade: EspecialidadeConsulta.Nutricao,
    status: Agendada,
  },
  {
    nomePaciente: 'Maria Oliveira Santos',
    cpfPaciente: '123.456.789-01',
    diasAPartirDeHoje: 14,
    horario: '10:30',
    especialidade: EspecialidadeConsulta.Cardiologia,
    status: Agendada,
    observacoes: 'Retorno da consulta anterior.',
  },
];

const INSERIR_CONSULTA = `
  INSERT INTO consultas
    (nome_paciente, cpf_paciente, data_hora, especialidade, observacoes, status)
  VALUES
    ($1, $2, ((now() AT TIME ZONE $3)::date + $4::int + $5::time) AT TIME ZONE $3, $6, $7, $8)
`;

async function aplicarSeed(): Promise<void> {
  await fonteDados.initialize();
  try {
    if ((await fonteDados.getRepository(Consulta).count()) > 0) {
      console.log(
        'A tabela de consultas já tem dados. O seed não foi aplicado.',
      );
      return;
    }
    await fonteDados.transaction(async (gerenciador) => {
      for (const consulta of CONSULTAS_DE_EXEMPLO) {
        await gerenciador.query(INSERIR_CONSULTA, [
          consulta.nomePaciente,
          consulta.cpfPaciente,
          FUSO_DA_CLINICA,
          consulta.diasAPartirDeHoje,
          consulta.horario,
          consulta.especialidade,
          consulta.observacoes ?? null,
          consulta.status,
        ]);
      }
    });
    console.log(
      `Seed aplicado: ${CONSULTAS_DE_EXEMPLO.length} consultas de exemplo criadas.`,
    );
  } finally {
    await fonteDados.destroy();
  }
}

await aplicarSeed();
