import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚡</Text>
      <Text style={styles.titulo}>Hogwarts</Text>
      <Text style={styles.subtitulo}>Acceso al castillo</Text>

      <TextInput
        placeholder="Correo de mago"
        placeholderTextColor="#888"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña secreta"
        placeholderTextColor="#888"
        value={contrasena}
        onChangeText={setContrasena}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin}>
        <Text style={styles.botonTexto}>🔮 Entrar al castillo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario}
        onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.botonSecTexto}>¿Nuevo estudiante? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center',
    alignItems: 'center', padding: 24 },
  logo: { fontSize: 64, marginBottom: 8 },
  titulo: { fontSize: 36, color: '#c9a84c', fontWeight: 'bold',
    letterSpacing: 3, marginBottom: 4 },
  subtitulo: { fontSize: 14, color: '#888', marginBottom: 32, letterSpacing: 1 },
  input: { width: '100%', borderWidth: 1, borderColor: '#c9a84c', padding: 14,
    marginBottom: 14, borderRadius: 8, color: '#fff', backgroundColor: '#1a1a1a',
    fontSize: 15 },
  boton: { width: '100%', backgroundColor: '#740001', padding: 16, borderRadius: 8,
    alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#c9a84c' },
  botonTexto: { color: '#c9a84c', fontSize: 16, fontWeight: 'bold' },
  botonSecundario: { padding: 10 },
  botonSecTexto: { color: '#888', fontSize: 13 },
});