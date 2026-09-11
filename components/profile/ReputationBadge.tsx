/**
 * components/profile/ReputationBadge.tsx
 * No CTA glow on card. Mini bars: indigo/violet/blue/cyan only.
 * Leyenda → magenta apex (never coral alert).
 */
import { StyleSheet, Text, View } from 'react-native';
import { GlassBadge, GlassCard } from '../glass-ui';
import { colors, space, type } from '../../lib/theme';
import { useUserScore } from '../../lib/social/useSocial';
import { rankLabelEs } from '../../lib/social/score';
import type { Rank } from '../../lib/social/types';

const RANK_TONE: Record<Rank, 'blue' | 'cyan' | 'violet' | 'magenta'> = {
  Explorador: 'blue',
  Habitual: 'violet',
  Conector: 'violet',
  Leyenda: 'magenta',
};

const BAR_COLOR = {
  connections: colors.electricBlue,
  posts: colors.electricBlue,
  stories: colors.twilightVioletLift, // dichroic violet — not magenta
  reactions: colors.deepIndigoLift, // indigo — not gold
} as const;

const LABELS: Record<keyof typeof BAR_COLOR, string> = {
  connections: 'Conexiones',
  posts: 'Publicaciones',
  stories: 'Historias',
  reactions: 'Reacciones',
};

type Props = {
  userId?: string;
  compact?: boolean;
};

export function ReputationBadge({ userId, compact = false }: Props) {
  const { total, rank, breakdown, barFractions, progress } = useUserScore(userId);

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Text style={styles.compactScore}>{total}</Text>
        <GlassBadge label={rankLabelEs(rank)} tone={RANK_TONE[rank]} />
      </View>
    );
  }

  return (
    <GlassCard intensity="medium" glow="none" style={styles.card}>
      <View style={styles.top}>
        <View>
          <Text style={styles.kicker}>Reputación</Text>
          <Text style={styles.total}>{total}</Text>
          {progress.next ? (
            <Text style={styles.nextHint}>
              {progress.remaining} pts → {rankLabelEs(progress.next)}
            </Text>
          ) : (
            <Text style={styles.nextHint}>Máximo nivel</Text>
          )}
        </View>
        <GlassBadge label={rankLabelEs(rank)} tone={RANK_TONE[rank]} />
      </View>

      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${Math.round(progress.progress * 100)}%` }]} />
      </View>

      <View style={styles.bars}>
        {(Object.keys(barFractions) as (keyof typeof barFractions)[]).map((key) => (
          <View key={key} style={styles.barRow}>
            <View style={styles.barMeta}>
              <Text style={styles.barLabel}>{LABELS[key]}</Text>
              <Text style={styles.barValue}>{breakdown[key]}</Text>
            </View>
            <View style={styles.miniTrack}>
              <View
                style={[
                  styles.miniFill,
                  {
                    width: `${Math.round(Math.min(1, barFractions[key]) * 100)}%`,
                    backgroundColor: BAR_COLOR[key],
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: space[3] },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  kicker: { color: colors.muted, ...type.caption1 },
  total: { color: colors.text, ...type.display, marginTop: space[1] },
  nextHint: { color: colors.muted, ...type.footnote, marginTop: 4 },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.electricBlue,
  },
  bars: { gap: space[2] },
  barRow: { gap: space[1] },
  barMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: { color: colors.muted, ...type.caption1 },
  barValue: { color: colors.text, ...type.caption1, fontWeight: '700' },
  miniTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  miniFill: { height: '100%', borderRadius: 999 },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  compactScore: {
    color: colors.gold,
    ...type.subhead,
    fontWeight: '700',
  },
});
