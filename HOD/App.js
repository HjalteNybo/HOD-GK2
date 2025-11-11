import { LogBox, Platform } from "react-native";
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigation/Navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./Context/Auth";
import { enableNetwork } from "firebase/firestore";
import { db } from "./Firebase/FirebaseApp";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
// Skjul Expo Go-advarslen om remote push på Android
if (Platform.OS === "android") {
  LogBox.ignoreLogs([
    /expo[- ]notifications: Android Push notifications.*removed from Expo Go/i,
  ]);
}
//  notifikation handler i modul-scope
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // vis banner i forgrunden
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const navRef = useRef(null);

  useEffect(() => {
    enableNetwork(db).catch(() => {});
  }, []);

  // response-listener til notifikationer: åbner Program når man trykker på notifikationen
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const data = resp?.notification?.request?.content?.data;
      if (data?.type === "program_updated") {
        navRef.current?.navigate("Program");
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer ref={navRef}>
            <Navigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
