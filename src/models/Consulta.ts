import { Status } from "./enums/Status";

export type TipoConsulta = "NOVA" | "RETORNO";
export type MotivoCancelamento = "SOLICITACAO_CLIENTE" | "SOLICITACAO_MEDICO" | "NAO_COMPARECIMENTO";
export type TipoPagamento = "DINHEIRO" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "PIX" | "CONVENIO";

export interface Consulta {
  numero: number;
  clienteId: number;
  medicoId: number;
  especialidadeId: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  tipo: TipoConsulta;
  status: Status;
  laudo?: string;
  receita?: string;
  motivoCancelamento?: MotivoCancelamento;
  valor?: number;
  tipoPagamento?: TipoPagamento;
  procedimentos?: string;
  observacoes?: string;
}
