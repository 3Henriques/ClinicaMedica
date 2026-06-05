import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useCliente } from "../../hooks/useCliente";
import { useConsulta } from "../../hooks/useConsulta";
import { useEspecialidade } from "../../hooks/useEspecialidade";
import { useMedico } from "../../hooks/useMedico";
import { useAgenda } from "../../hooks/useAgenda";
import { CampoTexto } from "../../components/CampoTexto";
import { ListaGenerica } from "../../components/ListaGenerica";
import { Combo } from "../../components/Combo";
import { PlanilhaAgenda } from "../../components/PlanilhaAgenda";
import { SelecionarPeriodo } from "../../components/SelecionarPeriodo";
import { Botao } from "../../components/Botao";
import { Espacamento, Raio, Sombra, TemaCores, Tipografia, useTema } from "../../styles/Tema";
import { Agenda } from "../../models/Agenda";
import { TipoConsulta } from "../../models/Consulta";

type Props = NativeStackScreenProps<RootStackParamList, "MarcarConsulta">;

const hoje = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const primeiroDiaMes = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-01`;
};

const ultimoDiaMes = () => {
  const d = new Date();
  const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${ultimo.getFullYear()}-${p(ultimo.getMonth() + 1)}-${p(ultimo.getDate())}`;
};

export function MarcarConsulta({ route, navigation }: Props) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  const [etapa, setEtapa] = useState(1);
  const [busca, setBusca] = useState("");
  const [clienteId, setCliente] = useState<number | null>(null);
  const [medicoId, setMedico] = useState<number | null>(null);
  const [espId, setEsp] = useState<number | null>(null);
  const [tipo, setTipo] = useState<string | number>("NOVA");
  const [ini, setIni] = useState(primeiroDiaMes());
  const [fim, setFim] = useState(ultimoDiaMes());
  const [slot, setSlot] = useState<Agenda | null>(null);
  const [carregando, setCarregando] = useState(false);

  const { buscarPorNome, buscarPorId } = useCliente();
  const { especialidades, buscarPorId: espNome } = useEspecialidade();
  const { buscarPorEspecialidade, buscarPorId: medPorId } = useMedico();
  const medicoIdParam = route.params?.medicoId;
  const especialidadeIdParam = route.params?.especialidadeId;
  const { buscarSlots } = useAgenda();
  const { marcar } = useConsulta();

  useEffect(() => {
    if (medicoIdParam == null && especialidadeIdParam == null) return;
    if (medicoIdParam != null) setMedico(medicoIdParam);
    if (especialidadeIdParam != null) setEsp(especialidadeIdParam);
    else if (medicoIdParam != null) {
      const mm = medPorId(medicoIdParam);
      const primeira = mm?.especialidades[0];
      if (primeira != null) setEsp(primeira);
    }
  }, [medicoIdParam, especialidadeIdParam, medPorId]);

  const clientes = buscarPorNome(busca);
  const medicos = espId ? buscarPorEspecialidade(espId) : [];
  const slots = useMemo(
    () => (medicoId && espId ? buscarSlots(medicoId, espId, ini, fim) : []),
    [medicoId, espId, ini, fim, buscarSlots]
  );

  const titulosEtapa = [
    "Selecione o cliente",
    "Selecione medico e especialidade",
    "Escolha o horario",
    "Revise e confirme",
  ];

  return (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.t}>Etapa {etapa} de 4</Text>
      <Text style={styles.sub}>{titulosEtapa[etapa - 1]}</Text>

      {etapa === 1 && (
        <>
          <CampoTexto label="Buscar cliente" valor={busca} aoAlterar={setBusca} />
          <Botao
            titulo="+ Cadastrar novo cliente"
            variante="primario"
            onPress={() => navigation.navigate("CadastrarCliente", {})}
            larguraTotal
          />
          {clientes.map((c) => (
            <Botao
              key={c.identificador}
              titulo={c.nome}
              variante={clienteId === c.identificador ? "primario" : "secundario"}
              onPress={() => setCliente(c.identificador)}
              larguraTotal
            />
          ))}
          <Botao titulo="Avancar" onPress={() => setEtapa(2)} desabilitado={!clienteId} larguraTotal />
          {clienteId && (
            <Botao
              titulo="Editar dados do cliente selecionado"
              variante="ghost"
              onPress={() => navigation.navigate("CadastrarCliente", { clienteIdParaEditar: clienteId })}
              larguraTotal
            />
          )}
        </>
      )}

      {etapa === 2 && (
        <>
          <Combo
            label="Especialidade"
            itens={especialidades.map((e) => ({ label: e.nome, value: e.codigo }))}
            valor={espId}
            onSelecionar={(v) => setEsp(Number(v))}
          />
          <Combo
            label="Medico"
            itens={medicos.map((m) => ({ label: `Dr(a). ${m.nome}`, value: m.matricula }))}
            valor={medicoId}
            onSelecionar={(v) => setMedico(Number(v))}
            desabilitado={!espId}
          />
          <Combo
            label="Tipo"
            itens={[
              { label: "NOVA", value: "NOVA" },
              { label: "RETORNO", value: "RETORNO" },
            ]}
            valor={tipo}
            onSelecionar={setTipo}
          />
          <View style={styles.r}>
            <Botao titulo="Voltar" variante="ghost" onPress={() => setEtapa(1)} larguraTotal />
            <Botao titulo="Avancar" onPress={() => setEtapa(3)} desabilitado={!medicoId || !espId} larguraTotal />
          </View>
        </>
      )}

      {etapa === 3 && (
        <>
          <SelecionarPeriodo dataInicio={ini} dataFim={fim} aoAlterarInicio={setIni} aoAlterarFim={setFim} />
          <Text style={styles.gridTitulo}>Toque num horario livre para selecionar — o slot escolhido fica em destaque.</Text>
          <PlanilhaAgenda slots={slots} slotSelecionado={slot} aoSelecionarSlot={setSlot} />
          <View style={styles.r}>
            <Botao titulo="Voltar" variante="ghost" onPress={() => setEtapa(2)} larguraTotal />
            <Botao titulo="Avancar para confirmacao" onPress={() => setEtapa(4)} desabilitado={!slot} larguraTotal />
          </View>
        </>
      )}

      {etapa === 4 && (
        <>
          <Text style={styles.resumoTitulo}>Resumo da consulta</Text>
          <Text style={styles.resumoSubtitulo}>Confira os dados antes de confirmar.</Text>
          <View style={styles.resumoCard}>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoLabel}>Cliente</Text>
              <Text style={styles.resumoValor}>{buscarPorId(clienteId ?? 0)?.nome}</Text>
            </View>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoLabel}>Medico</Text>
              <Text style={styles.resumoValor}>Dr(a). {medPorId(medicoId ?? 0)?.nome}</Text>
            </View>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoLabel}>Especialidade</Text>
              <Text style={styles.resumoValor}>{espNome(espId ?? 0)?.nome}</Text>
            </View>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoLabel}>Horario</Text>
              <Text style={styles.resumoValor}>
                {slot?.data} {slot?.horaInicio} - {slot?.horaFim}
              </Text>
            </View>
            <View style={styles.resumoLinha}>
              <Text style={styles.resumoLabel}>Tipo</Text>
              <Text style={styles.resumoValor}>{String(tipo)}</Text>
            </View>
          </View>
          <View style={styles.r}>
            <Botao titulo="Alterar horario" variante="ghost" onPress={() => setEtapa(3)} larguraTotal />
            <Botao
              titulo="Confirmar marcacao"
              tamanho="lg"
              carregando={carregando}
              onPress={async () => {
                if (!clienteId || !medicoId || !espId || !slot) return;
                setCarregando(true);
                await marcar({
                  id: "",
                  clienteId,
                  medicoId,
                  especialidadeId: espId,
                  data: slot.data,
                  horaInicio: slot.horaInicio,
                  horaFim: slot.horaFim,
                  tipo: tipo as TipoConsulta,
                });
                setCarregando(false);
                Alert.alert("Sucesso", "Consulta marcada com sucesso!", [
                  { text: "OK", onPress: () => navigation.navigate("Home") },
                ]);
              }}
              larguraTotal
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const criarStyles = (cores: TemaCores) => StyleSheet.create({

  scroll: {
     flex: 1,
      backgroundColor: cores.fundoPrimario
    },

  scrollContent: {
     padding: Espacamento.screen,
      paddingBottom: Espacamento.xxxl,
       gap: Espacamento.md
    },

  t: {
     ...Tipografia.titulo,
      color: cores.textoPrimario
    },

  sub: {
     ...Tipografia.corpoMedio,
      color: cores.textoSecundario,
       marginBottom: Espacamento.sm
    },

  gridTitulo: {
     ...Tipografia.legenda,
      color: cores.acentoTexto
    },

  resumoTitulo: {
     ...Tipografia.display,
      color: cores.textoPrimario
    },

  resumoSubtitulo: {
     ...Tipografia.corpoMedio,
      color: cores.textoSecundario
    },

  resumoCard: {
    backgroundColor: cores.fundoCartaoElevado,
    padding: Espacamento.xl,
    borderRadius: Raio.lg,
    borderWidth: 2,
    borderColor: cores.acento,
    gap: Espacamento.lg,
    ...Sombra.cartao,
  },

  resumoLinha: {
     gap: Espacamento.xs
    },

  resumoLabel: {
     ...Tipografia.legenda,
      color: cores.textoSecundario
    },

  resumoValor: {
     ...Tipografia.subtitulo,
      color: cores.textoPrimario
    },

  r: {
     gap: Espacamento.sm,
      marginTop: Espacamento.md
    },

});
