import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

export default function Home() {
  const [personajes, setPersonajes] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetch('https://hp-api.onrender.com/api/characters')
      .then(r => r.json())
      .then(data => {
        setPersonajes(data);
        setCargando(false);
      });

    if (uid) {
      getDoc(doc(db, 'usuarios', uid)).then(snap => {
        if (snap.exists()) setFavoritos(snap.data().favoritos || []);
      });
    }
  }, []);

  const toggleFavorito = async (id) => {
    const esFav = favoritos.includes(id);
    const ref = doc(db, 'usuarios', uid);
    if (esFav) {
      await updateDoc(ref, { favoritos: arrayRemove(id) });
      setFavoritos(prev => prev.filter(f => f !== id));
    } else {
      await updateDoc(ref, { favoritos: arrayUnion(id) });
      setFavoritos(prev => [...prev, id]);
    }
  };

  if (cargando) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Personajes de Harry Potter</Text>
      {personajes.map((p) => (
        <View key={p.id} style={styles.card}>
          {p.image ? <Image source={{ uri: p.image }} style={styles.img} /> : 
            <View style={styles.imgVacio}><Text>🧙</Text></View>}
          <View style={{ flex: 1 }}>
            <Text style={styles.nombre}>{p.name}</Text>
            <Text style={styles.dato}>Casa: {p.house || 'Desconocida'}</Text>
            <Text style={styles.dato}>Actor: {p.actor || '-'}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavorito(p.id)}>
            <Text style={{ fontSize: 24 }}>{favoritos.includes(p.id) ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', margin: 16 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  img: { width: 60, height: 80, borderRadius: 8, marginRight: 12 },
  imgVacio: { width: 60, height: 80, borderRadius: 8, marginRight: 12, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  nombre: { fontSize: 15, fontWeight: 'bold' },
  dato: { fontSize: 13, color: '#555' },
});