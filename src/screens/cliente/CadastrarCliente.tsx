import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CampoTexto } from "../../components/CampoTexto";
import { Botao } from "../../components/Botao";
import { useCliente } from "../../hooks/useCliente";
import { Cores, Espacamento, Tipografia } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "CadastrarCliente">;


export function CadastrarCliente({ navigation, route }: Props) {
    const insets = useSafeAreaInsets();

    const { cadastrar, atualizar, buscarPorId } = useCliente();
    const cli = useMemo(
        () => route.params?.clienteIdParaEditar ? buscarPorId(route.params.clienteIdParaEditar) : undefined, [route.params, buscarPorId]
    );
    const [nome, setNome] = useState(cli?.nome ?? "");
    const [telefone, setTelefone] = useState(cli?.telefone ?? "");
    const [dtNascimento, setData] = useState(cli?.dtNascimento ?? "");
    const salvar = () => {

        const base = {
            nome,
            telefone,
            dtNascimento,
            email: cli?.email ?? "",
            logradouro: cli?.logradouro ?? "",
            numero: cli?.numero ?? 0, bairro: cli?.bairro ?? "",
            cidade: cli?.cidade ?? "",
            estado: cli?.estado ?? "SP"
        };

        if (cli) atualizar(cli.identificador, base); else cadastrar(base); navigation.goBack();
    };


    return <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView style={styles.c} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.p}>
                <Text style={styles.t}> {cli ? "Editar cliente" : "Novo cliente"} </Text>
                <View style={styles.bloco}>
                    <CampoTexto label="Nome" valor={nome} aoAlterar={setNome} />
                    <CampoTexto label="Telefone" valor={telefone} aoAlterar={setTelefone} />
                    <CampoTexto label="Data de Nascimento" valor={dtNascimento} aoAlterar={setData} />
                </View>
                <Botao titulo="Salvar Cliente" onPress={salvar} larguraTotal />
                <Botao titulo="Cancelar" variante="ghost" onPress={() => navigation.goBack()} larguraTotal />

            </ScrollView>
        </KeyboardAvoidingView>
    </View>;
}


const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Cores.fundoPrimario },
    c: { flex: 1 },
    p: { padding: Espacamento.screen, gap: Espacamento.md },
    t: { ...Tipografia.titulo, color: Cores.textoPrimario },
    bloco: { backgroundColor: Cores.fundoCartao, padding: Espacamento.lg, borderRadius: 12 }
});
