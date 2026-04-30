import type { Medico } from "../models/Medico";
import { medicos } from "../mocks/Medicos";

export function useMedico(idMedico: number): Medico{

    return medicos.find((medico) => medico.id === idMedico) // vai parar de dar erro quando o tipo Medico for codificado
}