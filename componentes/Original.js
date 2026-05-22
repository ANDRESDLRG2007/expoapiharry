import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const PREGUNTAS = [
  {
    pregunta: '¿Qué valoras más en la vida?',
    opciones: [
      { texto: '⚔️ El coraje y la valentía', casa: 'Gryffindor' },
      { texto: '🌻 La lealtad y el trabajo duro', casa: 'Hufflepuff' },
      { texto: '📚 La sabiduría y el conocimiento', casa: 'Ravenclaw' },
      { texto: '🏆 La ambición y el poder', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Cómo reaccionas ante el peligro?',
    opciones: [
      { texto: '🦁 Te lanzas sin pensarlo', casa: 'Gryffindor' },
      { texto: '🛡️ Proteges a los demás primero', casa: 'Hufflepuff' },
      { texto: '🔍 Analizas la situación', casa: 'Ravenclaw' },
      { texto: '🎯 Buscas la mejor ventaja', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Cuál sería tu asignatura favorita?',
    opciones: [
      { texto: '⚡ Defensa contra las Artes Oscuras', casa: 'Gryffindor' },
      { texto: '🌿 Herbología', casa: 'Hufflepuff' },
      { texto: '🌌 Astronomía', casa: 'Ravenclaw' },
      { texto: '🧪 Pociones', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Qué animal te representaría?',
    opciones: [
      { texto: '🦁 León', casa: 'Gryffindor' },
      { texto: '🦡 Tejón', casa: 'Hufflepuff' },
      { texto: '🦅 Águila', casa: 'Ravenclaw' },
      { texto: '🐍 Serpiente', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Qué harías con una varita encontrada?',
    opciones: [
      { texto: '🤝 Usarla para ayudar a alguien', casa: 'Gryffindor' },
      { texto: '🔎 Buscar a su dueño', casa: 'Hufflepuff' },
      { texto: '🔬 Estudiarla para entender cómo funciona', casa: 'Ravenclaw' },
      { texto: '💼 Quedártela si te conviene', casa: 'Slytherin' },
    ],
  },
];

const TEMAS = {
  Gryffindor: { fondo: '#740001', texto: '#FFC500', secundario: '#5d0000', emoji: '🦁', descripcion: 'Valiente, audaz y caballeroso' },
  Hufflepuff:  { fondo: '#ecb939', texto: '#372e29', secundario: '#d4a420', emoji: '🦡', descripcion: 'Leal, paciente y trabajador' },
  Ravenclaw:   { fondo: '#0e1a40', texto: '#946b2d', secundario: '#0a1228', emoji: '🦅', descripcion: 'Sabio, ingenioso y curioso' },
  Slytherin:   { fondo: '#1a472a', texto: '#aaaaaa', secundario: '#123320', emoji: '🐍', descripcion: 'Ambicioso, astuto y decidido' },
};

export default function Original() {
  const [casaGuardada, setCasaGuardada] = useState(undefined); // undefined = cargando
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState({ Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 });
  const [casaFinal, setCasaFinal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const uid = auth.currentUser?.uid;

  // Leer si ya tiene casa guardada
  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'usuarios', uid)).then(snap => {
      if (snap.exists()) {
        setCasaGuardada(snap.data().casa || null);
      }
      setCargando(false);
    });
  }, []);

  const responder = async (casa) => {
    const nuevos = { ...puntos, [casa]: puntos[casa] + 1 };
    setPuntos(nuevos);
    if (indice + 1 >= PREGUNTAS.length) {
      const ganadora = Object.entries(nuevos).sort((a, b) => b[1] - a[1])[0][0];
      setCasaFinal(ganadora);
      if (uid) {
        await updateDoc(doc(db, 'usuarios', uid), { casa: ganadora });
        setCasaGuardada(ganadora);
      }
    } else {
      setIndice(indice + 1);
    }
  };

  const reiniciar = () => {
    setIndice(0);
    setPuntos({ Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 });
    setCasaFinal(null);
  };

  if (cargando) return (
    <View style={{ flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="#c9a84c" size="large" />
    </View>
  );

  // Ya tiene casa guardada y no está haciendo el test de nuevo
  if (casaGuardada && !casaFinal && indice === 0 && puntos.Gryffindor === 0) {
    const tema = TEMAS[casaGuardada];
    return (
      <View style={[styles.resultado, { backgroundColor: tema.fondo }]}>
        <Text style={styles.emojiGrande}>{tema.emoji}</Text>
        <Text style={[styles.casaTitulo, { color: tema.texto }]}>Tu casa es</Text>
        <Text style={[styles.casaNombre, { color: tema.texto }]}>{casaGuardada}</Text>
        <Text style={[styles.casaDesc, { color: tema.texto }]}>{tema.descripcion}</Text>
        <TouchableOpacity style={[styles.boton, { borderColor: tema.texto }]} onPress={reiniciar}>
          <Text style={{ color: tema.texto, fontWeight: 'bold', fontSize: 16 }}>🎩 Repetir el test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Resultado del test recién completado
  if (casaFinal) {
    const tema = TEMAS[casaFinal];
    return (
      <View style={[styles.resultado, { backgroundColor: tema.fondo }]}>
        <Text style={styles.emojiGrande}>{tema.emoji}</Text>
        <Text style={[styles.casaTitulo, { color: tema.texto }]}>¡Perteneces a</Text>
        <Text style={[styles.casaNombre, { color: tema.texto }]}>{casaFinal}!</Text>
        <Text style={[styles.casaDesc, { color: tema.texto }]}>{tema.descripcion}</Text>
        <Text style={[styles.guardadoTexto, { color: tema.texto }]}>✓ Casa guardada en tu perfil</Text>
        <TouchableOpacity style={[styles.boton, { borderColor: tema.texto }]} onPress={reiniciar}>
          <Text style={{ color: tema.texto, fontWeight: 'bold', fontSize: 16 }}>🎩 Repetir el test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Test en curso
  const pregActual = PREGUNTAS[indice];
  const progreso = ((indice) / PREGUNTAS.length) * 100;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.gorroEmoji}>🎩</Text>
      <Text style={styles.subtitulo}>El Sombrero Seleccionador</Text>
      <Text style={styles.progreso}>Pregunta {indice + 1} de {PREGUNTAS.length}</Text>
      <View style={styles.barraFondo}>
        <View style={[styles.barraRelleno, { width: `${progreso}%` }]} />
      </View>
      <Text style={styles.pregunta}>{pregActual.pregunta}</Text>
      {pregActual.opciones.map((op, i) => (
        <TouchableOpacity key={i} style={styles.opcion} onPress={() => responder(op.casa)}>
          <Text style={styles.opcionTexto}>{op.texto}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center', backgroundColor: '#0d0d0d', flexGrow: 1 },
  gorroEmoji: { fontSize: 72, marginTop: 20 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#c9a84c', letterSpacing: 1 },
  progreso: { fontSize: 13, color: '#888', marginBottom: 10 },
  barraFondo: { width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 24 },
  barraRelleno: { height: 4, backgroundColor: '#c9a84c', borderRadius: 2 },
  pregunta: { fontSize: 18, textAlign: 'center', marginBottom: 24, fontStyle: 'italic',
    color: '#fff', lineHeight: 26 },
  opcion: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12,
    marginBottom: 12, width: '100%', borderWidth: 1, borderColor: '#333' },
  opcionTexto: { fontSize: 15, textAlign: 'center', color: '#fff' },
  resultado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emojiGrande: { fontSize: 80 },
  casaTitulo: { fontSize: 22, marginTop: 16 },
  casaNombre: { fontSize: 40, fontWeight: 'bold', marginTop: 8 },
  casaDesc: { fontSize: 14, marginTop: 8, fontStyle: 'italic', textAlign: 'center' },
  guardadoTexto: { marginTop: 12, fontSize: 14 },
  boton: { marginTop: 32, borderWidth: 2, paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 24 },
});