import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Botao } from "../../components/Botao";
import { CampoTexto } from "../../components/CampoTexto";
import { useCliente } from "../../hooks/useCliente";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { Espacamento, Raio, TemaCores, Tipografia, useTema } from "../../styles/Tema";
import { mascaraData, mascaraTelefone } from "../../utils/mascaras";

type Props = NativeStackScreenProps<RootStackParamList, "CadastroInicialPaciente">;

export function CadastroInicialPaciente({ navigation }: Props) {
    const { cores } = useTema();
    const styles = criarStyles(cores);
    const insets = useSafeAreaInsets();
    const { cadastrarInicial } = useCliente();
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [dtNascimento, setDtNascimento] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [salvando, setSalvando] = useState(false);

    const salvar = async () => {
        if (!nome.trim() || !telefone.trim()) {
            Alert.alert("Dados obrigatorios", "Informe o nome e o telefone do paciente.");
            return;
        }

        setSalvando(true);
        try {
            const paciente = await cadastrarInicial({
                nome,
                telefone: [telefone],
                dtNascimento,
                observacoes,
            });
            Alert.alert("Cadastro inicial salvo", "O paciente foi cadastrado para primeira consulta.", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("MarcarConsulta", { pacienteSelecionadoId: paciente.identificador }),
                },
            ]);
        } catch {
            Alert.alert("Erro", "Nao foi possivel salvar o cadastro inicial. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView style={styles.c} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView contentContainerStyle={styles.p} keyboardShouldPersistTaps="handled">
                    <Text style={styles.t}>Cadastro inicial do paciente</Text>
                    <Text style={styles.sub}>Dados basicos para agendar a primeira consulta.</Text>
                    <View style={styles.bloco}>
                        <CampoTexto label="Nome do paciente" valor={nome} aoAlterar={setNome} />
                        <CampoTexto label="Telefone" valor={telefone} aoAlterar={(v) => setTelefone(mascaraTelefone(v))} teclado="phone-pad" />
                        <CampoTexto label="Data de nascimento" valor={dtNascimento} aoAlterar={(v) => setDtNascimento(mascaraData(v))} teclado="number-pad" />
                        <CampoTexto label="Observacoes" valor={observacoes} aoAlterar={setObservacoes} multiline altura={96} />
                    </View>
                    <Botao titulo="Salvar cadastro inicial" onPress={salvar} carregando={salvando} larguraTotal />
                    <Botao titulo="Cancelar" variante="ghost" onPress={() => navigation.goBack()} larguraTotal />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
    safe: { flex: 1, backgroundColor: cores.fundoPrimario },
    c: { flex: 1 },
    p: { padding: Espacamento.screen, gap: Espacamento.md },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
    sub: { ...Tipografia.corpoMedio, color: cores.textoSecundario },
    bloco: {
        backgroundColor: cores.fundoCartao,
        padding: Espacamento.lg,
        borderRadius: Raio.lg,
        borderWidth: 1,
        borderColor: cores.borda,
    },
});
