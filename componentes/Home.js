import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

export default function Home() {
  const [personajes, setPersonajes] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetch('https://hp-api.onrender.com/api/characters')
      .then(r => r.json())
      .then(data => { setPersonajes(data); setCargando(false); });

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

  const CASAS_COLOR = {
    Gryffindor: '#740001', Slytherin: '#1a472a',
    Hufflepuff: '#ecb939', Ravenclaw: '#0e1a40',
  };

  const filtrados = personajes.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) return (
    <View style={styles.cargando}>
      <ActivityIndicator size="large" color="#c9a84c" />
      <Text style={{ color: '#c9a84c', marginTop: 12 }}>Consultando el libro de hechizos...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>📖 Registro de Magos</Text>
      <TextInput
        style={styles.buscador}
        placeholder="🔍 Buscar personaje..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />
      {filtrados.map((p) => {
        const colorCasa = CASAS_COLOR[p.house] || '#333';
        const esFav = favoritos.includes(p.id);
        return (
          <View key={p.id} style={[styles.card, { borderLeftColor: colorCasa }]}>
            {p.image
              ? <Image source={{ uri: p.image }} style={styles.img} />
              : <View style={styles.imgVacio}><Text style={{ fontSize: 28 }}>🧙</Text></View>
            }
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{p.name}</Text>
              {p.house ? (
                <View style={[styles.casaBadge, { backgroundColor: colorCasa }]}>
                  <Text style={styles.casaTexto}>{p.house}</Text>
                </View>
              ) : null}
              <Text style={styles.dato}>Actor: {p.actor || 'Desconocido'}</Text>
              <Text style={styles.dato}>
                {p.alive ? '✅ Vivo' : '💀 Fallecido'} · {p.species || 'Humano'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorito(p.id)} style={styles.favBtn}>
              <Text style={{ fontSize: 26 }}>{esFav ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  cargando: { flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center',
    margin: 16, color: '#c9a84c', letterSpacing: 2 },
  buscador: { marginHorizontal: 16, marginBottom: 12, padding: 12,
    borderWidth: 1, borderColor: '#c9a84c', borderRadius: 8,
    color: '#fff', backgroundColor: '#1a1a1a' },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12,
    borderBottomWidth: 0.5, borderColor: '#333', borderLeftWidth: 4,
    marginHorizontal: 12, marginBottom: 8, borderRadius: 8, backgroundColor: '#1a1a1a' },
  img: { width: 60, height: 80, borderRadius: 8, marginRight: 12 },
  imgVacio: { width: 60, height: 80, borderRadius: 8, marginRight: 12,
    backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' },
  nombre: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  casaBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 4, marginBottom: 4 },
  casaTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  dato: { fontSize: 12, color: '#888' },
  favBtn: { padding: 8 },
});