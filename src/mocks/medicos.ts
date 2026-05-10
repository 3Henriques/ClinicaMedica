import { Medico } from "../models/Medico";

export const medicosMock: Medico[] = [
  {
    matricula: 1,
    crm: "CRM-SP 123456",
    nome: "Ana Lima",
    sexo: "F",
    dtNascimento: "1980-05-15",
    endereco: {
      logradouro: "Rua da Saúde",
      numero: 500,
      bairro: "Vila Médica",
      cidade: "Porto Feliz",
      estado: "SP",
    },
    telefones: ["(15) 98765-4321", "(15) 3222-1111"],
    especialidades: [1, 2],
    diasAtendimento: [
      { diaSemana: "SEG", tempo: 30, horaIni: "08:00", horaFim: "12:00" },
      { diaSemana: "QUA", tempo: 30, horaIni: "08:00", horaFim: "12:00" },
    ],
    valorConsulta: 150.0,
  },
  {
    matricula: 2,
    crm: "CRM-SP 223344",
    nome: "Joao Faria",
    sexo: "M",
    dtNascimento: "1975-09-22",
    endereco: {
      logradouro: "Av Paulista",
      numero: 1500,
      complemento: "Apto 1200",
      bairro: "Bela Vista",
      cidade: "Sao Paulo",
      estado: "SP",
    },
    telefones: ["(11) 98888-5555", "(11) 3333-2222"],
    especialidades: [3],
    diasAtendimento: [
      { diaSemana: "TER", tempo: 30, horaIni: "09:00", horaFim: "13:00" },
      { diaSemana: "QUI", tempo: 30, horaIni: "09:00", horaFim: "13:00" },
    ],
    valorConsulta: 200.0,
  },
  {
    matricula: 3,
    crm: "CRM-SP 998877",
    nome: "Paula Mendes",
    sexo: "F",
    dtNascimento: "1982-11-08",
    endereco: {
      logradouro: "Rua das Clínicas",
      numero: 300,
      bairro: "Centro Médico",
      cidade: "Campinas",
      estado: "SP",
    },
    telefones: ["(19) 99999-6666", "(19) 3333-4444"],
    especialidades: [4, 5],
    diasAtendimento: [
      { diaSemana: "SEG", tempo: 30, horaIni: "07:00", horaFim: "11:00" },
      { diaSemana: "SEX", tempo: 30, horaIni: "07:00", horaFim: "11:00" },
    ],
    valorConsulta: 180.0,
  },
];