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
import { Espacamento, Raio, TemaCores, Tipografia, useTema } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "EncerrarConsulta">;

export function EncerrarConsulta({ navigation, route }: Props) {
    const { cores } = useTema();
    const styles = criarStyles(cores);
    const insets = useSafeAreaInsets();
    const { buscarRealizadasNaoEncerradas, consultas, encerrar } = useConsulta();
    const { buscarPorId } = useCliente();
    const { buscarNome, buscarPorId: buscarMedico } = useMedico();
    const { buscarPorId: esp } = useEspecialidade();
    const dados = buscarRealizadasNaoEncerradas();
    const numero = route.params?.consultaNumero;
    const atual = useMemo(() => consultas.find(c => c.numero === numero), [consultas, numero]);

    const valorSugerido = useMemo(() => {
        if (!atual) return "";
        if (atual.tipo === "RETORNO") return "0";
        const medico = buscarMedico(atual.medicoId);
        return medico?.valorConsulta != null ? String(medico.valorConsulta) : "";
    }, [atual, buscarMedico]);

    const [valor, setValor] = useState(()=>{
        if (!atual) return "";
        if (atual.tipo === "RETORNO") return "0";
        const medico = buscarMedico(atual?.medicoId);
        return medico?.valorConsulta != null ? String(medico.valorConsulta) : "";
    });
    const [pag, setPag] = useState<string | number | null>(null);
    const [procedimentos, setProcedimentos] = useState("");

    if (numero && atual) {
        const retorno = atual.tipo === "RETORNO";
        const valorExibir = retorno ? "0" : valor;

        const linhasExtrato = [
            `Consulta ${retorno ? "RETORNO" : "NOVA"}: R$ ${retorno ? "0,00" : (parseFloat(valor || "0").toFixed(2).replace(".", ","))}`,
            ...(procedimentos.trim() ? procedimentos.trim().split("\n").filter(Boolean).map(p => `  - ${p.trim()}`) : []),
        ];

        return (
            <View style={[styles.c, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <Text style={styles.t}>Encerrar Consulta</Text>
                {retorno && (
                    <View style={styles.alerta}>
                        <Text style={styles.a}>RETORNO - SEM COBRANCA</Text>
                    </View>
                )}
                <View style={styles.bloco}>
                    <Text style={styles.s}>Dados financeiros</Text>
                    <CampoTexto
                        label={`Valor (R$)${!retorno && valorSugerido ? "  (preenchido automaticamente)" : ""}`}
                        valor={valorExibir}
                        aoAlterar={setValor}
                        desabilitado={retorno}
                        teclado="decimal-pad"
                    />
                    <Combo
                        label="Tipo de Pagamento"
                        itens={[
                            { label: "Dinheiro", value: "DINHEIRO" },
                            { label: "PIX", value: "PIX" },
                            { label: "Cartao Credito", value: "CARTAO_CREDITO" },
                            { label: "Cartao Debito", value: "CARTAO_DEBITO" },
                            { label: "Convenio", value: "CONVENIO" },
                        ]}
                        valor={pag}
                        onSelecionar={setPag}
                        desabilitado={retorno}
                    />
                </View>
                <View style={styles.bloco}>
                    <Text style={styles.s}>Procedimentos realizados</Text>
                    <CampoTexto
                        label="Um procedimento por linha (opcional)"
                        valor={procedimentos}
                        aoAlterar={setProcedimentos}
                        multiline
                        altura={90}
                    />
                    <View style={styles.extratoBox}>
                        <Text style={styles.extratoTitulo}>Extrato</Text>
                        {linhasExtrato.map((l, i) => (
                            <Text key={i} style={styles.extratoTxt}>{l}</Text>
                        ))}
                    </View>
                </View>
                <Botao
                    titulo="Encerrar Consulta"
                    onPress={async () => {
                        const v = retorno ? 0 : parseFloat(valor || "0");
                        await encerrar(numero, v, (pag as any) ?? "DINHEIRO", procedimentos.trim() || undefined);
                        navigation.goBack();
                    }}
                    desabilitado={!retorno && (!valor || !pag)}
                    larguraTotal
                />
            </View>
        );
    }

    return (
        <View style={[styles.c, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <Text style={styles.t}>Consultas para encerramento</Text>
            <ListaGenerica
                dados={dados}
                textoVazio="Nenhuma consulta aguarda encerramento"
                renderItem={(c) => (
                    <CardConsulta
                        consulta={c}
                        nomeCliente={buscarPorId(c.clienteId)?.nome ?? ""}
                        nomeMedico={buscarNome(c.medicoId)}
                        nomeEspecialidade={esp(c.especialidadeId)?.nome ?? ""}
                        acaoLabel="Encerrar"
                        onPress={() => navigation.navigate("EncerrarConsulta", { consultaNumero: c.numero })}
                    />
                )}
            />
        </View>
    );
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
    c: { flex: 1, backgroundColor: cores.fundoPrimario, padding: Espacamento.screen, gap: Espacamento.md },
    t: { ...Tipografia.titulo, color: cores.textoPrimario },
    s: { ...Tipografia.subtitulo, color: cores.textoPrimario, marginBottom: Espacamento.sm },
    bloco: { backgroundColor: cores.fundoCartao, padding: Espacamento.lg, borderRadius: 12, gap: Espacamento.sm },
    alerta: { backgroundColor: cores.avisoSuave, padding: Espacamento.md, borderRadius: 8 },
    a: { color: cores.aviso, ...Tipografia.corpoMedio },
    extratoBox: {
        backgroundColor: cores.fundoSecundario,
        borderRadius: Raio.md,
        padding: Espacamento.md,
        borderLeftWidth: 3,
        borderLeftColor: cores.acento,
    },
    extratoTitulo: { ...Tipografia.legenda, color: cores.acentoTexto, marginBottom: Espacamento.xs },
    extratoTxt: { ...Tipografia.legenda, color: cores.textoPrimario, lineHeight: 20 },
});
