import React, { useState } from "react";
import { DimensionValue, KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";
import { Espacamento, Raio, TemaCores, Tipografia, useTema } from "../styles/Tema";

interface Props { label: string; valor: string; aoAlterar: (texto: string) => void; placeholder?: string; multiline?: boolean; altura?: number; largura?: DimensionValue; teclado?: KeyboardTypeOptions; desabilitado?: boolean; erro?: string; iconeEsquerda?: React.ReactNode; iconeDireita?: React.ReactNode; seguro?: boolean; }
export function CampoTexto({ label, valor, aoAlterar, placeholder, multiline, altura=44, largura="100%", teclado, desabilitado, erro, iconeEsquerda, iconeDireita, seguro }: Props) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  const [focado, setFocado] = useState(false);
  return <View style={[styles.wrap,{width:largura}]}>
    <Text style={styles.label} accessibilityRole="text">{label}</Text>
    <View style={[styles.box, focado && styles.foco, !!erro && styles.boxErro, desabilitado && styles.desabilitado, { height: multiline ? altura : 48 }]}>
      {iconeEsquerda}<TextInput value={valor} onChangeText={aoAlterar} placeholder={placeholder} placeholderTextColor={cores.textoPlaceholder} editable={!desabilitado} secureTextEntry={!!seguro} keyboardType={teclado} multiline={!!multiline} style={styles.input} onFocus={() => setFocado(true)} onBlur={() => setFocado(false)} />{iconeDireita}
    </View>
    {!!erro && <Text style={styles.erro}>{erro}</Text>}
  </View>;
}
const criarStyles = (cores: TemaCores) => StyleSheet.create({
  wrap:{ marginBottom:Espacamento.fieldGap },
  label:{ ...Tipografia.legenda, color:cores.textoSecundario, marginBottom:Espacamento.xs },
  box:{ backgroundColor:cores.fundoInput, borderRadius:Raio.md, borderColor:cores.borda, borderWidth:1, flexDirection:"row", alignItems:"center", paddingHorizontal:Espacamento.md },
  foco:{ borderColor:cores.acento, backgroundColor:cores.fundoCartaoElevado },
  boxErro:{ borderColor:cores.erro },
  desabilitado:{ opacity:0.7 },
  input:{ flex:1, color:cores.textoPrimario, ...Tipografia.corpo },
  erro:{ color:cores.erro, ...Tipografia.legenda, marginTop:Espacamento.xs }
});
