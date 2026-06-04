import { useEffect, useMemo, useState } from "react";
import { db } from "../../config";
import { clientesMock } from "../mocks/clientes";
import { Cliente } from "../models/Cliente";
import { Sexo } from "../models/enums/Sexo";
import { useFirestore } from "./useFirestore";

export type DadosCadastroInicialCliente = {
  nome: string;
  telefone: string[];
  dtNascimento?: string;
  observacoes?: string;
};

export type DadosCadastroCompletoCliente = Omit<Cliente, "identificador" | "firestoreId" | "cadastroCompleto" | "statusCadastro">;

const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const converterCliente = (dados: any): Cliente => ({
  identificador: Number(dados.identificador),
  firestoreId: dados.id,
  nome: String(dados.nome ?? ""),
  dtNascimento: dados.dtNascimento ?? "",
  email: dados.email ?? "",
  telefone: Array.isArray(dados.telefone) ? dados.telefone : dados.telefone ? [String(dados.telefone)] : [],
  sexo: dados.sexo as Sexo | undefined,
  RG: dados.RG ?? "",
  CPF: dados.CPF ?? "",
  endereco: dados.endereco,
  nomeCovenio: dados.nomeCovenio ?? "",
  matriculaConveniado: dados.matriculaConveniado ?? "",
  observacoes: dados.observacoes ?? "",
  origemCadastro: dados.origemCadastro ?? "cadastro_completo",
  cadastroCompleto: dados.cadastroCompleto === true,
  statusCadastro: dados.statusCadastro === "COMPLETO" ? "COMPLETO" : "INCOMPLETO",
});

export function useCliente() {
  const { adicionar, atualizar: atualizarFirestore, escutar } = useFirestore(db, "Clientes");
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock);

  useEffect(() => {
    const cancelar = escutar((dados) => {
      if (!dados.length) return;
      setClientes(dados.map(converterCliente));
    });
    return () => cancelar();
  }, []);

  const proximoIdentificador = () => Math.max(0, ...clientes.map((c) => c.identificador)) + 1;

  const buscarPorNome = (termo: string): Cliente[] => {
    const n = normalizar(termo);
    return clientes.filter((c) => {
      const telefones = c.telefone.join(" ");
      const cpf = c.CPF ?? "";
      return normalizar(`${c.nome} ${cpf} ${telefones}`).includes(n);
    });
  };

  const buscarPorId = (id: number): Cliente | undefined => clientes.find((c) => c.identificador === id);

  const cadastrarInicial = async (dados: DadosCadastroInicialCliente): Promise<Cliente> => {
    const novo: Cliente = {
      identificador: proximoIdentificador(),
      nome: dados.nome.trim(),
      telefone: dados.telefone.filter(Boolean),
      dtNascimento: dados.dtNascimento?.trim() ?? "",
      observacoes: dados.observacoes?.trim() ?? "",
      email: "",
      RG: "",
      CPF: "",
      nomeCovenio: "",
      matriculaConveniado: "",
      origemCadastro: "primeira_consulta",
      cadastroCompleto: false,
      statusCadastro: "INCOMPLETO",
    };
    const firestoreId = await adicionar(novo);
    const salvo = { ...novo, firestoreId };
    setClientes((atual) => [...atual, salvo]);
    return salvo;
  };

  const cadastrar = async (dados: DadosCadastroCompletoCliente): Promise<Cliente> => {
    const novo: Cliente = {
      ...dados,
      identificador: proximoIdentificador(),
      origemCadastro: dados.origemCadastro ?? "cadastro_completo",
      cadastroCompleto: true,
      statusCadastro: "COMPLETO",
    };
    const firestoreId = await adicionar(novo);
    const salvo = { ...novo, firestoreId };
    setClientes((atual) => [...atual, salvo]);
    return salvo;
  };

  const atualizar = async (id: number, dados: Partial<Cliente>): Promise<void> => {
    const clienteAtual = buscarPorId(id);
    const dadosAtualizados: Partial<Cliente> = {
      ...dados,
      cadastroCompleto: true,
      statusCadastro: "COMPLETO",
    };

    if (clienteAtual?.firestoreId) {
      await atualizarFirestore(clienteAtual.firestoreId, dadosAtualizados);
    }

    setClientes((atual) => atual.map((c) => (c.identificador === id ? { ...c, ...dadosAtualizados } : c)));
  };

  return useMemo(
    () => ({ clientes, buscarPorNome, buscarPorId, cadastrar, cadastrarInicial, atualizar }),
    [clientes]
  );
}
