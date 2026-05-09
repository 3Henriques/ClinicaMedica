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
import { Cores, Espacamento, Raio, Sombra, Tipografia } from "../../styles/Tema";
import { Agenda } from "../../models/Agenda";
import { TipoConsulta } from "../../models/Consulta";

type Props = NativeStackScreenProps<RootStackParamList, "MarcarConsulta">;

const hoje = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export function MarcarConsulta({ route }: Props) {
  const [etapa, setEtapa] = useState(1);
  const [busca, setBusca] = useState("");
  const [clienteId, setCliente] = useState<number | null>(null);
  const [medicoId, setMedico] = useState<number | null>(null);
  const [espId, setEsp] = useState<number | null>(null);
  const [tipo, setTipo] = useState<string | number>("NOVA");
  const [ini, setIni] = useState(hoje());
  const [fim, setFim] = useState(hoje());
  const [slot, setSlot] = useState<Agenda | null>(null);
  const [carregando, setCarregando] = useState(false);

  const { buscarPorNome, buscarPorId } = useCliente();
  const { especialidades, buscarPorId: espNome } = useEspecialidade();
  const { buscarPorEspecialidade, buscarPorId: medPorId } = useMedico();
  const medicoIdParam = route.params?.medicoId;
  const especialidadeIdParam = route.params?.especialidadeId;
  const { buscarSlots, atualizarStatus } = useAgenda();
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
          <ListaGenerica
            dados={clientes}
            renderItem={(c) => (
              <Botao
                titulo={c.nome}
                variante={clienteId === c.identificador ? "primario" : "secundario"}
                onPress={() => setCliente(c.identificador)}
                larguraTotal
              />
            )}
          />
          <Botao titulo="Avancar" onPress={() => setEtapa(2)} desabilitado={!clienteId} larguraTotal />
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
                  clienteId,
                  medicoId,
                  especialidadeId: espId,
                  data: slot.data,
                  horaInicio: slot.horaInicio,
                  horaFim: slot.horaFim,
                  tipo: tipo as TipoConsulta,
                });
                atualizarStatus(slot.id, "M");
                setCarregando(false);
                Alert.alert("Sucesso", "Consulta marcada");
              }}
              larguraTotal
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  scroll: {
     flex: 1,
      backgroundColor: Cores.fundoPrimario 
    },

  scrollContent: {
     padding: Espacamento.screen,
      paddingBottom: Espacamento.xxxl,
       gap: Espacamento.md 
    },

  t: {
     ...Tipografia.titulo,
      color: Cores.textoPrimario 
    },

  sub: {
     ...Tipografia.corpoMedio,
      color: Cores.textoSecundario,
       marginBottom: Espacamento.sm 
    },

  gridTitulo: {
     ...Tipografia.legenda,
      color: Cores.acentoTexto 
    },

  resumoTitulo: {
     ...Tipografia.display,
      color: Cores.textoPrimario 
    },

  resumoSubtitulo: {
     ...Tipografia.corpoMedio,
      color: Cores.textoSecundario
    },

  resumoCard: {
    backgroundColor: Cores.fundoCartaoElevado,
    padding: Espacamento.xl,
    borderRadius: Raio.lg,
    borderWidth: 2,
    borderColor: Cores.acento,
    gap: Espacamento.lg,
    ...Sombra.cartao,
  },

  resumoLinha: {
     gap: Espacamento.xs 
    },
    
  resumoLabel: {
     ...Tipografia.legenda,
      color: Cores.textoSecundario 
    },

  resumoValor: {
     ...Tipografia.subtitulo,
      color: Cores.textoPrimario 
    },

  r: {
     gap: Espacamento.sm,
      marginTop: Espacamento.md 
    },
    
});
