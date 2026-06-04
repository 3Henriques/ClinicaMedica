import { especialidadesMock } from "../mocks/especialidades";
import { medicosMock } from "../mocks/medicos";
import { Especialidade } from "../models/Especialidade";

export function useEspecialidade() {
  const especialidades = especialidadesMock;
  const buscarPorId = (id: number): Especialidade | undefined => especialidades.find((e) => e.codigo === id);
  const buscarPorMedico = (medicoId: number): Especialidade[] => {
    const medico = medicosMock.find((m) => m.matricula === medicoId);
    if (!medico) return [];
    return especialidades.filter((e) => medico.especialidades.includes(e.codigo));
  };
  return { especialidades, buscarPorId, buscarPorMedico };
}
