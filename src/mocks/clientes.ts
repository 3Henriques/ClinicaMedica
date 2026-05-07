import { Cliente } from "../models/Cliente";

export const clientesMock: Cliente[] = [
  { identificador: 1, nome: "Maria Aparecida Santos", dtNascimento: "1985-03-12", email: "maria.santos@email.com", telefone: "(15) 99812-3456", logradouro: "Rua das Flores", numero: 245, bairro: "Centro", cidade: "Porto Feliz", estado: "SP" },
  { identificador: 2, nome: "Carlos Eduardo Lima", dtNascimento: "1990-09-05", email: "carlos.lima@email.com", telefone: "(11) 99777-1111", logradouro: "Av Paulista", numero: 1000, bairro: "Bela Vista", cidade: "Sao Paulo", estado: "SP" },
  { identificador: 3, nome: "Fernanda Rocha", dtNascimento: "1978-01-22", email: "fernanda.rocha@email.com", telefone: "(19) 98888-2222", logradouro: "Rua A", numero: 45, bairro: "Jardim", cidade: "Campinas", estado: "SP" },
  { identificador: 4, nome: "Joao Pedro Oliveira", dtNascimento: "2001-12-11", email: "joao.oliveira@email.com", telefone: "(21) 95555-3333", logradouro: "Rua B", numero: 77, bairro: "Copacabana", cidade: "Rio de Janeiro", estado: "RJ" },
  { identificador: 5, nome: "Patricia Souza", dtNascimento: "1995-05-30", email: "patricia.souza@email.com", telefone: "(15) 96666-4444", logradouro: "Rua C", numero: 900, bairro: "Vila Nova", cidade: "Sorocaba", estado: "SP" },
  { identificador: 6, nome: "Alex Costa", dtNascimento: "1988-07-17", email: "alex.costa@email.com", telefone: "(31) 94444-5555", logradouro: "Rua D", numero: 32, bairro: "Savassi", cidade: "Belo Horizonte", estado: "MG" }
];
