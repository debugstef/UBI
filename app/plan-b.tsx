import { useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventCard } from '../components/EventCard';
import { Card, Screen } from '../components/ui';
import { events } from '../lib/data';
import { colors } from '../lib/theme';

/**
 * Plan B — honest fallback finder.
 * Prefers cooler / less crowded / not-trending alternatives.
 */
export default function PlanB() {
  const params = useLocalSearchParams<{ from?: string }>();
  const excludeId = typeof params.from === 'string' ? params.from : undefined;

  const alternatives = useMemo(() => {
    const rank = (a: (typeof events)[0]) => {
      // Prefer activo/bajo, lower people, not trending
      let score = a.people;
      if (a.activity === 'trending') score += 80;
      if (a.activity === 'lleno') score += 40;
      if (a.activity === 'activo') score -= 10;
      if (a.activity === 'bajo') score -= 20;
      if (a.isLiveNow) score -= 5;
      return score;
    };

    return events
      .filter((e) => e.id !== excludeId)
      .slice()
      .sort((a, b) => rank(a) - rank(b));
  }, [excludeId]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.c}>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Atrás
        </Text>
        <Text style={styles.k}>Plan B</Text>
        <Text style={styles.t}>Cerca, menos calor, o con tus patas</Text>
        <Card>
          <Text style={styles.card}>
            Si el spot se llenó o se apagó, acá van opciones más suaves — menos pelea por
            entrada, más chance de armar la previa con tu grupo.
          </Text>
        </Card>

        {alternatives.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nada a la mano</Text>
            <Text style={styles.emptyBody}>
              Amplía el radar o vuelve al mapa a mirar otra zona.
            </Text>
            <Pressable style={styles.cta} onPress={() => router.back()}>
              <Text style={styles.ctaText}>Volver al mapa</Text>
            </Pressable>
          </View>
        ) : (
          alternatives.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              onPress={() => router.push(`/event/${e.id}`)}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  c: { padding: 20, paddingTop: 58, paddingBottom: 120, gap: 14 },
  back: { color: colors.champagne, fontWeight: '700', fontSize: 14 },
  k: { color: colors.gold, fontWeight: '700', letterSpacing: 0.4, fontSize: 12 },
  t: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  card: { color: colors.muted, lineHeight: 22, fontWeight: '500' },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(217,210,197,0.16)',
    padding: 20,
    gap: 8,
  },
  emptyTitle: { color: colors.text, fontWeight: '800', fontSize: 18 },
  emptyBody: { color: colors.muted, lineHeight: 21 },
  cta: {
    marginTop: 8,
    backgroundColor: colors.neonGreen,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: { color: '#F2EDE6', fontWeight: '700' },
});
