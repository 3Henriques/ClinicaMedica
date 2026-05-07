import { useMemo, useState } from "react";
import { consultasMock } from "../mocks/consultas";
import { Consulta, MotivoCancelamento, TipoPagamento } from "../models/Consulta";
import { Status } from "../models/enums/Status";

const aguardar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const hoje = () => { const d = new Date(); const p=(n:number)=>String(n).padStart(2,"0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; };

export function useConsulta() {
  const [consultas, setConsultas] = useState<Consulta[]>(consultasMock);

  const marcar = async (dados: Omit<Consulta, "numero" | "status">): Promise<Consulta> => {
    await aguardar(300);
    const nova: Consulta = { ...dados, numero: Math.max(0, ...consultas.map((c) => c.numero)) + 1, status: "M" as Status };
    setConsultas((a) => [...a, nova]);
    return nova;
  };

  const confirmar = async (numero: number): Promise<void> => { await aguardar(300); setConsultas((a) => a.map((c) => c.numero===numero ? {...c, status:"CONFIRMADA" as Status}:c)); 
    };

  const realizar = async (numero: number, laudo: string, receita?: string): Promise<void> => { await aguardar(300); setConsultas((a) => a.map((c) => c.numero===numero ? {...c, status:"REALIZADA" as Status, laudo, receita}:c)); 
    };

  const encerrar = async (numero: number, valor: number, tipoPagamento: TipoPagamento, procedimentos?: string): Promise<void> => { await aguardar(300); setConsultas((a) => a.map((c) => c.numero===numero ? {...c, status:"E" as Status, valor, tipoPagamento, procedimentos}:c)); 
    };
  
  const cancelar = async (numero: number, motivo: MotivoCancelamento, observacao?: string): Promise<void> => { await aguardar(300); const s = motivo === "SOLICITACAO_MEDICO" ? "X" : "C"; setConsultas((a) => a.map((c) => c.numero===numero ? {...c, status: s as Status, motivoCancelamento: motivo, observacoes: observacao}:c)); };

  const buscarPorStatus = (situacao: Status | Status[]): Consulta[] => { const arr = Array.isArray(situacao)?situacao:[situacao]; return consultas.filter((c)=>arr.includes(c.status)); };
  
  const buscarNaoConfirmadasHoje = (): Consulta[] => consultas.filter((c)=>c.data===hoje() && c.status==="M");

  const buscarConfirmadasHojePorMedico = (medicoId: number): Consulta[] => consultas.filter((c)=>c.data===hoje() && c.status==="OK" && c.medicoId===medicoId);

  const buscarRealizadasNaoEncerradas = (): Consulta[] => consultas.filter((c)=>c.status==="R");

  const buscarHistoricoPaciente = (clienteId: number): Consulta[] => consultas.filter((c)=>c.clienteId===clienteId && ["R","E"].includes(c.status));

  return useMemo(()=>({consultas,marcar,confirmar,realizar,encerrar,cancelar,buscarPorStatus,buscarNaoConfirmadasHoje,buscarConfirmadasHojePorMedico,buscarRealizadasNaoEncerradas,buscarHistoricoPaciente}),[consultas]);
}