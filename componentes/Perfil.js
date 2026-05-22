import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const TEMAS = {
  Gryffindor: { color: '#740001', emoji: '🦁' },
  Hufflepuff:  { color: '#ecb939', emoji: '🦡' },
  Ravenclaw:   { color: '#0e1a40', emoji: '🦅' },
  Slytherin:   { color: '#1a472a', emoji: '🐍' },
};

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [casa, setCasa] = useState('');
  const [cargando, setCargando] = useState(true);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'usuarios', uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setNombre(d.nombre || '');
        setFecha(d.fecha || '');
        setTelefono(d.telefono || '');
        setCasa(d.casa || '');
      }
      setCargando(false);
    });
  }, [uid]);

  const actualizar = async () => {
    try {
      await updateDoc(doc(db, 'usuarios', uid), { nombre, fecha, telefono });
      Alert.alert('✨ Datos actualizados');
    } catch (e) { Alert.alert('Error al actualizar'); }
  };

  if (cargando) return (
    <View style={{ flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#c9a84c' }}>Cargando tu expediente...</Text>
    </View>
  );

  const tema = TEMAS[casa];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>⚡ Mi Perfil</Text>

      {casa ? (
        <View style={[styles.casaCard, { backgroundColor: tema.color }]}>
          <Text style={styles.casaEmoji}>{tema.emoji}</Text>
          <Text style={styles.casaNombre}>{casa}</Text>
        </View>
      ) : (
        <View style={styles.casaCardVacia}>
          <Text style={{ fontSize: 32 }}>🎩</Text>
          <Text style={{ color: '#888', marginTop: 8 }}>Casa sin asignar — ve al Sombrero</Text>
        </View>
      )}

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre}
        placeholderTextColor="#888" placeholder="Tu nombre" />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <TextInput style={styles.input} value={fecha} onChangeText={setFecha}
        placeholderTextColor="#888" placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} value={telefono} onChangeText={setTelefono}
        placeholderTextColor="#888" placeholder="Tu teléfono" keyboardType="phone-pad" />

      <TouchableOpacity style={styles.boton} onPress={actualizar}>
        <Text style={styles.botonTexto}>💾 Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 20 },
  titulo: { fontSize: 24, color: '#c9a84c', fontWeight: 'bold',
    textAlign: 'center', marginBottom: 20, marginTop: 10, letterSpacing: 2 },
  casaCard: { borderRadius: 12, padding: 20, alignItems: 'center',
    marginBottom: 24, borderWidth: 1, borderColor: '#c9a84c' },
  casaCardVacia: { borderRadius: 12, padding: 20, alignItems: 'center',
    marginBottom: 24, borderWidth: 1, borderColor: '#333', backgroundColor: '#1a1a1a' },
  casaEmoji: { fontSize: 48 },
  casaNombre: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  label: { color: '#c9a84c', fontSize: 12, marginBottom: 4, letterSpacing: 1 },
  input: { borderWidth: 1, borderColor: '#444', padding: 13, marginBottom: 16,
    borderRadius: 8, color: '#fff', backgroundColor: '#1a1a1a' },
  boton: { backgroundColor: '#740001', padding: 16, borderRadius: 8,
    alignItems: 'center', borderWidth: 1, borderColor: '#c9a84c', marginTop: 8 },
  botonTexto: { color: '#c9a84c', fontSize: 16, fontWeight: 'bold' },
});