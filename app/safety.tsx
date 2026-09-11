/**
 * app/safety.tsx — secured privacy-forward copy (ES shipped)
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import {
  GlassScreen,
  GlassCard,
  GlassButton,
  GlassKicker,
  GlassTitle,
  GlassSectionTitle,
} from '../components/glass-ui';
import { colors, space, type } from '../lib/theme';

export default function Safety() {
  const [sent, setSent] = useState(false);
  const [blocked, setBlocked] = useState(false);

  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Volver
        </Text>
        <GlassKicker>Seguridad</GlassKicker>
        <GlassTitle>Control sin romper el mapa</GlassTitle>

        <GlassCard intensity="medium" glow="none" style={styles.card}>
          <GlassSectionTitle
            title="Reportes"
            subtitle="Evento, historia, usuario, chat o situación riesgosa."
          />
          <GlassButton
            label={sent ? 'Reporte enviado' : 'Enviar reporte'}
            variant="danger"
            onPress={() => setSent(true)}
          />
        </GlassCard>

        <GlassCard intensity="subtle" glow="none" style={styles.card}>
          <GlassSectionTitle
            title="Bloquear"
            subtitle="Oculta mensajes y limita visibilidad mutua. Sin exponer datos."
          />
          <GlassButton
            label={blocked ? 'Usuario bloqueado' : 'Bloquear'}
            variant="ghost"
            onPress={() => setBlocked(true)}
          />
        </GlassCard>

        <GlassCard intensity="subtle" glow="none" style={styles.card}>
          <GlassSectionTitle
            title="Ubicación"
            subtitle="Tu ubicación exacta nunca es pública. Compartir con un contacto de confianza es voluntario y fuera del feed."
          />
          <Text style={styles.note}>
            Eventos privados muestran solo el distrito (“Cerca de Barranco”). UBI no pega tu
            lat/lng en la interfaz.
          </Text>
        </GlassCard>

        <GlassButton label="Verificar 18+" variant="ghost" onPress={() => router.push('/verify-18')} />
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
  card: { gap: space[3] },
  note: { color: colors.muted, ...type.footnote },
});
