import React, { useMemo, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Cores, Espacamento, Raio, Tipografia, touchMin } from "../styles/Tema";

const toDate = (s: string) => new Date(`${s}T00:00:00`);
const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function SelecionarPeriodo({
  dataInicio,
  dataFim,
  aoAlterarInicio,
  aoAlterarFim,
}: {
  dataInicio: string;
  dataFim: string;
  aoAlterarInicio: (d: string) => void;
  aoAlterarFim: (d: string) => void;
}) {
  const [campo, setCampo] = useState<"inicio" | "fim" | null>(null);

  const erro = useMemo(() => {
    const i = toDate(dataInicio);
    const f = toDate(dataFim);
    const max = new Date(i);
    max.setDate(i.getDate() + 60);
    if (f < i) return "Data final deve ser maior que inicial";
    if (f > max) return "Data final deve ser ate +60 dias";
    return "";
  }, [dataInicio, dataFim]);

  const refMes = useMemo(() => {
    const d = toDate(dataInicio);
    return `${MESES[d.getMonth()]} ${d.getFullYear()}`;
  }, [dataInicio]);

  const mudarMes = (delta: number) => {
    const base = toDate(dataInicio);
    base.setDate(12);
    base.setMonth(base.getMonth() + delta);
    const y = base.getFullYear();
    const m = base.getMonth();
    const primeiro = new Date(y, m, 1);
    const ultimo = new Date(y, m + 1, 0);
    aoAlterarInicio(fmt(primeiro));
    aoAlterarFim(fmt(ultimo));
  };

  return (
    <View>
      <Text style={styles.dica}>Use as setas para mudar o mes exibido nos horarios livres.</Text>
      <View style={styles.navMes}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => mudarMes(-1)}
          accessibilityRole="button"
          accessibilityLabel="Mes anterior"
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={Cores.textoPrimario} />
        </TouchableOpacity>
        <Text style={styles.mesTitulo}>{refMes}</Text>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => mudarMes(1)}
          accessibilityRole="button"
          accessibilityLabel="Proximo mes"
        >
          <MaterialCommunityIcons name="chevron-right" size={28} color={Cores.textoPrimario} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity activeOpacity={0.75} style={styles.bt} onPress={() => setCampo("inicio")}>
          <Text style={styles.rotuloPicker}>De</Text>
          <Text style={styles.txt}>{dataInicio}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} style={styles.bt} onPress={() => setCampo("fim")}>
          <Text style={styles.rotuloPicker}>Ate</Text>
          <Text style={styles.txt}>{dataFim}</Text>
        </TouchableOpacity>
      </View>
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
      {campo && (
        <DateTimePicker
          value={toDate(campo === "inicio" ? dataInicio : dataFim)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_: any, d?: Date) => {
            setCampo(null);
            if (!d) return;
            const v = fmt(d);
            campo === "inicio" ? aoAlterarInicio(v) : aoAlterarFim(v);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dica: { ...Tipografia.legenda, color: Cores.textoSecundario, marginBottom: Espacamento.sm },
  navMes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Espacamento.md,
    backgroundColor: Cores.fundoSecundario,
    borderRadius: Raio.md,
    borderWidth: 1,
    borderColor: Cores.borda,
    paddingHorizontal: Espacamento.xs,
  },
  navBtn: {
    minWidth: touchMin,
    minHeight: touchMin,
    alignItems: "center",
    justifyContent: "center",
  },
  mesTitulo: { ...Tipografia.subtitulo, color: Cores.textoPrimario, flex: 1, textAlign: "center" },
  row: { flexDirection: "row", gap: Espacamento.sm, marginBottom: Espacamento.sm },
  bt: {
    flex: 1,
    backgroundColor: Cores.fundoInput,
    borderColor: Cores.borda,
    borderWidth: 1,
    borderRadius: Raio.md,
    minHeight: touchMin + 8,
    justifyContent: "center",
    paddingHorizontal: Espacamento.md,
    paddingVertical: Espacamento.sm,
  },
  rotuloPicker: { ...Tipografia.legenda, color: Cores.textoSecundario, marginBottom: Espacamento.xs },
  txt: { color: Cores.textoPrimario, ...Tipografia.corpo },
  erro: { color: Cores.erro, ...Tipografia.legenda },
});