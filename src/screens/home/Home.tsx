import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../hooks/useAuth";
import { useConsulta } from "../../hooks/useConsulta";
import { Botao } from "../../components/Botao";
import { Espacamento, TemaCores, Tipografia, touchMin, useTema } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Modulo = { titulo: string; rota: keyof RootStackParamList; icone: keyof typeof MaterialCommunityIcons.glyphMap };

export function Home({ navigation }: Props) {
  const { cores } = useTema();
  const insets = useSafeAreaInsets();
  const styles = criarStyles(cores, insets);
  const { usuario, logout } = useAuth();
  const consulta = useConsulta();

  const modulosSecretaria: Modulo[] = [
    { titulo: "Clientes", rota: "ListarClientes", icone: "account-group-outline" },
    { titulo: "Marcar", rota: "MarcarConsulta", icone: "calendar-plus" },
    { titulo: "Confirmar", rota: "ConfirmarConsulta", icone: "calendar-check" },
    { titulo: "Encerrar", rota: "EncerrarConsulta", icone: "cash-register" },
    { titulo: "Cancelar", rota: "CancelarConsulta", icone: "calendar-remove" },
  ];

  const modulosMedico: Modulo[] = [
    { titulo: "Realizar", rota: "RealizarConsulta", icone: "stethoscope" },
    { titulo: "Cancelar", rota: "CancelarConsulta", icone: "calendar-remove" },
  ];

  const modulos = usuario?.perfil === "MEDICO" ? modulosMedico : modulosSecretaria;

  return (
    <View style={styles.c}>
      <ScrollView contentContainerStyle={styles.p} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
                <MaterialCommunityIcons name={m.icone} size={28} color={cores.acentoTexto} />
                <Text style={styles.tx}>{m.titulo}</Text>
              </View>
              <Botao titulo="Acessar" variante="secundario" onPress={() => navigation.navigate(m.rota as never)} larguraTotal />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const criarStyles = (cores: TemaCores, insets: { top: number; bottom: number }) => StyleSheet.create({
    c: {
        flex: 1,
        backgroundColor: cores.fundoPrimario,
        paddingTop: insets.top,
        paddingBottom: insets.bottom
    },

    p: {
      flexGrow: 1,
        padding: Espacamento.screen,
        paddingBottom: Espacamento.xxxl,
        gap: Espacamento.section
    },

    top: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: Espacamento.md
    },

    saudacao: {
        flex: 1,
        gap: Espacamento.xs
    },

    ola: {
        ...Tipografia.corpo,
        color: cores.textoSecundario
    },

    nome: {
        ...Tipografia.display,
        color: cores.textoPrimario
    },

    destaque: {
        backgroundColor: cores.fundoCartaoElevado,
        borderRadius: 12,
        paddingVertical: Espacamento.lg,
        paddingHorizontal: Espacamento.xl,
        borderWidth: 1,
        borderColor: cores.borda,
    },

    statLabel: {
        ...Tipografia.legenda,
        color: cores.textoSecundario,
        textTransform: "uppercase",
        letterSpacing: 0.8
    },

    statValor: {
        ...Tipografia.displayGrande,
        color: cores.textoPrimario,
        marginTop: Espacamento.xs
    },

    secaoTitulo: {
        ...Tipografia.subtitulo,
        color: cores.textoSecundario
    },

    grid: {
        gap: Espacamento.lg
    },

    card: {
        backgroundColor: cores.fundoCartao,
        padding: Espacamento.lg,
        borderRadius: 12,
        gap: Espacamento.md,
        minHeight: touchMin + 56,
        borderWidth: 1,
        borderColor: cores.divisor,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: Espacamento.md
    },

    tx: {
        ...Tipografia.titulo,
        color: cores.textoPrimario,
        flex: 1
    },
});
