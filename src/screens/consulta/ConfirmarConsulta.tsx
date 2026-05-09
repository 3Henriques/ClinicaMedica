// • Listagem das consultas marcadas e não confirmadas.
// • Ação de confirmar.

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useConsulta } from "../../hooks/useConsulta";
import { useCliente } from "../../hooks/useCliente";
import { useMedico } from "../../hooks/useMedico";
import { ListaGenerica } from "../../components/ListaGenerica";
import { CardConfirmarConsulta } from "../../components/CardConfirmarConsulta";
import { Botao } from "../../components/Botao";
import { Cores, Espacamento, Tipografia } from "../../styles/Tema";

export function ConfirmarConsulta() {
    const { buscarNaoConfirmadasHoje, confirmar } = useConsulta();
    const { buscarPorId } = useCliente();
    const { buscarNome } = useMedico();
    const [setor, setSetor] = useState<Set<number>>(new Set());
    const dados = buscarNaoConfirmadasHoje();
    const toggle = (n: number) => {
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
            renderItem={(c) => <CardConfirmarConsulta
                consulta={c}
                nomeCliente={buscarPorId(c.clienteId)?.nome ?? ""}
                nomeMedico={buscarNome(c.medicoId)}
                confirmado={setor.has(c.numero)}
                aoConfirmar={toggle}
            />}
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
const styles = StyleSheet.create({
    c: { flex: 1, backgroundColor: Cores.fundoPrimario, padding: Espacamento.screen },
    t: { ...Tipografia.titulo, color: Cores.textoPrimario },
    sub: { ...Tipografia.corpoMedio, color: Cores.textoSecundario, marginTop: Espacamento.xs, marginBottom: Espacamento.md },
    rodape: { paddingTop: Espacamento.sm }
});
