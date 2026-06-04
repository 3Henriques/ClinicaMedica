import { useMemo } from "react";
import { agendaMock } from "../mocks/agenda";
import { Agenda } from "../models/Agenda";
import { Status } from "../models/enums/Status";
import { useConsulta } from "./useConsulta";

export function useAgenda() {
  const { consultas } = useConsulta();

  const buscarSlots = (medicoId: number, especialidadeId: number, dataInicio: string, dataFim: string): Agenda[] => {
    const slotsOcupados = new Set(
      consultas
        .filter((c) => c.medicoId === medicoId && c.data >= dataInicio && c.data <= dataFim)
        .map((c) => `${c.medicoId}_${c.data}_${c.horaInicio}`)
    );

    return agendaMock.filter(
      (s) =>
        s.medicoId === medicoId &&
        s.especialidadeId === especialidadeId &&
        s.data >= dataInicio &&
        s.data <= dataFim &&
        !slotsOcupados.has(s.id)
    );
  };

  return useMemo(() => ({ buscarSlots, consultas }), [consultas]);
}