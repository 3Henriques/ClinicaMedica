import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Espacamento, TemaCores, Tipografia, useTema } from "../../styles/Tema";

export function ListarMedicos() {
    const { cores } = useTema();
    const styles = criarStyles(cores);

    return (
        <View style={styles.c}>
            <Text style={styles.t}>Medicos</Text>
        </View>
    );
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
    c: { flex: 1, backgroundColor: cores.fundoPrimario, padding: Espacamento.screen },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
});
