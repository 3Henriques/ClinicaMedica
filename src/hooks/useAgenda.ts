import { useMemo, useState } from "react";
import { agendaMock } from "../mocks/agenda";
import { Agenda, Status } from "../models/Agenda";

export function useAgenda() {
  const [agenda, setAgenda] = useState<Agenda[]>(agendaMock);

  const buscarSlots = (medicoId: number, especialidadeId: number, dataInicio: string, dataFim: string): Agenda[] =>
    agenda.filter((s) => s.medicoId === medicoId && s.especialidadeId === especialidadeId && s.data >= dataInicio && s.data <= dataFim);

  const atualizarStatus = (slotId: string, novoStatus: Status): void => {
    setAgenda((atual) => atual.map((s) => (s.id === slotId ? { ...s, status: novoStatus } : s)));
  };

  return useMemo(() => ({ buscarSlots, atualizarStatus, agenda }), [agenda]);
}