import { Endereco } from "./valueObjects/Endereco";
import { Sexo } from "./enums/Sexo";

export interface Cliente {
  identificador: number;
  nome: string;
  dtNascimento: string;
  email: string;
  telefone: string[];
  sexo: Sexo;
  RG: string;
  CPF: string;
  endereco: Endereco;
  nomeCovenio: string;
  matriculaConveniado: string;
}
