/**
 * components/StoryCard.tsx
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassBadge, glass } from './glass-ui';
import { UbiEvent } from '../lib/types';
import { colors, gradients, space, type } from '../lib/theme';

export function StoryCard({
  event,
  onPress,
}: {
  event: UbiEvent;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <LinearGradient colors={[...gradients.story]} style={styles.card}>
        <View style={styles.glassEdge} />
        <Text style={styles.badge}>
          Hace {event.lastStory} min · {event.isPrivate ? `Near ${event.district}` : event.district}
        </Text>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.text}>
          {event.activity} · {event.people}+ personas · {event.music.join(' / ')}
        </Text>
        <View style={styles.actions}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>fuego</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>voy</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>guardar</Text>
          </View>
          <GlassBadge label={event.type} tone="violet" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 280,
    borderRadius: 28,
    padding: space[5],
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: glass.borderViolet,
    overflow: 'hidden',
    width: 260,
  },
  glassEdge: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.22)',
  },
  badge: {
    color: colors.gold,
    ...type.caption1,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    ...type.title1,
    marginTop: space[2],
  },
  text: {
    color: colors.muted,
    ...type.callout,
    marginTop: space[2],
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    marginTop: space[4],
    alignItems: 'center',
  },
  pill: {
    backgroundColor: 'rgba(242,244,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  pillText: {
    color: colors.deepIndigo,
    fontWeight: '700',
    fontSize: type.caption1.fontSize,
  },
});
