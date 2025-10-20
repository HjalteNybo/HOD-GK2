import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../Context/Auth';

// Komponent der håndterer personale-login, visning af brugerinfo og logout
export default function Login({ navigation }) {
  const { login, logout, user, isStaff, opLoading, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

// Viser en loading-indikator mens autentificeringsstatus hentes
  if (loading) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Viser brugerinfo og logout-knap hvis brugeren er logget ind
  if (user) {
    return (
      <View style={{ flex:1, padding:16, gap:12, justifyContent:'center' }}>
        <Text style={{ fontSize:18, fontWeight:'700' }}>Du er logget ind</Text>
        <Text>{user.email}</Text>
        <Text>{isStaff ? 'Rolle: Personale (må uploade)' : 'Rolle: Bruger (ingen upload)'}</Text>

        {isStaff && (
          <Pressable
            onPress={() => navigation.navigate('Upload')}
            style={({pressed}) => [
              { backgroundColor:'#F28C38', padding:12, borderRadius:10, alignItems:'center' },
              pressed && { opacity:0.9 }
            ]}
            accessibilityLabel="Upload filer"
          >
            <Text style={{ color:'#fff', fontWeight:'800' }}>Upload filer</Text>
          </Pressable>
        )}

        <Pressable
          onPress={logout}
          style={({pressed}) => [
            { backgroundColor:'#3E6B39', padding:12, borderRadius:10, alignItems:'center' },
            pressed && { opacity:0.9 }
          ]}
        >
          <Text style={{ color:'#fff', fontWeight:'700' }}>
            {opLoading ? 'Logger ud…' : 'Log ud'}
          </Text>
        </Pressable>
      </View>
    );
  }

  // Viser login-formular hvis brugeren ikke er logget ind
  return (
    <View style={{ flex:1, padding:16, gap:12, justifyContent:'center' }}>
      <Text style={{ fontSize:22, fontWeight:'800' }}>Personale login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:'#D9C9A6', borderRadius:10, padding:12, backgroundColor:'#fff' }}
      />

      <TextInput
        placeholder="Adgangskode"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth:1, borderColor:'#D9C9A6', borderRadius:10, padding:12, backgroundColor:'#fff' }}
      />

      {!!error && <Text style={{ color:'#C23B22' }}>{String(error)}</Text>}

      <Pressable
        onPress={() => login(email, password)}
        disabled={opLoading}
        style={({pressed}) => [
          { backgroundColor:'#3E6B39', padding:12, borderRadius:10, alignItems:'center', opacity: opLoading ? 0.7 : 1 },
          pressed && { opacity:0.9 }
        ]}
      >
        {opLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontWeight:'700' }}>Log ind</Text>}
      </Pressable>
    </View>
  );
}