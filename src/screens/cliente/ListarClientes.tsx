import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useCliente } from "../../hooks/useCliente";
import { CampoTexto } from "../../components/CampoTexto";
import { ListaGenerica } from "../../components/ListaGenerica";
import { Botao } from "../../components/Botao";
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
        <View style={styles.topo}>
            <Text style={styles.t}>Pacientes</Text>
            <Botao titulo="+ Novo paciente" onPress={() => navigation.navigate("CadastrarCliente")} />
        </View>
        <CampoTexto label="Buscar paciente" valor={termo} aoAlterar={setTermo} placeholder="Buscar por nome, CPF ou telefone" />
        <ListaGenerica
            dados={dados}
            textoVazio="Nenhum paciente encontrado"
            renderItem={(c) => {
                const nome = c.nome || "Nome nao informado";
                const telefone = Array.isArray(c.telefone) ? c.telefone[0] : c.telefone || "Telefone nao informado";
                const cpf = c.CPF || "CPF nao informado";
                const nascimento = c.dtNascimento || "Nascimento nao informado";
                const cidade = c.endereco?.cidade || "Cidade nao informada";
                const estado = c.endereco?.estado ?? "";
                return <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.card}
                    onPress={() => navigation.navigate("CadastrarCliente", { clienteIdParaEditar: c.identificador })}>
                    <Text style={styles.nome}>{nome}</Text>
                    <Text style={[styles.status, c.cadastroCompleto ? styles.completo : styles.incompleto]}>
                        {c.cadastroCompleto ? "Cadastro completo" : "Cadastro incompleto"}
                    </Text>
                    <Text style={styles.txt}>{telefone}</Text>
                    <Text style={styles.txt}>{cpf}</Text>
                    <Text style={styles.txt}>{nascimento}</Text>
                    <Text style={styles.txt}>{estado ? `${cidade}/${estado}` : cidade}</Text>
                </TouchableOpacity>;
            }} />
    </View>;
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
    c: { flex: 1, backgroundColor: cores.fundoPrimario, padding: Espacamento.screen, gap: Espacamento.md },
    topo: { gap: Espacamento.md },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
    card: {
        backgroundColor: cores.fundoCartao,
        padding: Espacamento.lg,
        borderRadius: Raio.lg,
        borderWidth: 1,
        borderColor: cores.borda,
    },
    nome: { ...Tipografia.subtitulo, color: cores.textoPrimario, marginBottom: Espacamento.xs },
    txt: { ...Tipografia.corpoMedio, color: cores.textoSecundario },
    status: { ...Tipografia.legenda, marginBottom: Espacamento.xs },
    completo: { color: cores.sucesso },
    incompleto: { color: cores.aviso }
});
