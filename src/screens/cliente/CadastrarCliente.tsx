import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CampoTexto } from "../../components/CampoTexto";
import { Combo } from "../../components/Combo";
import { Botao } from "../../components/Botao";
import { useCliente } from "../../hooks/useCliente";
import { Sexo } from "../../models/enums/Sexo";
import { Espacamento, TemaCores, Tipografia, useTema } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "CadastrarCliente">;


export function CadastrarCliente({ navigation, route }: Props) {
    const { cores } = useTema();
    const styles = criarStyles(cores);
    const insets = useSafeAreaInsets();

    const { cadastrar, atualizar, buscarPorId } = useCliente();
    const cli = useMemo(
        () => route.params?.clienteIdParaEditar ? buscarPorId(route.params.clienteIdParaEditar) : undefined, [route.params, buscarPorId]
    );
    const [nome, setNome] = useState(cli?.nome ?? "");
    const [telefone1, setTelefone1] = useState(cli?.telefone?.[0] ?? "");
    const [telefone2, setTelefone2] = useState(cli?.telefone?.[1] ?? "");
    const [dtNascimento, setData] = useState(cli?.dtNascimento ?? "");
    const [sexo, setSexo] = useState<Sexo | null>(cli?.sexo ?? null);
    const [RG, setRG] = useState(cli?.RG ?? "");
    const [CPF, setCPF] = useState(cli?.CPF ?? "");
    const [logradouro, setLogradouro] = useState(cli?.endereco?.logradouro ?? "");
    const [numero, setNumero] = useState(cli?.endereco?.numero ?? 0);
    const [complemento, setComplemento] = useState(cli?.endereco?.complemento ?? "");
    const [bairro, setBairro] = useState(cli?.endereco?.bairro ?? "");
    const [cidade, setCidade] = useState(cli?.endereco?.cidade ?? "");
    const [estado, setEstado] = useState(cli?.endereco?.estado ?? "SP");
    const [nomeCovenio, setNomeCovenio] = useState(cli?.nomeCovenio ?? "");
    const [matriculaConveniado, setMatriculaConveniado] = useState(cli?.matriculaConveniado ?? "");
    const salvar = () => {

        const base = {
            nome,
            telefone: [telefone1].concat(telefone2 ? [telefone2] : []),
            dtNascimento,
            email: cli?.email ?? "",
            sexo: sexo ?? "M",
            RG,
            CPF,
            endereco: {
                logradouro,
                numero: Number(numero) || 0,
                complemento,
                bairro,
                cidade,
                estado
            },
            nomeCovenio,
            matriculaConveniado
        };

        if (cli) atualizar(cli.identificador, base); else cadastrar(base);
        navigation.goBack();
    };


    return <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView style={styles.c} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.p}>
                <Text style={styles.t}> {cli ? "Editar cliente" : "Novo cliente"} </Text>
                <View style={styles.bloco}>
                    <CampoTexto label="Nome" valor={nome} aoAlterar={setNome} />
                    <Combo label="Sexo" itens={[{ label: "Masculino", value: "M" }, { label: "Feminino", value: "F" }]} valor={sexo} onSelecionar={(v) => setSexo(v as Sexo)} />
                    <CampoTexto label="Telefone 1" valor={telefone1} aoAlterar={setTelefone1} />
                    <CampoTexto label="Telefone 2" valor={telefone2} aoAlterar={setTelefone2} />
                    <CampoTexto label="Data de Nascimento" valor={dtNascimento} aoAlterar={setData} />
                    <CampoTexto label="RG" valor={RG} aoAlterar={setRG} />
                    <CampoTexto label="CPF" valor={CPF} aoAlterar={setCPF} />
                    <Text style={styles.t}>Endereço</Text>
                    <CampoTexto label="Logradouro" valor={logradouro} aoAlterar={setLogradouro} />
                    <CampoTexto label="Número" valor={String(numero)} aoAlterar={(v) => setNumero(Number(v))} />
                    <CampoTexto label="Complemento" valor={complemento} aoAlterar={setComplemento} />
                    <CampoTexto label="Bairro" valor={bairro} aoAlterar={setBairro} />
                    <CampoTexto label="Cidade" valor={cidade} aoAlterar={setCidade} />
                    <CampoTexto label="Estado" valor={estado} aoAlterar={setEstado} />
                    <CampoTexto label="Nome Convênio" valor={nomeCovenio} aoAlterar={setNomeCovenio} />
                    <CampoTexto label="Matrícula Conveniado" valor={matriculaConveniado} aoAlterar={setMatriculaConveniado} />
                </View>
                <Botao titulo="Salvar Cliente" onPress={salvar} larguraTotal />
                <Botao titulo="Cancelar" variante="ghost" onPress={() => navigation.goBack()} larguraTotal />

            </ScrollView>
        </KeyboardAvoidingView>
    </View>;
}


const criarStyles = (cores: TemaCores) => StyleSheet.create({
    safe: { flex: 1, backgroundColor: cores.fundoPrimario },
    c: { flex: 1 },
    p: { padding: Espacamento.screen, gap: Espacamento.md },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
    bloco: { backgroundColor: cores.fundoCartao, padding: Espacamento.lg, borderRadius: 12 }
});
