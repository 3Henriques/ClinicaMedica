import { Medico } from "../models/Medico";

export const medicosMock: Medico[] = [
  {
    matricula: 1,
    crm: "CRM-SP 123456",
    nome: "Ana Lima",
    especialidades: [1, 2],
    diasAtendimento: [
      { diaSemana: "SEG", tempo: 30, horaIni: "08:00", horaFim: "12:00" },
      { diaSemana: "QUA", tempo: 30, horaIni: "08:00", horaFim: "12:00" },
    ],
  },
  {
    matricula: 2,
    crm: "CRM-SP 223344",
    nome: "Joao Faria",
    especialidades: [3],
    diasAtendimento: [
      { diaSemana: "TER", tempo: 30, horaIni: "09:00", horaFim: "13:00" },
      { diaSemana: "QUI", tempo: 30, horaIni: "09:00", horaFim: "13:00" },
    ],
  },
  {
    matricula: 3,
    crm: "CRM-SP 998877",
    nome: "Paula Mendes",
    especialidades: [4, 5],
    diasAtendimento: [
      { diaSemana: "SEG", tempo: 30, horaIni: "07:00", horaFim: "11:00" },
      { diaSemana: "SEX", tempo: 30, horaIni: "07:00", horaFim: "11:00" },
    ],
  },
];