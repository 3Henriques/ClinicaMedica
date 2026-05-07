import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CampoTexto } from "../../components/CampoTexto";
import { Botao } from "../../components/Botao";
import { useAuth } from "../../hooks/useAuth";
import { PerfilUsuario } from "../../models/Usuario";
import { Cores, Espacamento, Raio, Tipografia, touchMin } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;
type PerfilLogin = { label: string; valor: PerfilUsuario; email: string; senha: string };

const perfisLogin: PerfilLogin[] = [
  { label: "Secretaria", valor: "SECRETARIA", email: "secretaria@clinica.com", senha: "123456" },
  { label: "Medico", valor: "MEDICO", email: "medico@clinica.com", senha: "123456" },
];
const perfilPadrao = perfisLogin[0];

export function Login({ navigation }: Props) {
  const { login } = useAuth();
  const [perfilSelecionado, setPerfilSelecionado] = useState<PerfilUsuario>(perfilPadrao.valor);
  const [email, setEmail] = useState(perfilPadrao.email);
  const [senha, setSenha] = useState(perfilPadrao.senha);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const selecionarPerfil = (perfil: PerfilLogin) => {
    setPerfilSelecionado(perfil.valor);
    setEmail(perfil.email);
    setSenha(perfil.senha);
    setErro("");
  };

  const entrar = async () => {
    setCarregando(true);
    setErro("");
    const ok = await login(email, senha, perfilSelecionado);
    setCarregando(false);
    if (ok) navigation.replace("Home");
    else setErro("Credenciais invalidas");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tit}>Maria Auxiliadora</Text>
        <Text style={styles.subtitulo}>Entre com seu e-mail e senha para continuar.</Text>
        <View style={styles.grupoPerfil} accessibilityRole="radiogroup">
          {perfisLogin.map((perfil) => {
            const selecionado = perfilSelecionado === perfil.valor;
            return (
              <TouchableOpacity
                key={perfil.valor}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected: selecionado, disabled: carregando }}
                disabled={carregando}
                onPress={() => selecionarPerfil(perfil)}
                style={[styles.opcaoPerfil, selecionado && styles.opcaoPerfilSelecionada]}
              >
                <View style={[styles.radio, selecionado && styles.radioSelecionado]}>
                  {selecionado && <View style={styles.radioPonto} />}
                </View>
                <Text style={[styles.opcaoPerfilTexto, selecionado && styles.opcaoPerfilTextoSelecionado]}>
                  {perfil.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <CampoTexto
          label="E-mail"
          valor={email}
          aoAlterar={setEmail}
          teclado="email-address"
          desabilitado={carregando}
        />
        <CampoTexto label="Senha" valor={senha} aoAlterar={setSenha} seguro desabilitado={carregando} />
        <Botao titulo="Entrar" onPress={entrar} carregando={carregando} larguraTotal />
        {!!erro && <Text style={styles.erro}>{erro}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({    
    container: {
        flex: 1,
        backgroundColor: Cores.fundoPrimario,
        justifyContent: "center",
        padding: Espacamento.screen,
    },

    card: {
        backgroundColor: Cores.fundoCartao,
        borderRadius: 12,
        padding: Espacamento.xl,
        gap: Espacamento.sm,
    },

    tit: { 
        ...Tipografia.displayGrande, 
        color: Cores.textoPrimario, 
        marginBottom: Espacamento.xs 
    },

    subtitulo: { 
        ...Tipografia.corpoMedio, 
        color: Cores.textoSecundario, 
        marginBottom: Espacamento.md 
    },

    grupoPerfil: {
        flexDirection: "row",
        gap: Espacamento.sm,
        marginBottom: Espacamento.md,
    },

    opcaoPerfil: {
        flex: 1,
        minHeight: touchMin,
        borderRadius: Raio.md,
        borderWidth: 1,
        borderColor: Cores.borda,
        backgroundColor: Cores.fundoInput,
        paddingHorizontal: Espacamento.md,
        alignItems: "center",
        flexDirection: "row",
        gap: Espacamento.sm,
    },

    opcaoPerfilSelecionada: {
        borderColor: Cores.acento,
        backgroundColor: Cores.acentoSuave,
    },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Cores.textoSecundario,
        alignItems: "center",
        justifyContent: "center",
    },

    radioSelecionado: {
        borderColor: Cores.acentoTexto,
    },

    radioPonto: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Cores.acentoTexto,
    },

    opcaoPerfilTexto: {
        ...Tipografia.subtitulo,
        color: Cores.textoSecundario,
    },

    opcaoPerfilTextoSelecionado: {
        color: Cores.textoPrimario,
    },
    
    erro: { 
       color: Cores.erro, 
        ...Tipografia.corpoMedio 
    },
});
