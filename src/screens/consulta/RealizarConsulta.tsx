import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useConsulta } from "../../hooks/useConsulta";
import { useCliente } from "../../hooks/useCliente";
import { useMedico } from "../../hooks/useMedico";
import { useEspecialidade } from "../../hooks/useEspecialidade";
import { useAuth } from "../../hooks/useAuth";
import { ListaGenerica } from "../../components/ListaGenerica";
import { CardConsulta } from "../../components/CardConsulta";
import { CampoTexto } from "../../components/CampoTexto";
import { Botao } from "../../components/Botao";
import { Espacamento, Raio, TemaCores, Tipografia, useTema } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "RealizarConsulta">;

export function RealizarConsulta({ navigation, route }: Props) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  const { usuario } = useAuth();
  const { buscarConfirmadasHojePorMedico, buscarHistoricoPaciente, consultas, realizar } = useConsulta();
  const { buscarPorId } = useCliente();
  const { buscarNome } = useMedico();
  const { buscarPorId: buscarEspecialidadePorId } = useEspecialidade();

  // Restrição de perfil: secretária não pode realizar consultas
  if (usuario?.perfil === "SECRETARIA") {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={[styles.titulo, { textAlign: "center" }]}>Acesso Restrito</Text>
        <Text style={[styles.subtitulo, { textAlign: "center", marginTop: Espacamento.sm }]}>
          Apenas médicos podem realizar consultas.
        </Text>
      </View>
    );
  }

  const numeroConsulta = route.params?.consultaNumero;
  const consultaAtual = useMemo(
    () => consultas.find((consulta) => consulta.numero === numeroConsulta),
    [consultas, numeroConsulta]
  );

  const [laudo, setLaudo] = useState("");
  const [receita, setReceita] = useState("");

  const finalizarConsulta = async () => {
    if (!numeroConsulta) return;
    await realizar(numeroConsulta, laudo, receita);
    navigation.goBack();
  };

  if (numeroConsulta && consultaAtual) {
    const paciente = buscarPorId(consultaAtual.clienteId);
    const historico = buscarHistoricoPaciente(consultaAtual.clienteId).filter(
      (c) => c.numero !== numeroConsulta
    );

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.cardPaciente}>
            <Text style={styles.titulo}>Paciente em atendimento</Text>
            <Text style={styles.nome}>{paciente?.nome ?? ""}</Text>
            <Text style={styles.subtitulo}>
              {paciente?.telefone ? `Tel: ${paciente.telefone}  ·  ` : ""}
              {consultaAtual.horaInicio} – {consultaAtual.horaFim}
            </Text>
            {historico.length > 0 && (
              <View style={styles.historicoBox}>
                <Text style={styles.historicoTitulo}>Histórico ({historico.length} consulta{historico.length > 1 ? "s" : ""})</Text>
                {historico.slice(0, 3).map((c) => (
                  <Text key={c.numero} style={styles.historicoItem}>
                    {c.data} — {c.laudo ?? "sem laudo"}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <CampoTexto label="Laudo" valor={laudo} aoAlterar={setLaudo} multiline altura={140} />
          <CampoTexto label="Receita" valor={receita} aoAlterar={setReceita} multiline altura={120} />

          <Botao
            titulo="Finalizar Consulta"
            onPress={finalizarConsulta}
            desabilitado={!laudo.trim()}
            larguraTotal
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const consultasConfirmadas = buscarConfirmadasHojePorMedico(usuario?.medicoId ?? 1)
    .slice()
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Consultas Confirmadas</Text>

      <ListaGenerica
        dados={consultasConfirmadas}
        textoVazio="Nenhum paciente confirmado"
        renderItem={(consulta) => (
          <CardConsulta
            consulta={consulta}
            nomeCliente={buscarPorId(consulta.clienteId)?.nome ?? ""}
            nomeMedico={buscarNome(consulta.medicoId)}
            nomeEspecialidade={buscarEspecialidadePorId(consulta.especialidadeId)?.nome ?? ""}
            acaoLabel="Iniciar Consulta"
            onPress={() => navigation.navigate("RealizarConsulta", { consultaNumero: consulta.numero })}
          />
        )}
      />
    </View>
  );
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundoPrimario,
    padding: Espacamento.screen,
    gap: Espacamento.md,
  },

  titulo: {
    ...Tipografia.titulo,
    color: cores.textoPrimario,
  },

  nome: {
    ...Tipografia.subtitulo,
    color: cores.textoPrimario,
  },

  subtitulo: {
    ...Tipografia.corpoMedio,
    color: cores.textoSecundario,
  },

  cardPaciente: {
    backgroundColor: cores.fundoCartao,
    padding: Espacamento.lg,
    borderRadius: 12,
    gap: Espacamento.xs,
  },

  historicoBox: {
    marginTop: Espacamento.sm,
    backgroundColor: cores.fundoSecundario,
    borderRadius: Raio.md,
    padding: Espacamento.sm,
    gap: Espacamento.xs,
  },

  historicoTitulo: {
    ...Tipografia.legenda,
    color: cores.acentoTexto,
    marginBottom: Espacamento.xs,
  },

  historicoItem: {
    ...Tipografia.legenda,
    color: cores.textoSecundario,
  },
});
