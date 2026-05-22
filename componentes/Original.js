import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const PREGUNTAS = [
  {
    pregunta: '¿Qué valoras más en la vida?',
    opciones: [
      { texto: 'El coraje y la valentía', casa: 'Gryffindor' },
      { texto: 'La lealtad y el trabajo duro', casa: 'Hufflepuff' },
      { texto: 'La inteligencia y el conocimiento', casa: 'Ravenclaw' },
      { texto: 'La ambición y el ingenio', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Cómo reaccionas ante el peligro?',
    opciones: [
      { texto: 'Te lanzas sin pensarlo', casa: 'Gryffindor' },
      { texto: 'Proteges a los demás primero', casa: 'Hufflepuff' },
      { texto: 'Analizas la situación con calma', casa: 'Ravenclaw' },
      { texto: 'Buscas la mejor ventaja', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Cuál sería tu asignatura favorita?',
    opciones: [
      { texto: 'Defensa contra las Artes Oscuras', casa: 'Gryffindor' },
      { texto: 'Herbología', casa: 'Hufflepuff' },
      { texto: 'Astronomía', casa: 'Ravenclaw' },
      { texto: 'Pociones', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Qué animal te representaría?',
    opciones: [
      { texto: 'León', casa: 'Gryffindor' },
      { texto: 'Tejón', casa: 'Hufflepuff' },
      { texto: 'Águila', casa: 'Ravenclaw' },
      { texto: 'Serpiente', casa: 'Slytherin' },
    ],
  },
  {
    pregunta: '¿Qué harías con una varita encontrada?',
    opciones: [
      { texto: 'Usarla para ayudar a alguien', casa: 'Gryffindor' },
      { texto: 'Buscar a su dueño', casa: 'Hufflepuff' },
      { texto: 'Estudiarla para entender cómo funciona', casa: 'Ravenclaw' },
      { texto: 'Quedártela si te conviene', casa: 'Slytherin' },
    ],
  },
];

const TEMAS = {
  Gryffindor: { fondo: '#740001', texto: '#FFC500', emoji: '🦁' },
  Hufflepuff:  { fondo: '#ecb939', texto: '#372e29', emoji: '🦡' },
  Ravenclaw:   { fondo: '#0e1a40', texto: '#946b2d', emoji: '🦅' },
  Slytherin:   { fondo: '#1a472a', texto: '#aaaaaa', emoji: '🐍' },
};

export default function Original() {
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState({ Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 });
  const [casaFinal, setCasaFinal] = useState(null);
  const [guardado, setGuardado] = useState(false);

  const responder = async (casa) => {
    const nuevos = { ...puntos, [casa]: puntos[casa] + 1 };
    setPuntos(nuevos);

    if (indice + 1 >= PREGUNTAS.length) {
      const ganadora = Object.entries(nuevos).sort((a, b) => b[1] - a[1])[0][0];
      setCasaFinal(ganadora);
      const uid = auth.currentUser?.uid;
      if (uid) {
        await updateDoc(doc(db, 'usuarios', uid), { casa: ganadora });
        setGuardado(true);
      }
    } else {
      setIndice(indice + 1);
    }
  };

  const reiniciar = () => {
    setIndice(0);
    setPuntos({ Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 });
    setCasaFinal(null);
    setGuardado(false);
  };

  if (casaFinal) {
    const tema = TEMAS[casaFinal];
    return (
      <View style={[styles.resultado, { backgroundColor: tema.fondo }]}>
        <Text style={styles.gorroEmoji}>{tema.emoji}</Text>
        <Text style={[styles.casaTitulo, { color: tema.texto }]}>¡Perteneces a</Text>
        <Text style={[styles.casaNombre, { color: tema.texto }]}>{casaFinal}!</Text>
        {guardado && <Text style={{ color: tema.texto, marginTop: 8 }}>✓ Casa guardada en tu perfil</Text>}
        <TouchableOpacity style={[styles.boton, { borderColor: tema.texto }]} onPress={reiniciar}>
          <Text style={{ color: tema.texto, fontWeight: 'bold', fontSize: 16 }}>🎩 Repetir el test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pregActual = PREGUNTAS[indice];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.gorroEmoji}>🎩</Text>
      <Text style={styles.subtitulo}>El Sombrero Seleccionador</Text>
      <Text style={styles.progreso}>Pregunta {indice + 1} de {PREGUNTAS.length}</Text>
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
  container: { padding: 24, alignItems: 'center' },
  gorroEmoji: { fontSize: 64, marginTop: 20 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  progreso: { fontSize: 13, color: '#888', marginBottom: 16 },
  pregunta: { fontSize: 18, textAlign: 'center', marginBottom: 24, fontStyle: 'italic' },
  opcion: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 12, width: '100%' },
  opcionTexto: { fontSize: 16, textAlign: 'center' },
  resultado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  casaTitulo: { fontSize: 22, marginTop: 16 },
  casaNombre: { fontSize: 36, fontWeight: 'bold', marginTop: 8 },
  boton: { marginTop: 32, borderWidth: 2, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
});