import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../hooks/useAuth";
import { useConsulta } from "../../hooks/useConsulta";
import { Botao } from "../../components/Botao";
import { Cores, Espacamento, Tipografia, touchMin } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Modulo = { titulo: string; rota: keyof RootStackParamList; icone: keyof typeof MaterialCommunityIcons.glyphMap };

export function Home({ navigation }: Props) {
  const { usuario, logout } = useAuth();
  const consulta = useConsulta();

  const modulosSecretaria: Modulo[] = [
    { titulo: "Clientes", rota: "ListarClientes", icone: "account-group-outline" },
    { titulo: "Marcar", rota: "MarcarConsulta", icone: "calendar-plus" },
    { titulo: "Confirmar", rota: "ConfirmarConsulta", icone: "calendar-check" },
    { titulo: "Realizar", rota: "RealizarConsulta", icone: "stethoscope" },
    { titulo: "Encerrar", rota: "EncerrarConsulta", icone: "cash-register" },
    { titulo: "Cancelar", rota: "CancelarConsulta", icone: "calendar-remove" },
    { titulo: "Medicos", rota: "ListarMedicos", icone: "doctor" },
  ];

  const modulosMedico: Modulo[] = [
    { titulo: "Realizar", rota: "RealizarConsulta", icone: "stethoscope" },
    { titulo: "Cancelar", rota: "CancelarConsulta", icone: "calendar-remove" },
  ];

  const modulos = usuario?.perfil === "MEDICO" ? modulosMedico : modulosSecretaria;

  return (
    <SafeAreaView style={styles.c}>
      <ScrollView contentContainerStyle={styles.p}>
        <View style={styles.top}>
          <View style={styles.saudacao}>
            <Text style={styles.ola}>Ola,</Text>
            <Text style={styles.nome}>{usuario?.nome}</Text>
          </View>
          <Botao titulo="Sair" variante="ghost" onPress={() => { logout(); navigation.reset({ index: 0, routes: [{ name: "Login" }] }); }} />
        </View>

        <View style={styles.destaque}>
          <Text style={styles.statLabel}>Consultas marcadas hoje</Text>
          <Text style={styles.statValor}>{consulta.buscarPorStatus("M").length}</Text>
        </View>

        <Text style={styles.secaoTitulo}>Atalhos</Text>
        <View style={styles.grid}>
          {modulos.map((m) => (
            <View key={m.titulo} style={styles.card} accessibilityRole="button" accessibilityLabel={`${m.titulo}, abrir`}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name={m.icone} size={28} color={Cores.acentoTexto} />
                <Text style={styles.tx}>{m.titulo}</Text>
              </View>
              <Botao titulo="Acessar" variante="secundario" onPress={() => navigation.navigate(m.rota as never)} larguraTotal />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: Cores.fundoPrimario },
  p: { padding: Espacamento.screen, paddingBottom: Espacamento.xxxl, gap: Espacamento.section },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: Espacamento.md },
  saudacao: { flex: 1, gap: Espacamento.xs },
  ola: { ...Tipografia.corpo, color: Cores.textoSecundario },
  nome: { ...Tipografia.display, color: Cores.textoPrimario },
  destaque: {
    backgroundColor: Cores.fundoCartaoElevado,
    borderRadius: 12,
    paddingVertical: Espacamento.lg,
    paddingHorizontal: Espacamento.xl,
    borderWidth: 1,
    borderColor: Cores.borda,
  },
  statLabel: { ...Tipografia.legenda, color: Cores.textoSecundario, textTransform: "uppercase", letterSpacing: 0.8 },
  statValor: { ...Tipografia.displayGrande, color: Cores.textoPrimario, marginTop: Espacamento.xs },
  secaoTitulo: { ...Tipografia.subtitulo, color: Cores.textoSecundario },
  grid: { gap: Espacamento.lg },
  card: {
    backgroundColor: Cores.fundoCartao,
    padding: Espacamento.lg,
    borderRadius: 12,
    gap: Espacamento.md,
    minHeight: touchMin + 56,
    borderWidth: 1,
    borderColor: Cores.divisor,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: Espacamento.md },
  tx: { ...Tipografia.titulo, color: Cores.textoPrimario, flex: 1 },
});
