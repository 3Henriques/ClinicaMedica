// • Listagem de pacientes confirmados.
// • Tela com campos: laudo, receita, histórico.

import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard } from "react-native";
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
import { Espacamento, TemaCores, Tipografia, useTema } from "../../styles/Tema";

type Props = NativeStackScreenProps<RootStackParamList, "RealizarConsulta">;

export function RealizarConsulta({ navigation, route }: Props) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  const { usuario } = useAuth();
  const { buscarConfirmadasHojePorMedico, consultas, realizar } = useConsulta();
  const { buscarPorId } = useCliente();
  const { buscarNome } = useMedico();
  const { buscarPorId: buscarEspecialidadePorId } = useEspecialidade();

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

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.cardPaciente}>
            <Text style={styles.titulo}>Paciente em atendimento</Text>
            <Text style={styles.nome}>{paciente?.nome ?? ""}</Text>
            <Text style={styles.subtitulo}>
              {consultaAtual.horaInicio} - {consultaAtual.horaFim}
            </Text>
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

  const consultasConfirmadas = buscarConfirmadasHojePorMedico(usuario?.medicoId ?? 1);

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
});
