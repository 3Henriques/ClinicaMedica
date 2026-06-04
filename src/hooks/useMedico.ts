import { useCallback, useMemo } from "react";
import { medicosMock } from "../mocks/medicos";
import { Medico } from "../models/Medico";

export function useMedico() {
  const medicos = medicosMock;

  const buscarPorId = useCallback((id: number): Medico | undefined => medicos.find((m) => m.matricula === id), [medicos]);

  const buscarPorEspecialidade = useCallback(
    (especialidadeId: number): Medico[] => medicos.filter((m) => m.especialidades.includes(especialidadeId)),
    [medicos]
  );

  const buscarNome = useCallback(
    (id: number): string => {
      const medico = buscarPorId(id);
      return medico ? `Dr(a). ${medico.nome}` : "Dr(a). Nao encontrado";
    },
    [buscarPorId]
  );

  return useMemo(
    () => ({ medicos, buscarPorId, buscarPorEspecialidade, buscarNome }),
    [medicos, buscarPorId, buscarPorEspecialidade, buscarNome]
  );
}
