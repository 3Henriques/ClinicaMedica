import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Consulta } from "../models/Consulta";
import { Espacamento, Raio, Sombra, TemaCores, Tipografia, useTema } from "../styles/Tema";
import { StatusBadge } from "./StatusBadge";

export function CardConfirmarConsulta({ consulta, nomeCliente, nomeMedico, confirmado, cadastroCompleto = true, aoConfirmar }:


    {
        consulta: Consulta;
        nomeCliente: string;
        nomeMedico: string;
        confirmado: boolean;
        cadastroCompleto?: boolean;
        aoConfirmar: (numero: number) => void
    }


) {
    const { cores } = useTema();
    const styles = criarStyles(cores);


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
        {!cadastroCompleto && (
            <Text style={styles.pendente}>Cadastro incompleto - toque para concluir antes de confirmar.</Text>
        )}
    </TouchableOpacity>;
}


const criarStyles = (cores: TemaCores) => StyleSheet.create({

    card: {
        backgroundColor: cores.fundoCartaoElevado,
        padding: Espacamento.lg,
        borderRadius: Raio.lg,
        ...Sombra.cartao
    },

    ok: {
        borderWidth: 1,
        borderColor: cores.sucesso
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
        borderColor: cores.borda,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cores.fundoSecundario
    },

    marcadorOk: {
        backgroundColor: cores.sucessoSuave,
        borderColor: cores.sucesso
    },

    marcadorTxt: {
        color: cores.sucesso,
        ...Tipografia.subtitulo
    },

    hora: {
        ...Tipografia.corpoMedio,
        color: cores.textoSecundario
    },

    nome: {
        ...Tipografia.subtitulo,
        color: cores.textoPrimario,
        flex: 1
    },

    txt: {
        ...Tipografia.corpoMedio,
        color: cores.textoSecundario,
        flex: 1
    },

    pendente: {
        ...Tipografia.legenda,
        color: cores.aviso,
        marginTop: Espacamento.sm
    }
});
