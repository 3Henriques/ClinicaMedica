import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Agenda } from "../models/Agenda";
import { Espacamento, Raio, TemaCores, Tipografia, useTema } from "../styles/Tema";
import { StatusBadge } from "./StatusBadge";

const COL_HORA = 72;
const COL_DATA = 112;
const ALTURA_LINHA = 48;

export function PlanilhaAgenda({ slots, slotSelecionado, aoSelecionarSlot }: { slots: Agenda[]; slotSelecionado?: Agenda | null; aoSelecionarSlot:(slot:Agenda)=>void }) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  const { datas, horas, mapa } = useMemo(() => {
    const ds = Array.from(new Set(slots.map((s) => s.data))).sort();
    const hs = Array.from(new Set(slots.map((s) => s.horaInicio))).sort();
    const m: Record<string, Record<string, Agenda>> = {};
    slots.forEach((s) => { if (!m[s.data]) m[s.data] = {}; m[s.data][s.horaInicio] = s; });
    return { datas: ds, horas: hs, mapa: m };
  }, [slots]);
  const dataSel = slotSelecionado?.data;

  if (slots.length === 0) {
    return <View style={styles.vazio}><Text style={styles.vazioTxt}>Nenhum horario disponivel neste periodo</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Coluna de horas — fixa (não rola horizontalmente) */}
      <View style={styles.colunaHoras}>
        <View style={[styles.cell, styles.cabecalhoHora]} />
        {horas.map((h) => (
          <View key={h} style={[styles.cell, styles.cellHoraWrap]}>
            <Text style={styles.cellHoraTxt}>{h}</Text>
          </View>
        ))}
      </View>

      {/* Área de dados — rola horizontalmente */}
      <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator>
        <View>
          {/* Cabeçalho de datas */}
          <View style={styles.row}>
            {datas.map((d) => (
              <View key={d} style={styles.cell}>
                <Text style={[styles.head, dataSel === d && styles.headSel]} numberOfLines={1}>{d}</Text>
              </View>
            ))}
          </View>
          {/* Linhas de horários */}
          <ScrollView nestedScrollEnabled>
            {horas.map((h) => (
              <View key={h} style={styles.row}>
                {datas.map((d) => {
                  const slot = mapa[d]?.[h];
                  if (!slot) return <View key={d + h} style={styles.cell} />;
                  const click = ["L", "C"].includes(slot.status);
                  const sel = slotSelecionado?.id === slot.id;
                  return (
                    <TouchableOpacity
                      key={d + h}
                      activeOpacity={0.75}
                      disabled={!click}
                      onPress={() => aoSelecionarSlot(slot)}
                      style={[styles.cell, styles.cellDado, !click && styles.cellDesabilitada, sel && styles.sel]}
                    >
                      <StatusBadge status={slot.status} tamanho="sm" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
  container: { flexDirection: "row" },
  colunaHoras: { zIndex: 1 },
  row: { flexDirection: "row" },
  cell: {
    width: COL_DATA,
    height: ALTURA_LINHA,
    borderWidth: 1,
    borderColor: cores.divisor,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cabecalhoHora: { width: COL_HORA, backgroundColor: cores.fundoSecundario },
  cellHoraWrap: {
    width: COL_HORA,
    backgroundColor: cores.fundoSecundario,
  },
  cellHoraTxt: {
    color: cores.textoSecundario,
    ...Tipografia.legenda,
    textAlign: "center",
  },
  head: { color: cores.textoSecundario, ...Tipografia.legenda, textAlign: "center", paddingHorizontal: 4 },
  headSel: { color: cores.acentoTexto, ...Tipografia.subtitulo },
  cellDado: { backgroundColor: cores.fundoSecundario },
  cellDesabilitada: { opacity: 0.65 },
  sel: {
    borderColor: cores.acento,
    backgroundColor: cores.acentoSuave,
    borderRadius: Raio.md,
    borderWidth: 3,
    shadowColor: cores.acento,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
  vazio: { padding: Espacamento.lg, alignItems: "center" },
  vazioTxt: { color: cores.textoSecundario, ...Tipografia.corpoMedio },
});
