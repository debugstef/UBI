/**
 * app/sos.tsx — privacy-forward Party SOS
 */
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  GlassScreen,
  GlassCard,
  GlassButton,
  GlassKicker,
  GlassTitle,
  GlassSectionTitle,
} from '../components/glass-ui';
import { colors, space, type } from '../lib/theme';

const CATS = [
  {
    title: 'Falta hielo / mixers',
    body: 'Ver tiendas cercanas o pedir al chat. Alcohol pide 18+ contextual.',
  },
  {
    title: 'Necesitamos transporte',
    body: 'Coordina un punto de encuentro por distrito — sin pegar tu pin exacto en público.',
  },
  {
    title: 'Música / parlante',
    body: 'Pide parlante o playlist al chat del evento.',
  },
  {
    title: 'Alguien se desorientó',
    body: 'Punto seguro + contacto de confianza. Ubicación exacta solo si tú la compartes.',
  },
  {
    title: 'Seguridad / ayuda',
    body: 'Reporta evento, historia o usuario. Para emergencias reales usa servicios locales.',
  },
] as const;

export default function SOS() {
  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Volver
        </Text>
        <GlassKicker>Party SOS</GlassKicker>
        <GlassTitle>Arreglar la noche</GlassTitle>
        <Text style={styles.lead}>
          Resolver ayuda a coordinar rápido. No reemplaza seguridad real ni servicios de emergencia.
        </Text>

        {CATS.map((c) => (
          <GlassCard key={c.title} intensity="medium" style={styles.card}>
            <GlassSectionTitle title={c.title} subtitle={c.body} />
          </GlassCard>
        ))}

        <View style={styles.actions}>
          <GlassButton label="Buscar Plan B" onPress={() => router.push('/plan-b')} />
          <GlassButton
            label="Seguridad y reportes"
            variant="danger"
            onPress={() => router.push('/safety')}
          />
        </View>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 58,
    paddingHorizontal: space[5],
    paddingBottom: 120,
    gap: space[3],
  },
  back: { color: colors.electricBlue, ...type.subhead },
  lead: { color: colors.muted, ...type.callout },
  card: { gap: space[1] },
  actions: { gap: space[3], marginTop: space[2] },
});
