import { Agenda, Status } from "../models/Agenda";
import { medicosMock } from "./medicos";

const mapaDia: Record<number, "DOM"|"SEG"|"TER"|"QUA"|"QUI"|"SEX"|"SAB"> = {0:"DOM",1:"SEG",2:"TER",3:"QUA",4:"QUI",5:"SEX",6:"SAB"};
const distribuicao: Array<{status: Status; limite: number}> = [
  {status:"L",limite:0.55},{status:"M",limite:0.80},{status:"C",limite:0.90},{status:"X",limite:0.95},{status:"B",limite:1}
];
const pad=(n:number)=>String(n).padStart(2,"0");
const addMin=(h:string,m:number)=>{const [hh,mm]=h.split(":").map(Number);const t=hh*60+mm+m;return `${pad(Math.floor(t/60))}:${pad(t%60)}`};
const fmt=(d:Date)=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const pick=():Status=>{const r=Math.random();return distribuicao.find(d=>r<=d.limite)?.status ?? "L"};

function gerarSlots(): Agenda[] {
  const slots: Agenda[] = [];
  const hoje = new Date();
  for (const medico of medicosMock) {
    for (let i=0;i<60;i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate()+i);
      const dia = mapaDia[data.getDay()];
      const regra = medico.diasAtendimento.find((d)=>d.diaSemana===dia);
      if (!regra) continue;
      let horaAtual = regra.horaIni;
      while (horaAtual < regra.horaFim) {
        const horaFim = addMin(horaAtual, regra.tempo);
        if (horaFim > regra.horaFim) break;
        slots.push({
          id: `${medico.matricula}_${fmt(data)}_${horaAtual}`,
          medicoId: medico.matricula,
          especialidadeId: medico.especialidades[0],
          data: fmt(data),
          horaInicio: horaAtual,
          horaFim,
          status: pick(),
        });
        horaAtual = horaFim;
      }
    }
  }
  return slots;
}

export const agendaMock: Agenda[] = gerarSlots();