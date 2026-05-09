import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/hooks/useAuth";
import { TemaProvider, useTema } from "./src/styles/Tema";

function AppContent() {
  const { cores, modo } = useTema();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <GestureHandlerRootView style={{ flex: 1 }}>      
        <AuthProvider>
          <StatusBar style={modo === "escuro" ? "light" : "dark"} backgroundColor={cores.fundoPrimario} />
          <AppNavigator />
        </AuthProvider>      
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <AppContent />
    </TemaProvider>
  );
}
