import { Endereco } from "./valueObjects/Endereco";
import { Sexo } from "./enums/Sexo";

export type StatusCadastroCliente = "INCOMPLETO" | "COMPLETO";

export interface Cliente {
  identificador: number;
  firestoreId?: string;
  nome: string;
  dtNascimento?: string;
  email?: string;
  telefone: string[];
  sexo?: Sexo;
  RG?: string;
  CPF?: string;
  endereco?: Endereco;
  nomeCovenio?: string;
  matriculaConveniado?: string;
  observacoes?: string;
  origemCadastro?: "primeira_consulta" | "cadastro_completo";
  cadastroCompleto: boolean;
  statusCadastro: StatusCadastroCliente;
}
