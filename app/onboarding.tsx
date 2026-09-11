/**
 * app/onboarding.tsx — map + social reputation priming + privacy + 18+
 * Social slide seeds 1–2 follows into SocialProvider (persisted).
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  GlassScreen,
  GlassCard,
  GlassButton,
  GlassChip,
  GlassKicker,
  GlassTitle,
} from '../components/glass-ui';
import { colors, space, type } from '../lib/theme';
import { useSocial } from '../lib/social/useSocial';

const SLIDES = [
  {
    id: 'map',
    kicker: '1 · Mapa primero',
    title: 'Mira qué hay cerca',
    body: 'El mapa es el centro. Historias y chats existen para ayudarte a decidir, no para distraerte.',
  },
  {
    id: 'social',
    kicker: '2 · Cerca y con gente',
    title: 'Historias que ayudan a decidir',
    body: 'Sigue a gente cercana y mira historias del barrio. Todo acompaña al mapa: eliges el plan, no te pierdes en el feed.',
  },
  {
    id: 'privacy',
    kicker: '3 · Privacidad calmada',
    title: 'Tu ubicación exacta nunca es pública',
    body: 'Compartes zona o distrito. Los planes privados muestran “Cerca de Barranco”, no la calle.',
  },
  {
    id: 'age',
    kicker: '4 · 18+ solo si aplica',
    title: 'Sin candados innecesarios',
    body: 'La verificación 18+ aparece solo con alcohol o eventos restringidos. El resto de la noche sigue abierta.',
  },
] as const;

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const { seedOnboardingFollows } = useSocial();
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  const goMap = () => {
    // Ensure social priming landed even if user skipped mid-flow after social slide
    if (index >= 1) {
      seedOnboardingFollows(['u-vale', 'u-nico']);
    }
    router.replace('/(tabs)/map');
  };

  const continueNext = () => {
    const current = SLIDES[index];
    if (current.id === 'social') {
      seedOnboardingFollows(['u-vale', 'u-nico']);
    }
    if (last) {
      goMap();
      return;
    }
    setIndex((i) => i + 1);
  };

  return (
    <GlassScreen style={styles.screen}>
      <View style={styles.top}>
        <GlassKicker>{slide.kicker}</GlassKicker>
        <GlassTitle>{slide.title}</GlassTitle>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      {slide.id === 'social' ? (
        <GlassCard intensity="subtle" style={styles.card}>
          <Text style={styles.hint}>Te sugerimos seguir</Text>
          <View style={styles.chips}>
            <GlassChip label="@vale.rmx" active onPress={() => {}} />
            <GlassChip label="@nico.waves" active onPress={() => {}} />
            <GlassChip label="Mapa primero · historias cerca" active={false} onPress={() => {}} />
          </View>
        </GlassCard>
      ) : (
        <GlassCard intensity="subtle" style={styles.card}>
          <Text style={styles.hint}>Zonas que te interesan</Text>
          <View style={styles.chips}>
            {['Barranco', 'Miraflores', 'San Isidro', 'House', 'Reggaetón'].map((x, i) => (
              <GlassChip key={x} label={x} active={i < 3} onPress={() => {}} />
            ))}
          </View>
        </GlassCard>
      )}

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        {last ? (
          <>
            <GlassButton label="Ir al mapa" onPress={goMap} />
            <GlassButton
              label="Verificar 18+ después"
              variant="ghost"
              onPress={goMap}
            />
          </>
        ) : (
          <>
            <GlassButton label="Continuar" onPress={continueNext} />
            <GlassButton label="Saltar" variant="ghost" onPress={goMap} />
          </>
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: space[6],
    paddingTop: 72,
    paddingBottom: space[12],
    justifyContent: 'space-between',
  },
  top: { gap: space[3], maxWidth: 360 },
  body: { color: colors.muted, ...type.callout },
  card: { gap: space[3] },
  hint: { color: colors.champagne, ...type.footnote },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  dots: { flexDirection: 'row', gap: space[2], justifyContent: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dotActive: { backgroundColor: colors.electricBlue, width: 22 },
  footer: { gap: space[3] },
});
