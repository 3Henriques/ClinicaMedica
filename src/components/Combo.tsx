import React, { useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Cores, Espacamento, Raio, Tipografia } from "../styles/Tema";

type Item = { label: string; value: string | number };
interface Props { label: string; itens: Item[]; valor: string | number | null; onSelecionar: (value: string | number) => void; placeholder?: string; desabilitado?: boolean; erro?: string; }

export function Combo({ label, itens, valor, onSelecionar, placeholder="Selecione...", desabilitado, erro }: Props) {
  const [aberto, setAberto] = useState(false);
  const selecionado = useMemo(() => itens.find((i) => i.value === valor)?.label ?? placeholder, [itens, valor, placeholder]);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity activeOpacity={0.75} disabled={desabilitado} onPress={() => setAberto(true)} style={[styles.input, desabilitado && styles.disabled, !!erro && styles.erroBorda]}>
        <Text style={[styles.valor, valor===null && styles.placeholder]}>{selecionado}</Text>
      </TouchableOpacity>
      {!!erro && <Text style={styles.erro}>{erro}</Text>}
      <Modal visible={aberto} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <FlatList data={itens} keyExtractor={(item) => String(item.value)} renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.75} style={styles.item} onPress={() => { onSelecionar(item.value); setAberto(false); }}>
                <Text style={styles.itemTxt}>{item.label}</Text><Text style={styles.itemTxt}>{item.value===valor ? "✓" : ""}</Text>
              </TouchableOpacity>
            )} />
            <TouchableOpacity activeOpacity={0.75} onPress={() => setAberto(false)} style={styles.close}><Text style={styles.itemTxt}>Fechar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{ marginBottom:Espacamento.fieldGap },
  label:{ ...Tipografia.legenda, color:Cores.textoSecundario, marginBottom:Espacamento.xs },
  input:{ backgroundColor:Cores.fundoInput, borderColor:Cores.borda, borderWidth:1, borderRadius:Raio.md, minHeight:48, justifyContent:"center", paddingHorizontal:Espacamento.md },
  valor:{ color:Cores.textoPrimario, ...Tipografia.corpo },
  placeholder:{ color:Cores.textoPlaceholder },
  erro:{ color:Cores.erro, ...Tipografia.legenda, marginTop:Espacamento.xs },
  erroBorda:{ borderColor:Cores.erro },
  disabled:{ opacity:0.6 },
  modalBg:{ flex:1, backgroundColor:"rgba(0,0,0,0.45)", justifyContent:"flex-end" },
  modal:{ backgroundColor:Cores.fundoModal, maxHeight:"60%", padding:Espacamento.md, borderTopLeftRadius:Raio.lg, borderTopRightRadius:Raio.lg },
  item:{ paddingVertical:Espacamento.md, flexDirection:"row", justifyContent:"space-between", borderBottomWidth:1, borderBottomColor:Cores.divisor },
  itemTxt:{ color:Cores.textoPrimario, ...Tipografia.corpo },
  close:{ marginTop:Espacamento.md, alignItems:"center" }
});