import { useMemo } from "react";
import { agendaMock } from "../mocks/agenda";
import { Agenda } from "../models/Agenda";
import { useConsulta } from "./useConsulta";

export function useAgenda() {
  const { consultas } = useConsulta();

  const buscarSlots = (medicoId: number, especialidadeId: number, dataInicio: string, dataFim: string): Agenda[] => {
    const consultasPorSlot = new Map(
      consultas
        .filter((c) => c.medicoId === medicoId && c.data >= dataInicio && c.data <= dataFim)
        .map((c) => [`${c.medicoId}_${c.data}_${c.horaInicio}`, c])
    );

    return agendaMock
      .filter(
        (s) =>
          s.medicoId === medicoId &&
          s.especialidadeId === especialidadeId &&
          s.data >= dataInicio &&
          s.data <= dataFim
      )
      .map((s) => {
        const consulta = consultasPorSlot.get(`${s.medicoId}_${s.data}_${s.horaInicio}`);
        if (consulta) {
          return { ...s, status: consulta.status };
        }
        return s;
      });
  };

  return useMemo(() => ({ buscarSlots, consultas }), [consultas]);
}