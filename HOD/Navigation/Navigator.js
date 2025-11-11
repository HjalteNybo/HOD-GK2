import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import MediaViewer from '../Screens/MediaViewer';
import Home from "../Screens/Home";
import Program from "../Screens/Program";
import Galleri from "../Screens/Galleri";
import ActivityDetails from "../Screens/ActivityDetails";
import Login from "../Screens/Login";
import Upload from '../Screens/Uploads';
import ClassicMap from '../Screens/ClassicMap';
import ProgramChanges from '../Screens/ProgramChanges';


// Opretter navigator-instanser
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack til Program-fanen (liste -> detaljer)
function ProgramStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgramList" component={Program} />
      <Stack.Screen name="ActivityDetails" component={ActivityDetails} />
    </Stack.Navigator>
  );
}

// Stack til Galleri-fanen (grid -> fuld visning)
function GalleryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GalleryGrid" component={Galleri} />
      <Stack.Screen
        name="MediaViewer"
        component={MediaViewer}
        options={{ headerShown: true, title: 'Visning' }}
      />
    </Stack.Navigator>
  );
}
// Stack til Personale (login -> upload)
function PersonaleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Ingen header på Personale (login) */}
      <Stack.Screen
        name="StaffLogin"
        component={Login}
        options={{ headerShown: false }}
      />

      {/* Upload: header med tilbage-knap */}
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Upload filer",
          headerStyle: { backgroundColor: "#3E6B39" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
          headerLeft: () => <BackToPersonale navigation={navigation} />,
          headerLeftContainerStyle: { paddingLeft: 8 },
        })}
      />

      {/* Programændringer: header med tilbage-knap */}
      <Stack.Screen
        name="ProgramChanges"
        component={ProgramChanges}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Ændringer i program",
          headerStyle: { backgroundColor: "#3E6B39" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
          headerLeft: () => <BackToPersonale navigation={navigation} />,
          headerLeftContainerStyle: { paddingLeft: 8 },
        })}
      />

      {/* (valgfrit) MediaViewer med sort header */}
      <Stack.Screen
        name="MediaViewer"
        component={MediaViewer}
        options={{
          headerShown: true,
          title: "Visning",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerTitleStyle: { color: "#fff" },
        }}
      />
    </Stack.Navigator>
  );
}

function BackToPersonale({ navigation }) {
  const goBackToStaff = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("StaffLogin"); // ⬅️ var "Login"
  };
  return (
    <Pressable onPress={goBackToStaff} style={{ flexDirection:"row", alignItems:"center" }} hitSlop={8}>
      <Ionicons name="chevron-back" size={22} color="#fff" />
      <Text style={{ color:"#fff", fontWeight:"600" }}>Tilbage</Text>
    </Pressable>
  );
}

// Hovednavigator med bundfaner
export default function Navigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ focused, size, color }) => {
          let icon = "home";
          if (route.name === "Home") icon = focused ? "home" : "home-outline";
          if (route.name === "Program") icon = focused ? "list" : "list-outline";
          if (route.name === "Galleri") icon = focused ? "chatbubbles" : "chatbubbles-outline";
          // NYE/OPDATERDE
          if (route.name === "Plads") icon = focused ? "map" : "map-outline";
          if (route.name === "Personale") icon = focused ? "lock-closed" : "lock-closed-outline";
          return <Ionicons name={icon} size={size} color={color} />;
        },

        tabBarActiveTintColor: "#3558A6",
        tabBarInactiveTintColor: "#64748B",
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarAccessibilityLabel: "Gå til Hjem" }} />
      <Tab.Screen name="Program" component={ProgramStack} options={{ tabBarAccessibilityLabel: "Gå til Program" }} />
      <Tab.Screen name="Plads" component={ClassicMap} options={{ tabBarAccessibilityLabel: "Gå til Plads (klassisk)", title: "Plads" }} /> 
      <Tab.Screen name="Galleri" component={GalleryStack} options={{ tabBarAccessibilityLabel: "Gå til Galleri" }} />
      <Tab.Screen name="Personale" component={PersonaleStack} options={{ tabBarAccessibilityLabel: 'Personale login' }} />
    </Tab.Navigator>
  );
}