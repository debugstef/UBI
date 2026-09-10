import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassBadge, glass } from './glass-ui';
import { UbiEvent } from '../lib/types';
import { colors, gradients } from '../lib/theme';

export function StoryCard({ event, onPress }: { event: UbiEvent; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient colors={[...gradients.story]} style={styles.card}>
        <View style={styles.glassEdge} />
        <Text style={styles.badge}>
          Hace {event.lastStory} min · {event.district}
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
          <GlassBadge label={event.type} tone="gold" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 280,
    borderRadius: 28,
    padding: 20,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: glass.borderGold,
    overflow: 'hidden',
  },
  glassEdge: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.22)',
  },
  badge: { color: colors.gold, fontWeight: '800', fontSize: 12 },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: -0.4,
  },
  text: { color: colors.muted, lineHeight: 22, marginTop: 8, fontWeight: '600' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, alignItems: 'center' },
  pill: {
    backgroundColor: colors.champagne,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  pillText: { color: colors.background, fontWeight: '800', fontSize: 12 },
});
