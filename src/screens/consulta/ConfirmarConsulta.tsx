// • Listagem das consultas marcadas e não confirmadas.
// • Ação de confirmar.

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useConsulta } from "../../hooks/useConsulta";
import { useCliente } from "../../hooks/useCliente";
import { useMedico } from "../../hooks/useMedico";
import { ListaGenerica } from "../../components/ListaGenerica";
import { CardConfirmarConsulta } from "../../components/CardConfirmarConsulta";
import { Botao } from "../../components/Botao";
import { Espacamento, TemaCores, Tipografia, useTema } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "ConfirmarConsulta">;

export function ConfirmarConsulta({ navigation }: Props) {
    const { cores } = useTema();
    const styles = criarStyles(cores);
    const { buscarNaoConfirmadasHoje, confirmar } = useConsulta();
    const { buscarPorId } = useCliente();
    const { buscarNome } = useMedico();
    const [setor, setSetor] = useState<Set<number>>(new Set());
    const dados = buscarNaoConfirmadasHoje();
    const toggle = (n: number) => {
        const consulta = dados.find((c) => c.numero === n);
        const cliente = consulta ? buscarPorId(consulta.clienteId) : undefined;

        if (cliente && !cliente.cadastroCompleto) {
            navigation.navigate("CadastrarCliente", { clienteIdParaEditar: cliente.identificador, modoCadastro: "completo" });
            return;
        }

        const novo = new Set(setor);
        novo.has(n) ? novo.delete(n) : novo.add(n);
        setSetor(novo);
    };
    const confirmarTodos = async () => {
        for (const n of Array.from(setor)) {
            await confirmar(n);
        }
        setSetor(new Set());
    };


    return <View style={styles.c}>
        <Text style={styles.t}>Confirmar Consultas</Text>
        <Text style={styles.sub}>{dados.length} aguardando confirmacao</Text>
        <ListaGenerica
            dados={dados}
            textoVazio="Todas confirmadas"
            renderItem={(c) => {
                const cliente = buscarPorId(c.clienteId);

                return <CardConfirmarConsulta
                    consulta={c}
                    nomeCliente={cliente?.nome ?? ""}
                    nomeMedico={buscarNome(c.medicoId)}
                    confirmado={setor.has(c.numero)}
                    cadastroCompleto={cliente?.cadastroCompleto !== false}
                    aoConfirmar={toggle}
                />;
            }}
        />
        <View style={styles.rodape}>
            <Botao
                titulo="Confirmar Selecionadas"
                onPress={confirmarTodos}
                desabilitado={!setor.size}
                larguraTotal
            />
        </View>
    </View>;
}
const criarStyles = (cores: TemaCores) => StyleSheet.create({
    c: { flex: 1, backgroundColor: cores.fundoPrimario, padding: Espacamento.screen },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
    sub: { ...Tipografia.corpoMedio, color: cores.textoSecundario, marginTop: Espacamento.xs, marginBottom: Espacamento.md },
    rodape: { paddingTop: Espacamento.sm }
});
