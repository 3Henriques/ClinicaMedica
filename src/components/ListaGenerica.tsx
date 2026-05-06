import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { Cores, Espacamento, Tipografia } from "../styles/Tema";

interface Props<T> {
    dados: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    cabecalho?: React.ReactNode;
    rodape?: React.ReactNode;
    textoVazio?: string;
    iconeVazio?: React.ReactNode;
    carregando?: boolean;
    onRefresh?: () => void;
}
export function ListaGenerica<T>({
    dados,
    renderItem,
    cabecalho,
    rodape,
    textoVazio = "Sem dados",
    iconeVazio,
    carregando,
    onRefresh: onRefresh }: Props<T>) {
    if (carregando) return <View style={styles.center}><ActivityIndicator color={Cores.acento} /></View>;
    return (
        <FlatList
            style={styles.flex}
            data={dados}
            refreshing={false}
            onRefresh={onRefresh}
            keyExtractor={(_, i) => String(i)}
            ItemSeparatorComponent={() => <View style={styles.divisor} />}
            contentContainerStyle={styles.lista}
            ListHeaderComponent={cabecalho as React.ReactElement}
            ListFooterComponent={rodape as React.ReactElement}
            renderItem={({ item, index }) => <>{renderItem(item, index)}</>}
            ListEmptyComponent={
                <View style={styles.center}>
                    {iconeVazio}
                    <Text style={styles.vazio}>{textoVazio}</Text>
                </View>
            }
        />
    );
}
const styles = StyleSheet.create({
    flex: { flex: 1 },
    center: { padding: Espacamento.xl, alignItems: "center" },
    lista: { paddingBottom: Espacamento.md, flexGrow: 1 },
    divisor: { height: Espacamento.sm },
    vazio: { ...Tipografia.corpo, color: Cores.textoSecundario },
});
