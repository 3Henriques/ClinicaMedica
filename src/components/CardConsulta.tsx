import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Consulta } from "../models/Consulta";
import { Espacamento, Raio, Sombra, TemaCores, Tipografia, useTema } from "../styles/Tema";
import { StatusBadge } from "./StatusBadge";
import { Botao } from "./Botao";

export function CardConsulta({ consulta, nomeCliente, nomeMedico, nomeEspecialidade, onPress, acaoLabel }: { consulta: Consulta; nomeCliente: string; nomeMedico: string; nomeEspecialidade: string; onPress: () => void; acaoLabel?: string }) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  return <TouchableOpacity activeOpacity={0.75} style={styles.card} onPress={onPress}>
    <View style={styles.row}><Text style={styles.hora}>{consulta.horaInicio}</Text><StatusBadge status={consulta.status} /></View>
    <Text style={styles.nome}>{nomeCliente}</Text><Text style={styles.info}>{nomeMedico}</Text><Text style={styles.info}>{nomeEspecialidade}</Text>
    {!!acaoLabel && <View style={styles.acao}><Botao titulo={acaoLabel} onPress={onPress} tamanho="sm" larguraTotal /></View>}
  </TouchableOpacity>;
}
const criarStyles = (cores: TemaCores) => StyleSheet.create({ card:{ backgroundColor:cores.fundoCartaoElevado, borderRadius:Raio.lg, padding:Espacamento.lg, ...Sombra.cartao }, row:{ flexDirection:"row", justifyContent:"space-between", marginBottom:Espacamento.sm }, hora:{ ...Tipografia.corpoMedio, color:cores.textoSecundario }, nome:{ ...Tipografia.subtitulo, color:cores.textoPrimario, marginBottom:Espacamento.xs }, info:{ ...Tipografia.legenda, color:cores.textoSecundario }, acao:{ marginTop:Espacamento.md } });
