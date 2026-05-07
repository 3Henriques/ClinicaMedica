// • Listagem das consultas realizadas e não encerradas.
// • Tela para registrar pagamento e procedimentos.    

import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useConsulta } from "../../hooks/useConsulta";
import { useCliente } from "../../hooks/useCliente";
import { useMedico } from "../../hooks/useMedico";
import { useEspecialidade } from "../../hooks/useEspecialidade";
import { ListaGenerica } from "../../components/ListaGenerica";
import { CardConsulta } from "../../components/CardConsulta";
import { CampoTexto } from "../../components/CampoTexto";
import { Combo } from "../../components/Combo";
import { Botao } from "../../components/Botao";
import { Cores, Espacamento, Tipografia } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "EncerrarConsulta">;


export function EncerrarConsulta({ navigation, route }: Props) {
    const insets = useSafeAreaInsets();
    const { buscarRealizadasNaoEncerradas, consultas, encerrar } = useConsulta();
    const { buscarPorId } = useCliente();
    const { buscarNome } = useMedico();
    const { buscarPorId: esp } = useEspecialidade();
    const dados = buscarRealizadasNaoEncerradas();
    const numero = route.params?.consultaNumero;
    const atual = useMemo(() => consultas.find(
        c => c.numero === numero),
        [consultas, numero]
    );
    const [valor, setValor] = useState("");
    const [pag, setPag] = useState<string | number | null>(null);
    if (numero && atual) {
        const retorno = atual.tipo === "RETORNO";


        return <View style={[styles.c, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <Text style={styles.t}>Encerrar Consulta</Text>
            {retorno && <View style={styles.alerta}>
                <Text style={styles.a}>RETORNO - SEM COBRANCA</Text>
            </View>}<View style={styles.bloco}>
                <Text style={styles.s}>Dados financeiros</Text>
                <CampoTexto label="Valor" valor={retorno ? "0" : valor} aoAlterar={setValor} desabilitado={retorno} teclado="decimal-pad" />
                <Combo label="Tipo de Pagamento" itens={[
                    { label: "Dinheiro", value: "DINHEIRO" },
                    { label: "PIX", value: "PIX" },
                    { label: "Cartao Credito", value: "CARTAO_CREDITO" },
                    { label: "Cartao Debito", value: "CARTAO_DEBITO" },
                    { label: "Convenio", value: "CONVENIO" }
                ]} valor={pag} onSelecionar={setPag} desabilitado={retorno}
                />
            </View>
            <Botao titulo="Encerrar Consulta" onPress={async () => {
                const v = retorno ? 0 : parseFloat(valor || "0");
                await encerrar(numero, v, (pag as any) ?? "DINHEIRO");
                navigation.goBack();
            }}
                desabilitado={!retorno && (!valor || !pag)} larguraTotal
            />
        </View>;
    }
    return <View style={[styles.c, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={styles.t}>Consultas para encerramento</Text>
        <ListaGenerica
            dados={dados}
            textoVazio="Nenhuma consulta aguarda encerramento"
            renderItem={(c) => <CardConsulta
                consulta={c}
                nomeCliente={buscarPorId(c.clienteId)?.nome ?? ""}
                nomeMedico={buscarNome(c.medicoId)}
                nomeEspecialidade={esp(c.especialidadeId)?.nome ?? ""}
                acaoLabel="Encerrar"
                onPress={() => navigation.navigate("EncerrarConsulta", { consultaNumero: c.numero })} />
            }
        />
    </View>;
}

const styles = StyleSheet.create({
    c: { flex: 1, backgroundColor: Cores.fundoPrimario, padding: Espacamento.screen, gap: Espacamento.md },
    t: { ...Tipografia.titulo, color: Cores.textoPrimario },
    s: { ...Tipografia.subtitulo, color: Cores.textoPrimario, marginBottom: Espacamento.sm },
    bloco: { backgroundColor: Cores.fundoCartao, padding: Espacamento.lg, borderRadius: 12 },
    alerta: { backgroundColor: Cores.avisoSuave, padding: Espacamento.md, borderRadius: 8 },
    a: { color: Cores.aviso, ...Tipografia.corpoMedio }
});
