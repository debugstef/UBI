/**
 * components/EventCard.tsx
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassCard, GlassBadge } from './glass-ui';
import { UbiEvent } from '../lib/types';
import { colors, space, type } from '../lib/theme';

function locationLabel(event: UbiEvent) {
  if (event.isPrivate) return `Cerca de ${event.district}`;
  return `${event.district} · ${event.distance}`;
}

export function EventCard({
  event,
  onPress,
}: {
  event: UbiEvent;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <GlassCard intensity="medium" glow={event.isLiveNow ? 'blue' : 'none'} style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <GlassBadge
            label={event.activity === 'trending' ? 'Tendencia' : event.activity}
            tone={event.activity === 'trending' ? 'cyan' : event.activity === 'lleno' ? 'violet' : 'blue'}
          />
        </View>
        <Text style={styles.meta}>
          {locationLabel(event)} · {event.people}+ personas
        </Text>
        <Text style={styles.meta}>
          {event.music.join(' / ')} · {event.price === 0 ? 'Gratis' : `S/ ${event.price}`} ·{' '}
          {event.friends} amigos
        </Text>
        {event.isPrivate ? (
          <Text style={styles.privacy}>Privado · dirección exacta oculta</Text>
        ) : null}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: space[2] },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: space[3],
  },
  title: {
    color: colors.text,
    ...type.headline,
    flex: 1,
  },
  meta: {
    color: colors.muted,
    ...type.footnote,
  },
  privacy: {
    color: colors.gold,
    ...type.caption1,
    marginTop: space[1],
  },
});
