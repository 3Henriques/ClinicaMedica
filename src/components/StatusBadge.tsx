import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LABEL_STATUS, STATUS_UI } from "../constants/StatusAtendimento";
import { Cores, Raio, Tipografia } from "../styles/Tema";

export function StatusBadge({ status, tamanho="md", mostrarRotulo=true }: { status: string; tamanho?: "sm"|"md"; mostrarRotulo?: boolean }) {
  const item = STATUS_UI[status] ?? { fundo: Cores.fundoCartaoElevado, texto: Cores.textoPrimario };
  const rotulo = LABEL_STATUS[status] ?? status;
  return <View style={[styles.base, tamanho==="sm"?styles.sm:styles.md, { backgroundColor:item.fundo }]}><Text style={[tamanho==="sm"?styles.tsm:styles.tmd, { color:item.texto }]}>{mostrarRotulo ? rotulo : status}</Text></View>;
}
const styles=StyleSheet.create({ base:{ borderRadius:Raio.full }, sm:{ paddingVertical:4,paddingHorizontal:8 }, md:{ paddingVertical:6,paddingHorizontal:10 }, tsm:{ ...Tipografia.rotulo, fontSize:9 }, tmd:{ ...Tipografia.legenda, fontWeight:"600" } });