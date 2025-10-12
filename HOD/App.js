import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigation/Navigator";

// Hovedapplikationskomponenten
export default function App() {
    return (
        <NavigationContainer>
            <Navigator />
        </NavigationContainer>
    );
};
