export type PerfilUsuario = "SECRETARIA" | "MEDICO";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
  medicoId?: number;
}
