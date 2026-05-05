export const Cores = {
  fundoPrimario: "#0D1117",
  fundoSecundario: "#161B26",
  fundoCartao: "#1E2436",
  fundoCartaoElevado: "#232B3E",
  fundoInput: "#252C3F",
  fundoModal: "#1A2035",
  fundoHover: "#2A3350",
  acento: "#3B82F6",
  acentoHover: "#2563EB",
  acentoSuave: "#1E3A6E",
  acentoTexto: "#93C5FD",
  textoPrimario: "#F1F5F9",
  textoSecundario: "#B4C2D4",
  textoDesabilitado: "#556784",
  textoPlaceholder: "#4B5A78",
  sucesso: "#22C55E",
  sucessoSuave: "#14532D",
  erro: "#EF4444",
  erroSuave: "#450A0A",
  aviso: "#F59E0B",
  avisoSuave: "#451A03",
  info: "#06B6D4",
  borda: "#2A3350",
  divisor: "#1E2845",
};

export const StatusCores: Record<string, { fundo: string; texto: string; rotulo: string }> = {
  L: { fundo: "#1E3A6E", texto: "#93C5FD", rotulo: "Livre" },
  M: { fundo: "#451A03", texto: "#FCD34D", rotulo: "Marcado" },
  C: { fundo: "#7F1D1D", texto: "#FCA5A5", rotulo: "Cancelado Paciente" },
  X: { fundo: "#450A0A", texto: "#F87171", rotulo: "Cancelado Medico" },
  B: { fundo: "#303A52", texto: "#CBD5E1", rotulo: "Bloqueado" },
  CONFIRMADA: { fundo: "#1E3A6E", texto: "#93C5FD", rotulo: "Confirmada" },
  REALIZADA: { fundo: "#1A3A2E", texto: "#34D399", rotulo: "Realizada" },
  ENCERRADA: { fundo: "#2D1B69", texto: "#A78BFA", rotulo: "Encerrada" },
};

export const Tipografia = {
  displayGrande: { fontSize: 28, fontWeight: "700" as const, letterSpacing: -0.5 },
  display: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  titulo: { fontSize: 20, fontWeight: "700" as const },
  subtitulo: { fontSize: 16, fontWeight: "600" as const },
  corpo: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  corpoMedio: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  legenda: { fontSize: 12, fontWeight: "400" as const },
  rotulo: { fontSize: 10, fontWeight: "700" as const, letterSpacing: 1.2 },
};

export const Espacamento = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  screen: 16,
  section: 24,
  fieldGap: 12,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const touchMin = 48;

export const Raio = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20,
  full: 999,
};

export const Sombra = {
  cartao: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};