import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Consulta } from "../models/Consulta";
import { Cores, Espacamento, Raio, Sombra, Tipografia } from "../styles/Tema";
import { StatusBadge } from "./StatusBadge";
import { Botao } from "./Botao";

export function CardConsulta({ consulta, nomeCliente, nomeMedico, nomeEspecialidade, onPress, acaoLabel }: { consulta: Consulta; nomeCliente: string; nomeMedico: string; nomeEspecialidade: string; onPress: () => void; acaoLabel?: string }) {
  return <TouchableOpacity activeOpacity={0.75} style={styles.card} onPress={onPress}>
    <View style={styles.row}><Text style={styles.hora}>{consulta.horaInicio}</Text><StatusBadge status={consulta.status} /></View>
    <Text style={styles.nome}>{nomeCliente}</Text><Text style={styles.info}>{nomeMedico}</Text><Text style={styles.info}>{nomeEspecialidade}</Text>
    {!!acaoLabel && <View style={styles.acao}><Botao titulo={acaoLabel} onPress={onPress} tamanho="sm" larguraTotal /></View>}
  </TouchableOpacity>;
}
const styles=StyleSheet.create({ card:{ backgroundColor:Cores.fundoCartaoElevado, borderRadius:Raio.lg, padding:Espacamento.lg, ...Sombra.cartao }, row:{ flexDirection:"row", justifyContent:"space-between", marginBottom:Espacamento.sm }, hora:{ ...Tipografia.corpoMedio, color:Cores.textoSecundario }, nome:{ ...Tipografia.subtitulo, color:Cores.textoPrimario, marginBottom:Espacamento.xs }, info:{ ...Tipografia.legenda, color:Cores.textoSecundario }, acao:{ marginTop:Espacamento.md } });