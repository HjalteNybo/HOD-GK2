import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import MediaViewer from '../Screens/MediaViewer'; 
import Home from "../Screens/Home";
import Program from "../Screens/Program";
import Galleri from "../Screens/Galleri";
import ActivityDetails from "../Screens/ActivityDetails";
import Login from "../Screens/Login";
import Upload from '../Screens/Uploads';
import MapScreen from '../Screens/MapScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProgramStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgramList" component={Program} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetails} />
    </Stack.Navigator>
  );
}

function GalleryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GalleryGrid" component={Galleri} />
      <Stack.Screen
        name="MediaViewer"
        component={MediaViewer}
        options={{ headerShown: true, title: 'Visning' }} // back-knap auto
      />
    </Stack.Navigator>
  );
}

function PersonaleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StaffLogin" component={Login} />
      <Stack.Screen name="Upload" component={Upload} />
      <Stack.Screen name="MediaViewer" component={MediaViewer}options={{ headerShown: true, headerTransparent: false, headerTintColor: '#fff', headerStyle: { backgroundColor: '#000' } }}/>
    </Stack.Navigator>
  );
}

export default function Navigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        // VALGFRIT: lad Stack styre headers
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ focused, size, color }) => {
          let icon = "home";
          if (route.name === "Home") icon = focused ? "home" : "home-outline";
          if (route.name === "Program") icon = focused ? "list" : "list-outline";
          if (route.name === "Galleri") icon = focused ? "chatbubbles" : "chatbubbles-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3558A6",
        tabBarInactiveTintColor: "#64748B",
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarAccessibilityLabel: "Gå til Hjem" }} />
      <Tab.Screen name="Program" component={ProgramStack} options={{ tabBarAccessibilityLabel: "Gå til Program" }} />
      <Tab.Screen name="Pladsen" component={MapScreen} options={{ tabBarAccessibilityLabel: 'Gå til Pladsen', title: 'Pladsen' }}/>
      <Tab.Screen name="Galleri" component={GalleryStack} options={{ tabBarAccessibilityLabel: "Gå til Galleri" }}/>
      <Tab.Screen name="Personale" component={PersonaleStack} options={{ tabBarAccessibilityLabel: 'Personale login' }} />
    </Tab.Navigator>
  );
}