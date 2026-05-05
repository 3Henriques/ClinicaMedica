export const LABEL_STATUS: Record<string, string> = {
  L: "Livre",
  M: "Marcado",
  C: "Cancelado pelo Paciente",
  X: "Cancelado pelo Medico",
  B: "Bloqueado",
  CONFIRMADA: "Confirmada",
  REALIZADA: "Realizada",
  ENCERRADA: "Encerrada",
};

export const STATUS_UI: Record<string, { fundo: string; texto: string }> = {
  L: { fundo: "#1E3A6E", texto: "#93C5FD" },
  M: { fundo: "#451A03", texto: "#FCD34D" },
  C: { fundo: "#7F1D1D", texto: "#FCA5A5" },
  X: { fundo: "#450A0A", texto: "#F87171" },
  B: { fundo: "#303A52", texto: "#CBD5E1" },
  CONFIRMADA: { fundo: "#1E3A6E", texto: "#93C5FD" },
  REALIZADA: { fundo: "#1A3A2E", texto: "#34D399" },
  ENCERRADA: { fundo: "#2D1B69", texto: "#A78BFA" },
};

export const LABEL_MOTIVO: Record<string, string> = {
  SOLICITACAO_CLIENTE: "Solicitacao do Cliente",
  SOLICITACAO_MEDICO: "Solicitacao do Medico",
  NAO_COMPARECIMENTO: "Nao Comparecimento",
};

export const LABEL_TIPO_PAGAMENTO: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  CARTAO_CREDITO: "Cartao de Credito",
  CARTAO_DEBITO: "Cartao de Debito",
  PIX: "PIX",
  CONVENIO: "Convenio",
};
