import { useMemo, useState } from "react";
import { clientesMock } from "../mocks/clientes";
import { Cliente } from "../models/Cliente";

const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
export function useCliente() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock);

  const buscarPorNome = (termo: string): Cliente[] => {
    const n = normalizar(termo);
    return clientes.filter((c) => normalizar(c.nome).includes(n));
  };

  const buscarPorId = (id: number): Cliente | undefined => clientes.find((c) => c.identificador === id);

  const cadastrar = (dados: Omit<Cliente, "identificador">): Cliente => {
    const novo: Cliente = { ...dados, identificador: Math.max(0, ...clientes.map((c) => c.identificador)) + 1 };
    setClientes((atual) => [...atual, novo]);
    return novo;
  };

  const atualizar = (id: number, dados: Partial<Cliente>): void => {
    setClientes((atual) => atual.map((c) => (c.identificador === id ? { ...c, ...dados } : c)));
  };

  return useMemo(() => ({ clientes, buscarPorNome, buscarPorId, cadastrar, atualizar }), [clientes]);
}