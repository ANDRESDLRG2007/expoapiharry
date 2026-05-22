import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Home from './componentes/Home';
import Original from './componentes/Original';
import Perfil from './componentes/Perfil';
import Logout from './componentes/Logout';

const Tab = createBottomTabNavigator();

// Colores y emojis por casa
const CASA_TEMAS = {
  Gryffindor: { color: '#740001', icono: '🦁' },
  Hufflepuff: { color: '#ecb939', icono: '🦡' },
  Ravenclaw: { color: '#0e1a40', icono: '🦅' },
  Slytherin: { color: '#1a472a', icono: '🐍' },
};

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [casa, setCasa] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);
      if (user) {
        const snap = await getDoc(doc(db, 'usuarios', user.uid));
        if (snap.exists()) setCasa(snap.data().casa || null);
      }
      setCargando(false);
    });
    return unsub;
  }, []);

  if (cargando) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',
      backgroundColor: '#0d0d0d' }}>
      <ActivityIndicator size="large" color="#c9a84c" />
    </View>
  );

  const tema = casa ? CASA_TEMAS[casa] : null;
  const tabBarColor = tema ? tema.color : '#1a1a2e';
  const icoSombrero = casa ? tema.icono : '🎩';

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: tabBarColor, borderTopColor: '#c9a84c',
          borderTopWidth: 1.5 },
        tabBarActiveTintColor: '#c9a84c',
        tabBarInactiveTintColor: '#aaaaaa',
      }}>
        {usuario ? (
          <>
            <Tab.Screen name="Inicio" component={Home}
              options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📜</Text>,
                tabBarLabel: 'Personajes' }} />
            <Tab.Screen name="Test" component={Original}
              options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>{icoSombrero}</Text>,
                tabBarLabel: casa || 'Sombrero' }} />
            <Tab.Screen name="Perfil" component={Perfil}
              options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚡</Text>,
                tabBarLabel: 'Perfil' }} />
            <Tab.Screen name="Salir" component={Logout}
              options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🚪</Text>,
                tabBarLabel: 'Salir' }} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login}
              options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔑</Text> }} />
            <Tab.Screen name="Registro" component={Registro}
              options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📝</Text> }} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
