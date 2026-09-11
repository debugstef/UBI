/**
 * app/plan-b.tsx — honest fallback finder (glass + eventsStore)
 */
import { useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventCard } from '../components/EventCard';
import { GlassScreen, GlassButton, GlassKicker, GlassTitle } from '../components/glass-ui';
import { useEvents, type UbiEvent } from '../lib/eventsStore';
import { colors, space, type } from '../lib/theme';

function coolerRank(a: UbiEvent) {
  let score = a.people;
  if (a.activity === 'trending') score += 80;
  if (a.activity === 'lleno') score += 40;
  if (a.activity === 'activo') score -= 10;
  if (a.activity === 'bajo') score -= 20;
  if (a.isLiveNow) score -= 5;
  return score;
}

export default function PlanB() {
  const params = useLocalSearchParams<{ from?: string }>();
  const excludeId = typeof params.from === 'string' ? params.from : undefined;
  const events = useEvents();

  const alternatives = useMemo(() => {
    return events
      .filter((e) => e.id !== excludeId)
      .slice()
      .sort((a, b) => coolerRank(a) - coolerRank(b))
      .slice(0, 6);
  }, [events, excludeId]);

  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>← Volver</Text>
        </Pressable>
        <GlassKicker>PLAN B</GlassKicker>
        <GlassTitle>Opciones más suaves</GlassTitle>
        <Text style={styles.sub}>
          Si el spot se llenó o se apagó, mira planes cerca con menos calor.
        </Text>

        {alternatives.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nada a la mano</Text>
            <Text style={styles.emptyBody}>Amplía el radar en el mapa o crea un plan.</Text>
            <GlassButton label="Ver mapa" onPress={() => router.push('/(tabs)/map')} />
          </View>
        ) : (
          <View style={styles.list}>
            {alternatives.map((e) => (
              <EventCard key={e.id} event={e} onPress={() => router.push(`/event/${e.id}`)} />
            ))}
          </View>
        )}
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 58,
    paddingHorizontal: space[4],
    paddingBottom: 120,
    gap: space[3],
  },
  back: { color: colors.champagne, ...type.subhead, fontWeight: '700' },
  sub: { color: colors.muted, ...type.callout },
  list: { gap: space[3] },
  empty: { gap: space[3], paddingVertical: space[6] },
  emptyTitle: { color: colors.text, ...type.headline },
  emptyBody: { color: colors.muted, ...type.callout },
});
