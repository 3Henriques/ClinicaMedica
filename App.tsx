import React from "react";
import { Keyboard, ScrollView, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/hooks/useAuth";
import { TemaProvider, useTema } from "./src/styles/Tema";

function AppContent() {
  const { cores, modo } = useTema();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <AppContent />
    </TemaProvider>
  );
}
