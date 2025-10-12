import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Ionicons} from "@expo/vector-icons";

import Home from "../Screens/Home";
import Program from "../Screens/Program";
import EventDetails from "../Screens/EventDetails";
import Forum from "../Screens/Forum";

//de to typer navigationssystemer
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Program-stack: Liste -> Detalje
function ProgramStack() {
    return (
        <Stack.Navigator>
      <Stack.Screen name="ProgramList" component={Program} options={{ title: 'Program' }} />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: 'Aktivitet' }} />
    </Stack.Navigator>
    );
};

// Hovednavigatoren med bundfaner
export default function Navigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ focused, size, color }) => {
          let icon = 'home';
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          if (route.name === 'Program') icon = focused ? 'list' : 'list-outline';
          if (route.name === 'Forum') icon = focused ? 'chatbubbles' : 'chatbubbles-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3558A6',
        tabBarInactiveTintColor: '#64748B',
      })}
      sceneContainerStyle={{ backgroundColor: '#FFFFFF' }}
    >
         {/* Faner i bundnavigationen */}
      <Tab.Screen name="Home" component={Home} options={{ tabBarAccessibilityLabel: 'Gå til Hjem' }} />
      <Tab.Screen name="Program" component={ProgramStack} options={{ tabBarAccessibilityLabel: 'Gå til Program' }} />
      <Tab.Screen name="Forum" component={Forum} options={{ tabBarAccessibilityLabel: 'Gå til Forum' }} />
    </Tab.Navigator>
  );
};