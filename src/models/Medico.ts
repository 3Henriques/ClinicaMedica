import { DiasAtendimento } from "./DiasAtendimento";

export interface Medico {
  matricula: number;
  crm: string;
  nome: string;
  especialidades: number[];
  diasAtendimento: DiasAtendimento[];
}