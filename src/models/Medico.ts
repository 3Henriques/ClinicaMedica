import { DiasAtendimento } from "./DiasAtendimento";
import { Endereco } from "./valueObjects/Endereco";
import { Sexo } from "./enums/Sexo";

export interface Medico {
  matricula: number;
  crm: string;
  nome: string;
  sexo: Sexo;
  dtNascimento: string;
  endereco: Endereco;
  telefones: string[];
  especialidades: number[];
  diasAtendimento: DiasAtendimento[];
}