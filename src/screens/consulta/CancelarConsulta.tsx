import React, { useMemo, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useConsulta } from "../../hooks/useConsulta";
import { useCliente } from "../../hooks/useCliente";
import { useMedico } from "../../hooks/useMedico";
import { useEspecialidade } from "../../hooks/useEspecialidade";
import { CampoTexto } from "../../components/CampoTexto";
import { ListaGenerica } from "../../components/ListaGenerica";
import { CardConsulta } from "../../components/CardConsulta";
import { Combo } from "../../components/Combo";
import { Botao } from "../../components/Botao";
import { Cores, Espacamento, Tipografia } from "../../styles/Tema";

export function CancelarConsulta() {

    const { buscarPorStatus, cancelar } = useConsulta();
    const { buscarPorId } = useCliente();
    const { buscarNome } = useMedico();
    const { buscarPorId: esp } = useEspecialidade();
    const [termo, setTermo] = useState("");
    const [num, setNum] = useState<number | null>(null);
    const [motivo, setMotivo] = useState<string | number | null>(null);
    const [obs, setObs] = useState("");
    const dados = useMemo(
        () => buscarPorStatus(["M", "OK"]).filter(c => (buscarPorId(c.clienteId)?.nome ?? "").toLowerCase().includes(termo.toLowerCase())),
        [termo, buscarPorStatus, buscarPorId]
    );


    return <View style={styles.c}>
        <Text style={styles.t}>Cancelar Consulta</Text>
        <CampoTexto label="Buscar paciente" valor={termo} aoAlterar={setTermo} />
        <ListaGenerica
            dados={dados}
            textoVazio="Nenhuma consulta para cancelamento"
            renderItem={
                (c) => <CardConsulta
                    consulta={c}
                    nomeCliente={buscarPorId(c.clienteId)?.nome ?? ""}
                    nomeMedico={buscarNome(c.medicoId)}
                    nomeEspecialidade={esp(c.especialidadeId)?.nome ?? ""}
                    onPress={() => setNum(c.numero)}
                />
            }
        />
        <Modal visible={num !== null} transparent animationType="slide">
            <View style={styles.modalBg}>
                <View style={styles.modal}>
                    <Text style={styles.sub}>Motivo do cancelamento</Text>
                    <Combo
                        label="Motivo"
                        itens={[
                            { label: "Solicitacao do Cliente", value: "SOLICITACAO_CLIENTE" },
                            { label: "Solicitacao do Medico", value: "SOLICITACAO_MEDICO" },
                            { label: "Nao Comparecimento", value: "NAO_COMPARECIMENTO" }
                        ]} valor={motivo} onSelecionar={setMotivo}
                    />
                    <CampoTexto
                        label="Observacao"
                        valor={obs}
                        aoAlterar={setObs}
                        multiline altura={72}
                    />
                    <Botao
                        titulo="Confirmar Cancelamento"
                        variante="perigo"
                        onPress={async () => {
                            if (num && motivo) {
                                await cancelar(num, motivo as any, obs);
                                setNum(null); setMotivo(null);
                                setObs("");
                            }
                        }}
                        desabilitado={!motivo}
                        larguraTotal
                    />
                    <Botao
                        titulo="Voltar"
                        variante="ghost"
                        onPress={() => setNum(null)}
                        larguraTotal
                    />
                </View>
            </View>
        </Modal>
    </View>;
}


const styles = StyleSheet.create({
    c: { flex: 1, backgroundColor: Cores.fundoPrimario, padding: Espacamento.screen, gap: Espacamento.md },
    t: { ...Tipografia.titulo, color: Cores.textoPrimario },
    sub: { ...Tipografia.subtitulo, color: Cores.textoPrimario, marginBottom: Espacamento.sm },
    modalBg: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
    modal: { backgroundColor: Cores.fundoModal, padding: Espacamento.lg, borderTopLeftRadius: 12, borderTopRightRadius: 12, gap: Espacamento.sm }
});
