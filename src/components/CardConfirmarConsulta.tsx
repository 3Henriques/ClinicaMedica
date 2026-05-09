import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Consulta } from "../models/Consulta";
import { Cores, Espacamento, Raio, Sombra, Tipografia } from "../styles/Tema";
import { StatusBadge } from "./StatusBadge";

export function CardConfirmarConsulta({ consulta, nomeCliente, nomeMedico, confirmado, aoConfirmar }:


    {
        consulta: Consulta;
        nomeCliente: string;
        nomeMedico: string;
        confirmado: boolean;
        aoConfirmar: (numero: number) => void
    }


) {


    return <TouchableOpacity activeOpacity={0.75} style={[styles.card, confirmado && styles.ok]} onPress={
        () => aoConfirmar(consulta.numero)
    }>
        <View style={styles.row}>
            <View style={[styles.marcador, confirmado && styles.marcadorOk]}>
                <Text style={styles.marcadorTxt}>{confirmado ? "✓" : ""}</Text>
            </View>
            <Text style={styles.hora}>{consulta.horaInicio}</Text>
            <Text style={styles.nome}>{nomeCliente}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.txt}>{nomeMedico}</Text>
            <StatusBadge status={consulta.status} />
        </View>
    </TouchableOpacity>;
}


const styles = StyleSheet.create({

    card: {
        backgroundColor: Cores.fundoCartaoElevado,
        padding: Espacamento.lg,
        borderRadius: Raio.lg,
        ...Sombra.cartao
    },

    ok: {
        borderWidth: 1,
        borderColor: Cores.sucesso
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: Espacamento.sm
    },

    marcador: {
        width: 22,
        height: 22,
        borderRadius: Raio.sm,
        borderWidth: 1,
        borderColor: Cores.borda,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Cores.fundoSecundario
    },

    marcadorOk: {
        backgroundColor: Cores.sucessoSuave,
        borderColor: Cores.sucesso
    },

    marcadorTxt: {
        color: Cores.sucesso,
        ...Tipografia.subtitulo
    },

    hora: {
        ...Tipografia.corpoMedio,
        color: Cores.textoSecundario
    },

    nome: {
        ...Tipografia.subtitulo,
        color: Cores.textoPrimario,
        flex: 1
    },

    txt: {
        ...Tipografia.corpoMedio,
        color: Cores.textoSecundario,
        flex: 1
    }
});
