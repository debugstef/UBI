import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  GlassScreen,
  GlassCard,
  GlassChip,
  GlassInput,
  GlassButton,
  GlassKicker,
  GlassTitle,
  GlassSectionTitle,
} from '../../components/glass-ui';
import { colors } from '../../lib/theme';

const TYPES = ['Reu', 'Previa', 'Discoteca', 'Concierto', 'Rooftop', 'After'] as const;
const VISIBILITY = ['Público', 'Semiabierto', 'Por link', 'Privado'] as const;

export default function Create() {
  const [type, setType] = useState<string>('Previa');
  const [visibility, setVisibility] = useState<string>('Semiabierto');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Crear evento/reu</GlassKicker>
          <GlassTitle>Wizard rápido y privado</GlassTitle>
        </View>

        <GlassSectionTitle title="Tipo de plan" subtitle="Reu, previa, discoteca, concierto, rooftop, after." />
        <View style={styles.chips}>
          {TYPES.map((t) => (
            <GlassChip key={t} label={t} active={type === t} onPress={() => setType(t)} />
          ))}
        </View>

        <GlassSectionTitle
          title="Visibilidad"
          subtitle="Privado y link ocultan ubicación exacta por defecto."
        />
        <View style={styles.chips}>
          {VISIBILITY.map((v) => (
            <GlassChip
              key={v}
              label={v}
              active={visibility === v}
              onPress={() => setVisibility(v)}
            />
          ))}
        </View>

        <GlassCard intensity="medium" style={styles.card}>
          <GlassSectionTitle title="Detalles" subtitle="Música, aporte, aforo, reglas y ubicación." />
          <GlassInput
            value={title}
            onChangeText={setTitle}
            placeholder="Nombre del plan"
          />
          <GlassInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Reglas, música, precio/aporte, aforo"
            multiline
            style={styles.area}
          />
          <Text style={styles.check}>✓ Chat activo · ✓ Historias · ✓ Aprobación opcional</Text>
        </GlassCard>

        <View style={styles.actions}>
          <GlassButton label="Publicar evento" variant="primary" onPress={() => {}} />
          <GlassButton label="Guardar borrador" variant="ghost" onPress={() => {}} />
        </View>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 14,
  },
  header: { gap: 4, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { gap: 10 },
  area: { minHeight: 94, textAlignVertical: 'top' },
  check: { color: colors.neonGreen, fontWeight: '800', marginTop: 4 },
  actions: { gap: 10, marginTop: 4 },
});
