import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Cores, Espacamento, Raio, Tipografia } from "../styles/Tema";

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "secundario" | "perigo" | "ghost";
  tamanho?: "sm" | "md" | "lg";
  icone?: React.ReactNode;
  carregando?: boolean;
  desabilitado?: boolean;
  larguraTotal?: boolean;
}

export function Botao({ titulo, onPress, variante="primario", tamanho="md", icone, carregando, desabilitado, larguraTotal }: Props) {
  const bloqueado = desabilitado || carregando;
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} disabled={bloqueado} style={[styles.base, styles[variante], styles[tamanho], larguraTotal && styles.full, bloqueado && styles.disabled]}>
      <View style={styles.row}>
        {icone}
        {carregando ? <ActivityIndicator color={Cores.textoPrimario} /> : <Text style={[styles.texto, styles[`texto_${variante}` as const]]}>{titulo}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base:{ borderRadius: Raio.md, paddingHorizontal: Espacamento.lg, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:"transparent" },
  row:{ flexDirection:"row", alignItems:"center", gap:Espacamento.sm },
  sm:{ minHeight:40 }, md:{ minHeight:48 }, lg:{ minHeight:52 }, full:{ width:"100%" }, disabled:{ opacity:0.6 },
  primario:{ backgroundColor:Cores.acento },
  secundario:{ backgroundColor:"transparent", borderColor:Cores.borda },
  perigo:{ backgroundColor:"#B91C1C" },
  ghost:{ backgroundColor:"transparent" },
  texto:{ ...Tipografia.subtitulo },
  texto_primario:{ color:Cores.textoPrimario },
  texto_secundario:{ color:Cores.textoPrimario },
  texto_perigo:{ color:"#FEE2E2" },
  texto_ghost:{ color:Cores.acentoTexto }
});
