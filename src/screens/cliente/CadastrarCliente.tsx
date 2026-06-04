import React, { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CampoTexto } from "../../components/CampoTexto";
import { Combo } from "../../components/Combo";
import { Botao } from "../../components/Botao";
import { useCliente } from "../../hooks/useCliente";
import { Sexo } from "../../models/enums/Sexo";
import { Espacamento, TemaCores, Tipografia, useTema } from "../../styles/Tema";
import { mascaraCpf, mascaraData, mascaraTelefone, mascaraUf } from "../../utils/mascaras";

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
    const [observacoes, setObservacoes] = useState(cli?.observacoes ?? "");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!cli) return;

        setNome(cli.nome ?? "");
        setTelefone1(cli.telefone?.[0] ?? "");
        setTelefone2(cli.telefone?.[1] ?? "");
        setData(cli.dtNascimento ?? "");
        setSexo(cli.sexo ?? null);
        setRG(cli.RG ?? "");
        setCPF(cli.CPF ?? "");
        setLogradouro(cli.endereco?.logradouro ?? "");
        setNumero(cli.endereco?.numero ?? 0);
        setComplemento(cli.endereco?.complemento ?? "");
        setBairro(cli.endereco?.bairro ?? "");
        setCidade(cli.endereco?.cidade ?? "");
        setEstado(cli.endereco?.estado ?? "SP");
        setNomeCovenio(cli.nomeCovenio ?? "");
        setMatriculaConveniado(cli.matriculaConveniado ?? "");
        setObservacoes(cli.observacoes ?? "");
    }, [cli]);

    const salvar = async () => {
        if (route.params?.clienteIdParaEditar && !cli) {
            Alert.alert("Aguarde", "Os dados do paciente ainda estao carregando.");
            return;
        }

        if (!nome.trim() || !telefone1.trim()) {
            Alert.alert("Dados obrigatorios", "Informe o nome e pelo menos um telefone do paciente.");
            return;
        }

        const base = {
            nome: nome.trim(),
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
            matriculaConveniado,
            observacoes
        };

        setSalvando(true);
        try {
            if (cli) {
                await atualizar(cli.identificador, base);
            } else {
                await cadastrar(base);
            }
            navigation.goBack();
        } finally {
            setSalvando(false);
        }
    };


    return <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView style={styles.c} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.p}>
                <Text style={styles.t}>{cli?.cadastroCompleto === false ? "Concluir cadastro" : cli ? "Editar paciente" : "Novo paciente"}</Text>
                <View style={styles.bloco}>
                    <CampoTexto label="Nome" valor={nome} aoAlterar={setNome} />
                    <CampoTexto label="Telefone 1" valor={telefone1} aoAlterar={(v) => setTelefone1(mascaraTelefone(v))} teclado="phone-pad" />
                    <CampoTexto label="Telefone 2" valor={telefone2} aoAlterar={(v) => setTelefone2(mascaraTelefone(v))} teclado="phone-pad" />
                    <CampoTexto label="Data de Nascimento" valor={dtNascimento} aoAlterar={(v) => setData(mascaraData(v))} teclado="number-pad" />
                    <CampoTexto label="Observacoes" valor={observacoes} aoAlterar={setObservacoes} multiline altura={90} />
                    <Combo label="Sexo" itens={[{ label: "Masculino", value: "M" }, { label: "Feminino", value: "F" }]} valor={sexo} onSelecionar={(v) => setSexo(v as Sexo)} />
                    <CampoTexto label="RG" valor={RG} aoAlterar={setRG} />
                    <CampoTexto label="CPF" valor={CPF} aoAlterar={(v) => setCPF(mascaraCpf(v))} teclado="number-pad" />
                    <Text style={styles.t}>Endereço</Text>
                    <CampoTexto label="Logradouro" valor={logradouro} aoAlterar={setLogradouro} />
                    <CampoTexto label="Número" valor={String(numero)} aoAlterar={(v) => setNumero(Number(v.replace(/\D/g, "")) || 0)} teclado="number-pad" />
                    <CampoTexto label="Complemento" valor={complemento} aoAlterar={setComplemento} />
                    <CampoTexto label="Bairro" valor={bairro} aoAlterar={setBairro} />
                    <CampoTexto label="Cidade" valor={cidade} aoAlterar={setCidade} />
                    <CampoTexto label="Estado" valor={estado} aoAlterar={(v) => setEstado(mascaraUf(v))} />
                    <CampoTexto label="Nome Convênio" valor={nomeCovenio} aoAlterar={setNomeCovenio} />
                    <CampoTexto label="Matrícula Conveniado" valor={matriculaConveniado} aoAlterar={setMatriculaConveniado} />
                </View>
                <Botao titulo="Salvar paciente" onPress={salvar} carregando={salvando} larguraTotal />
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
