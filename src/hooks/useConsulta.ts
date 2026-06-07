import { useEffect, useMemo, useState } from "react";
import { Consulta, MotivoCancelamento, TipoPagamento } from "../models/Consulta";
import { Status } from "../models/enums/Status";
import { useFirestore } from "./useFirestore";
import { db } from "../../config";

const hoje = () => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export function useConsulta() {
    const { adicionar, escutar, atualizar } = useFirestore(db, "Consultas");
    const [consultas, setConsultas] = useState<Consulta[]>([]);

    useEffect(() => {
        const cancelar = escutar((dados) => {
            const convertidas = dados.map((d) => ({
                ...d,
                numero: Number(d.numero),
                clienteId: Number(d.clienteId),
                medicoId: Number(d.medicoId),
                especialidadeId: Number(d.especialidadeId),
            })) as Consulta[];
            setConsultas(convertidas);
        });
        return () => cancelar();
    }, []);

    const marcar = async (dados: Omit<Consulta, "numero" | "status">): Promise<Consulta> => {
        const nova: Consulta = {
            ...dados,
            numero: Math.max(0, ...consultas.map((c) => c.numero)) + 1,
            status: "M" as Status,
        };
        await adicionar(nova);
        return nova;
    };

    const confirmar = async (numero: number): Promise<void> => {
        const consulta = consultas.find((c) => c.numero === numero);
        if (consulta?.id) {
            await atualizar(consulta.id, { status: "OK" });
        }
    };

    const realizar = async (numero: number, laudo: string, receita?: string): Promise<void> => {
        const consulta = consultas.find((c) => c.numero === numero);
        if (consulta?.id) {
            await atualizar(consulta.id, { status: "R", laudo, receita });
        }
    };

    const encerrar = async (numero: number, valor: number, tipoPagamento: TipoPagamento, procedimentos?: string): Promise<void> => {
        const consulta = consultas.find((c) => c.numero === numero);
        if (consulta?.id) {
            await atualizar(consulta.id, { status: "E", valor, tipoPagamento, procedimentos });
        }
    };

    const cancelar = async (numero: number, motivo: MotivoCancelamento, observacao?: string): Promise<void> => {
        const consulta = consultas.find((c) => c.numero === numero);
        if (consulta?.id) {
            const status = motivo === "SOLICITACAO_MEDICO" ? "X" : "C";
            await atualizar(consulta.id, { status, motivoCancelamento: motivo, observacoes: observacao });
        }
    };

    const buscarPorStatus = (situacao: Status | Status[]): Consulta[] => {
        const arr = Array.isArray(situacao) ? situacao : [situacao];
        return consultas.filter((c) => arr.includes(c.status));
    };

    const buscarNaoConfirmadasHoje = (): Consulta[] =>
        consultas.filter((c) => c.data === hoje() && c.status === "M");

    const buscarConfirmadasHojePorMedico = (medicoId: number): Consulta[] =>
        consultas.filter((c) => c.data === hoje() && c.status === "OK" && c.medicoId === medicoId);

    const buscarRealizadasNaoEncerradas = (): Consulta[] =>
        consultas.filter((c) => c.status === "R");

    const buscarHistoricoPaciente = (clienteId: number): Consulta[] =>
        consultas.filter((c) => c.clienteId === clienteId && ["R", "E"].includes(c.status));

    return useMemo(
        () => ({ consultas, marcar, confirmar, realizar, encerrar, cancelar, buscarPorStatus, buscarNaoConfirmadasHoje, buscarConfirmadasHojePorMedico, buscarRealizadasNaoEncerradas, buscarHistoricoPaciente }),
        [consultas]
    );
}