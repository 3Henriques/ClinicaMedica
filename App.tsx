import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/hooks/useAuth";
import { Cores } from "./src/styles/Tema";

export default function App() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <GestureHandlerRootView style={{ flex: 1 }}>      
        <AuthProvider>
          <StatusBar style="light" backgroundColor={Cores.fundoPrimario} />
          <AppNavigator />
        </AuthProvider>      
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
}
