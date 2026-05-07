import React, { useState } from "react";
import { DimensionValue, KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";
import { Cores, Espacamento, Raio, Tipografia } from "../styles/Tema";

interface Props { label: string; valor: string; aoAlterar: (texto: string) => void; placeholder?: string; multiline?: boolean; altura?: number; largura?: DimensionValue; teclado?: KeyboardTypeOptions; desabilitado?: boolean; erro?: string; iconeEsquerda?: React.ReactNode; iconeDireita?: React.ReactNode; seguro?: boolean; }
export function CampoTexto({ label, valor, aoAlterar, placeholder, multiline, altura=44, largura="100%", teclado, desabilitado, erro, iconeEsquerda, iconeDireita, seguro }: Props) {
  const [focado, setFocado] = useState(false);
  return <View style={[styles.wrap,{width:largura}]}>
    <Text style={styles.label} accessibilityRole="text">{label}</Text>
    <View style={[styles.box, focado && styles.foco, !!erro && styles.boxErro, desabilitado && styles.desabilitado, { height: multiline ? altura : 48 }]}>
      {iconeEsquerda}<TextInput value={valor} onChangeText={aoAlterar} placeholder={placeholder} placeholderTextColor={Cores.textoPlaceholder} editable={!desabilitado} secureTextEntry={!!seguro} keyboardType={teclado} multiline={!!multiline} style={styles.input} onFocus={() => setFocado(true)} onBlur={() => setFocado(false)} />{iconeDireita}
    </View>
    {!!erro && <Text style={styles.erro}>{erro}</Text>}
  </View>;
}
const styles=StyleSheet.create({
  wrap:{ marginBottom:Espacamento.fieldGap },
  label:{ ...Tipografia.legenda, color:Cores.textoSecundario, marginBottom:Espacamento.xs },
  box:{ backgroundColor:Cores.fundoInput, borderRadius:Raio.md, borderColor:Cores.borda, borderWidth:1, flexDirection:"row", alignItems:"center", paddingHorizontal:Espacamento.md },
  foco:{ borderColor:Cores.acento, backgroundColor:Cores.fundoCartaoElevado },
  boxErro:{ borderColor:Cores.erro },
  desabilitado:{ opacity:0.7 },
  input:{ flex:1, color:Cores.textoPrimario, ...Tipografia.corpo },
  erro:{ color:Cores.erro, ...Tipografia.legenda, marginTop:Espacamento.xs }
});
