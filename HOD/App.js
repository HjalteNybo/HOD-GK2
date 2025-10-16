import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigation/Navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./Context/Auth";
import { enableNetwork } from "firebase/firestore";
import { db } from "./Firebase/FirebaseApp";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function App() {
  useEffect(() => {
    enableNetwork(db).catch(() => {}); // ignorer hvis allerede enabled
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}