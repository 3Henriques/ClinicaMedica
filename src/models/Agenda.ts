import { Status } from "./enums/Status";

export interface Agenda {
  id: string;
  medicoId: number;
  especialidadeId: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: Status;
}
