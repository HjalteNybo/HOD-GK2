import React, { useEffect } from "react";            // ← importér useEffect
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigation/Navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./Context/Auth";
import { enableNetwork } from "firebase/firestore";
import { db } from "./Firebase/FirebaseApp";
import { GestureHandlerRootView } from "react-native-gesture-handler";


// Hovedapplikationskomponenten
export default function App() {
  // kør kun én gang ved app-start
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