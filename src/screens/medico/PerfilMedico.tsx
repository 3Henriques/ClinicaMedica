import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Espacamento, TemaCores, Tipografia, useTema } from "../../styles/Tema";

export function PerfilMedico() {
    const { cores } = useTema();
    const styles = criarStyles(cores);

    return (
        <View style={styles.c}>
            <Text style={styles.t}>Perfil do medico</Text>
        </View>
    );
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
    c: { flex: 1, backgroundColor: cores.fundoPrimario, padding: Espacamento.screen },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
});
