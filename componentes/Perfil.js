import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [casa, setCasa] = useState('');
  const [cargando, setCargando] = useState(true);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (snap.exists()) {
        const data = snap.data();
        setNombre(data.nombre || '');
        setFecha(data.fecha || '');
        setTelefono(data.telefono || '');
        setCasa(data.casa || 'Sin asignar');
      }
      setCargando(false);
    };
    traerDatos();
  }, [uid]);

  const actualizar = async () => {
    try {
      await updateDoc(doc(db, 'usuarios', uid), { nombre, fecha, telefono });
      Alert.alert('Datos actualizados');
    } catch (e) {
      Alert.alert('Error al actualizar');
    }
  };

  if (cargando) return <Text style={styles.cargando}>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mi Perfil</Text>
      <Text style={styles.casa}>🏰 Casa: {casa}</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Fecha de nacimiento" value={fecha} onChangeText={setFecha} />
      <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
      <Button title="Guardar cambios" onPress={actualizar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  casa: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 10 },
  cargando: { marginTop: 50, textAlign: 'center' },
});