import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/hooks/useAuth";
import { TemaProvider, useTema } from "./src/styles/Tema";

function AppContent() {
  const { cores, modo } = useTema();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar
            style={modo === "escuro" ? "light" : "dark"}
            backgroundColor={cores.fundoPrimario}
          />
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <AppContent />
    </TemaProvider>
  );
}
