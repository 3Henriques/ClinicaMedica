import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Agenda } from "../models/Agenda";
import { Cores, Espacamento, Raio, Tipografia } from "../styles/Tema";
import { StatusBadge } from "./StatusBadge";

export function PlanilhaAgenda({ slots, slotSelecionado, aoSelecionarSlot }: { slots: Agenda[]; slotSelecionado?: Agenda | null; aoSelecionarSlot:(slot:Agenda)=>void }) {
  const { datas, horas, mapa } = useMemo(() => {
    const ds = Array.from(new Set(slots.map((s) => s.data))).sort();
    const hs = Array.from(new Set(slots.map((s) => s.horaInicio))).sort();
    const m: Record<string, Record<string, Agenda>> = {};
    slots.forEach((s) => { if (!m[s.data]) m[s.data] = {}; m[s.data][s.horaInicio] = s; });
    return { datas: ds, horas: hs, mapa: m };
  }, [slots]);
  const dataSel = slotSelecionado?.data;
  return (
    <ScrollView horizontal nestedScrollEnabled>
      <View>
        <View style={styles.row}>
          <Text style={styles.head}>Hora</Text>
          {datas.map((d) => (
            <Text key={d} style={[styles.head, dataSel === d && styles.headSel]}>
              {d}
            </Text>
          ))}
        </View>
        <ScrollView nestedScrollEnabled>
          {horas.map((h) => (
            <View key={h} style={styles.row}>
              <Text style={styles.cellHora}>{h}</Text>
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
                    style={[styles.cell, !click && styles.cellDesabilitada, sel && styles.sel]}
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
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  head: { minWidth: 112, color: Cores.textoSecundario, padding: Espacamento.sm, ...Tipografia.legenda },
  headSel: { color: Cores.acentoTexto, ...Tipografia.subtitulo },
  cellHora: {
    minWidth: 112,
    minHeight: 48,
    borderWidth: 1,
    borderColor: Cores.divisor,
    alignItems: "center",
    justifyContent: "center",
    color: Cores.textoSecundario,
    ...Tipografia.corpoMedio,
  },
  cell: {
    minWidth: 112,
    minHeight: 48,
    borderWidth: 1,
    borderColor: Cores.divisor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Cores.fundoSecundario,
  },
  cellDesabilitada: { opacity: 0.65 },
  sel: {
    borderColor: Cores.acento,
    backgroundColor: Cores.acentoSuave,
    borderRadius: Raio.md,
    borderWidth: 3,
    shadowColor: Cores.acento,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
});