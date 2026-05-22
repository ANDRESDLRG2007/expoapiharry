import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigation = useNavigation();

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;
      // ✅ Guarda casa y favoritos desde el inicio (requerido por la actividad)
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        casa: null,
        favoritos: [],
      });
      Alert.alert('¡Bienvenido a Hogwarts!', 'El Sombrero te está esperando.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>📜</Text>
      <Text style={styles.titulo}>Nuevo Estudiante</Text>
      <Text style={styles.subtitulo}>Carta de admisión a Hogwarts</Text>

      {[
        { placeholder: 'Nombre completo', value: nombre, set: setNombre },
        { placeholder: 'Correo electrónico', value: correo, set: setCorreo, auto: 'none', tipo: 'email-address' },
        { placeholder: 'Contraseña', value: contrasena, set: setContrasena, secure: true },
        { placeholder: 'Fecha de nacimiento (YYYY-MM-DD)', value: fecha, set: setFecha },
        { placeholder: 'Teléfono', value: telefono, set: setTelefono, tipo: 'phone-pad' },
      ].map((campo, i) => (
        <TextInput
          key={i}
          placeholder={campo.placeholder}
          placeholderTextColor="#888"
          value={campo.value}
          onChangeText={campo.set}
          style={styles.input}
          autoCapitalize={campo.auto || 'words'}
          keyboardType={campo.tipo || 'default'}
          secureTextEntry={campo.secure || false}
        />
      ))}

      <TouchableOpacity style={styles.boton} onPress={handleRegistro}>
        <Text style={styles.botonTexto}>✨ Solicitar admisión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botonSec} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.botonSecTexto}>¿Ya eres estudiante? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0d0d0d', alignItems: 'center',
    padding: 24, paddingTop: 60 },
  logo: { fontSize: 52, marginBottom: 8 },
  titulo: { fontSize: 28, color: '#c9a84c', fontWeight: 'bold', letterSpacing: 2 },
  subtitulo: { fontSize: 13, color: '#888', marginBottom: 28 },
  input: { width: '100%', borderWidth: 1, borderColor: '#c9a84c', padding: 13,
    marginBottom: 12, borderRadius: 8, color: '#fff', backgroundColor: '#1a1a1a' },
  boton: { width: '100%', backgroundColor: '#740001', padding: 15, borderRadius: 8,
    alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#c9a84c' },
  botonTexto: { color: '#c9a84c', fontSize: 16, fontWeight: 'bold' },
  botonSec: { padding: 12 },
  botonSecTexto: { color: '#888', fontSize: 13 },
});