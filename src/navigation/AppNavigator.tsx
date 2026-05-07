import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "../screens/login/Login";
import { Home } from "../screens/home/Home";
import { ListarClientes } from "../screens/cliente/ListarClientes";
import { CadastrarCliente } from "../screens/cliente/CadastrarCliente";
import { MarcarConsulta } from "../screens/consulta/MarcarConsulta";
import { ConfirmarConsulta } from "../screens/consulta/ConfirmarConsulta";
import { RealizarConsulta } from "../screens/consulta/RealizarConsulta";
import { EncerrarConsulta } from "../screens/consulta/EncerrarConsulta";
import { CancelarConsulta } from "../screens/consulta/CancelarConsulta";
import { ListarMedicos } from "../screens/medico/ListarMedicos";
import { PerfilMedico } from "../screens/medico/PerfilMedico";
import { Cores, Tipografia } from "../styles/Tema";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ListarClientes: undefined;
  CadastrarCliente: { clienteIdParaEditar?: number } | undefined;
  MarcarConsulta: { medicoId?: number; especialidadeId?: number } | undefined;
  ConfirmarConsulta: undefined;
  RealizarConsulta: { consultaNumero?: number } | undefined;
  EncerrarConsulta: { consultaNumero?: number } | undefined;
  CancelarConsulta: undefined;
  ListarMedicos: undefined;
  PerfilMedico: { medicoId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Cores.fundoSecundario },
          headerTitleStyle: { ...Tipografia.subtitulo },
          headerTintColor: Cores.textoPrimario,
          contentStyle: { backgroundColor: Cores.fundoPrimario },
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="ListarClientes" component={ListarClientes} options={{ title: "Clientes" }} />
        <Stack.Screen name="CadastrarCliente" component={CadastrarCliente} options={{ title: "Cliente" }} />
        <Stack.Screen name="MarcarConsulta" component={MarcarConsulta} options={{ title: "Marcar Consulta" }} />
        <Stack.Screen name="ConfirmarConsulta" component={ConfirmarConsulta} options={{ title: "Confirmar Consulta" }} />
        <Stack.Screen name="RealizarConsulta" component={RealizarConsulta} options={{ title: "Realizar Consulta" }} />
        <Stack.Screen name="EncerrarConsulta" component={EncerrarConsulta} options={{ title: "Encerrar Consulta" }} />
        <Stack.Screen name="CancelarConsulta" component={CancelarConsulta} options={{ title: "Cancelar Consulta" }} />
        <Stack.Screen name="ListarMedicos" component={ListarMedicos} options={{ title: "Medicos" }} />
        <Stack.Screen name="PerfilMedico" component={PerfilMedico} options={{ title: "Perfil" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
