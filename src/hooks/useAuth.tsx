import React, { createContext, useContext, useMemo, useState } from "react";
import { Usuario } from "../models/Usuario";

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

const usuarios: Usuario[] = [
  { id: 1, email: "secretaria@clinica.com", senha: "123456", perfil: "SECRETARIA", nome: "Ana Secretaria" },
  { id: 2, email: "medico@clinica.com", senha: "123456", perfil: "MEDICO", nome: "Dr. Ana Lima", medicoId: 1 },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = async (email: string, senha: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const encontrado = usuarios.find((u) => u.email === email && u.senha === senha) ?? null;
        setUsuario(encontrado);
        resolve(Boolean(encontrado));
      }, 500);
    });
  };

  const logout = () => setUsuario(null);

  const value = useMemo(() => ({ usuario, login, logout }), [usuario]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}