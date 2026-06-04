import { useMemo, useState } from "react";
import { agendaMock } from "../mocks/agenda";
import { Agenda } from "../models/Agenda";
import { Status } from "../models/enums/Status";
import { useConsulta } from "./useConsulta";

export function useAgenda() {
  const [agenda, setAgenda] = useState<Agenda[]>(agendaMock);
  const { consultas } = useConsulta();

  const buscarSlots = (medicoId: number, especialidadeId: number, dataInicio: string, dataFim: string): Agenda[] => {
    const slotsOcupados = new Set(
      consultas
        .filter((c) => c.medicoId === medicoId && c.data >= dataInicio && c.data <= dataFim)
        .map((c) => `${c.medicoId}_${c.data}_${c.horaInicio}`)
    );

    return agenda.filter(
      (s) =>
        s.medicoId === medicoId &&
        s.especialidadeId === especialidadeId &&
        s.data >= dataInicio &&
        s.data <= dataFim &&
        !slotsOcupados.has(s.id)
    );
  };

  const atualizarStatus = (slotId: string, novoStatus: Status): void => {
    setAgenda((atual) => atual.map((s) => (s.id === slotId ? { ...s, status: novoStatus } : s)));
  };

  return useMemo(() => ({ buscarSlots, atualizarStatus, agenda }), [agenda, consultas]);
}