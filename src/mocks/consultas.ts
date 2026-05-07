import { Consulta } from "../models/Consulta";

const hoje = new Date();
const ontem = new Date();
ontem.setDate(hoje.getDate()-1);
const p=(n:number)=>String(n).padStart(2,"0");
const fmt=(d:Date)=>`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;

export const consultasMock: Consulta[] = [
  { numero: 1, clienteId: 1, medicoId: 1, especialidadeId: 2, data: fmt(hoje), horaInicio: "08:00", horaFim: "08:30", tipo: "NOVA", status: "M" },
  { numero: 2, clienteId: 2, medicoId: 1, especialidadeId: 1, data: fmt(hoje), horaInicio: "09:00", horaFim: "09:30", tipo: "NOVA", status: "OK" },
  { numero: 3, clienteId: 3, medicoId: 2, especialidadeId: 3, data: fmt(hoje), horaInicio: "10:00", horaFim: "10:30", tipo: "NOVA", status: "R", laudo: "Paciente estavel" },
  { numero: 4, clienteId: 4, medicoId: 3, especialidadeId: 4, data: fmt(ontem), horaInicio: "11:00", horaFim: "11:30", tipo: "NOVA", status: "E", valor: 250, tipoPagamento: "PIX", procedimentos: "Avaliacao" },
  { numero: 5, clienteId: 5, medicoId: 2, especialidadeId: 3, data: fmt(hoje), horaInicio: "12:00", horaFim: "12:30", tipo: "NOVA", status: "C", motivoCancelamento: "SOLICITACAO_CLIENTE" },
  { numero: 6, clienteId: 6, medicoId: 3, especialidadeId: 5, data: fmt(hoje), horaInicio: "13:00", horaFim: "13:30", tipo: "NOVA", status: "X", motivoCancelamento: "SOLICITACAO_MEDICO" },
  { numero: 7, clienteId: 1, medicoId: 1, especialidadeId: 2, data: fmt(hoje), horaInicio: "14:00", horaFim: "14:30", tipo: "RETORNO", status: "M" },
  { numero: 8, clienteId: 2, medicoId: 1, especialidadeId: 2, data: fmt(ontem), horaInicio: "15:00", horaFim: "15:30", tipo: "RETORNO", status: "E", valor: 0, tipoPagamento: "CONVENIO" },
];
