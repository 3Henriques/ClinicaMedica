export interface Cliente {
  identificador: number;
  nome: string;
  dtNascimento: string;
  email: string;
  telefone: string;
  logradouro: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}
