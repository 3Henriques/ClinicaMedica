// [] Ponto extra por mostrar o histórico do paciente

// [] Ponto extra por mostrar o histórico do paciente

import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useCliente } from "../../hooks/useCliente";
import { CampoTexto } from "../../components/CampoTexto";
import { ListaGenerica } from "../../components/ListaGenerica";
import { Espacamento, Raio, TemaCores, Tipografia, useTema } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "ListarClientes">;


export function ListarClientes({ navigation }: Props) {
    const { cores } = useTema();
    const styles = criarStyles(cores);
    const [termo, setTermo] = useState("");
    const insets = useSafeAreaInsets();
    const { buscarPorNome } = useCliente();
    const dados = buscarPorNome(termo);
    return <View style={[styles.c, { paddingTop: insets.top + Espacamento.screen, paddingBottom: insets.bottom + Espacamento.screen }]}>
        <Text style={styles.t}>Clientes</Text><CampoTexto label="Buscar" valor={termo} aoAlterar={setTermo} placeholder="Buscar por nome..." />
        <ListaGenerica
            dados={dados}
            textoVazio="Nenhum cliente encontrado"
            renderItem={(c) => <TouchableOpacity
                activeOpacity={0.75}
                style={styles.card}
                onPress={() => navigation.navigate("CadastrarCliente", { clienteIdParaEditar: c.identificador })}>
                <Text style={styles.nome}>{c.nome}</Text>
                <Text style={styles.txt}>{c.telefone}</Text>
                <Text style={styles.txt}>{c.cidade}/{c.estado}</Text>
            </TouchableOpacity>} />
    </View>;
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
    c: { flex: 1, backgroundColor: cores.fundoPrimario, padding: Espacamento.screen, marginVertical: Espacamento.md },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
    card: { backgroundColor: cores.fundoCartao, padding: Espacamento.lg, borderRadius: Raio.lg },
    nome: { ...Tipografia.subtitulo, color: cores.textoPrimario, marginBottom: Espacamento.xs },
    txt: { ...Tipografia.corpoMedio, color: cores.textoSecundario }
});
