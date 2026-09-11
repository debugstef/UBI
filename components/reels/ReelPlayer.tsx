/**
 * components/reels/ReelPlayer.tsx — full-bleed vertical reel card
 * R3b: DichroicMesh XOR 2 blobs (never both); blobs ≤0.22 opacity, no third magenta.
 * Audio chip muted (not neon cyan). Footer right clears sideCol via tokens.
 */
import { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, space, type } from '../../lib/theme';
import { glass } from '../glass-ui';
import { useSocial } from '../../lib/social/useSocial';
import type { ReelItem } from '../../lib/social/types';

const { height: H, width: W } = Dimensions.get('window');
/** sideCol right pad + btn width + gap → footer clearance */
const FOOTER_RIGHT = space[16] + space[2]; // 72

type Props = {
  reel: ReelItem;
  height?: number;
};

function SideAction({
  label,
  accessibilityLabel,
  active,
  disabled,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        Animated.sequence([
          Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, friction: 5, tension: 260 }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 220 }),
        ]).start();
        onPress();
      }}
      style={[styles.sideBtn, disabled && styles.sideDisabled]}
      hitSlop={12}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
      accessibilityRole="button"
    >
      <Animated.Text
        style={[
          styles.sideText,
          active && styles.sideActive,
          disabled && styles.sideDisabledText,
          { transform: [{ scale }] },
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

function DichroicMesh() {
  return (
    <View style={styles.mesh} pointerEvents="none">
      <View style={styles.meshBase} />
      <View style={styles.glowViolet} />
      <View style={styles.glowElectric} />
      <View style={styles.meshBottom} />
      <View style={styles.meshTop} />
    </View>
  );
}

export function ReelPlayer({ reel, height = H }: Props) {
  const { getUser, toggleReelLike, shareReel, followFromReel, currentUserId } = useSocial();
  const author = getUser(reel.authorId);
  if (!author) return null;

  return (
    <View style={[styles.root, { height, width: W, backgroundColor: reel.tint }]}>
      {/* R3b: DichroicMesh OR 2 blobs — never both */}
      {reel.videoUri ? (
        <>
          <DichroicMesh />
          <View style={styles.videoStub}>
            <Text style={styles.playIcon}>▶</Text>
            <Text style={styles.videoHint}>Reproducir</Text>
          </View>
        </>
      ) : (
        <View style={styles.abstract}>
          <View style={[styles.blob, { backgroundColor: colors.electricBlue }]} />
          <View style={[styles.blob2, { backgroundColor: colors.twilightViolet }]} />
        </View>
      )}

      <View style={styles.sideCol}>
        <SideAction
          label={`♥\n${formatCount(reel.likes)}`}
          accessibilityLabel="Me gusta"
          active={reel.liked}
          onPress={() => toggleReelLike(reel.id)}
        />
        <SideAction
          label={`💬\n${formatCount(reel.comments)}`}
          accessibilityLabel="Comentar"
          disabled
          onPress={() => {}}
        />
        <SideAction
          label={`↗\n${formatCount(reel.shares)}`}
          accessibilityLabel="Compartir"
          onPress={() => shareReel(reel.id)}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <View style={[styles.avatar, { backgroundColor: author.avatarColor }]}>
            <Text style={styles.avatarText}>{author.avatarInitial}</Text>
          </View>
          <View style={styles.authorMeta}>
            <Text style={styles.authorName}>{author.name}</Text>
            <Text style={styles.handle}>{author.handle}</Text>
          </View>
          {author.id !== currentUserId ? (
            <Pressable
              style={[styles.follow, author.following && styles.following]}
              onPress={() => followFromReel(author.id)}
              accessibilityRole="button"
              accessibilityLabel={author.following ? 'Siguiendo' : 'Seguir'}
            >
              <Text style={styles.followText}>
                {author.following ? 'Siguiendo' : 'Seguir'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.caption} numberOfLines={3}>
          {reel.caption}
        </Text>
        <View style={styles.audioChip}>
          <Text style={styles.audioText}>♪ {reel.audioLabel}</Text>
        </View>
      </View>
    </View>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

const styles = StyleSheet.create({
  root: { overflow: 'hidden' },
  mesh: {
    ...StyleSheet.absoluteFillObject,
  },
  meshBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,6,32,0.35)',
  },
  glowViolet: {
    position: 'absolute',
    top: '-8%',
    left: '-15%',
    width: '70%',
    height: '55%',
    borderRadius: 999,
    backgroundColor: 'rgba(61,31,110,0.40)',
  },
  glowElectric: {
    position: 'absolute',
    top: '18%',
    right: '-18%',
    width: '62%',
    height: '48%',
    borderRadius: 999,
    backgroundColor: 'rgba(79,107,255,0.22)',
  },
  meshBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
    backgroundColor: 'rgba(11,6,32,0.55)',
  },
  meshTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '18%',
    backgroundColor: 'rgba(18,10,46,0.35)',
  },
  videoStub: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
  playIcon: { color: colors.text, ...type.display, opacity: 0.85 },
  videoHint: { color: colors.muted, ...type.footnote },
  abstract: { ...StyleSheet.absoluteFillObject },
  blob: {
    position: 'absolute',
    top: '22%',
    left: '12%',
    width: 180,
    height: 180,
    borderRadius: 999,
    opacity: 0.2,
  },
  blob2: {
    position: 'absolute',
    bottom: '28%',
    right: '8%',
    width: 140,
    height: 140,
    borderRadius: 999,
    opacity: 0.18,
  },
  sideCol: {
    position: 'absolute',
    right: space[3],
    bottom: space[16] + space[12],
    gap: space[4],
    alignItems: 'center',
  },
  sideBtn: {
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: space[1],
  },
  sideText: {
    color: colors.text,
    textAlign: 'center',
    ...type.footnote,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 6,
  },
  sideActive: { color: colors.electricBlue },
  sideDisabled: { opacity: 0.45 },
  sideDisabledText: { color: colors.dim },
  footer: {
    position: 'absolute',
    left: space[4],
    right: FOOTER_RIGHT,
    bottom: space[8] + space[1],
    gap: space[2],
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: glass.border,
  },
  avatarText: { color: colors.text, ...type.subhead, fontWeight: '700' },
  authorMeta: { flex: 1, minWidth: 0 },
  authorName: { color: colors.text, ...type.subhead },
  handle: { color: colors.muted, ...type.caption2 },
  follow: {
    borderRadius: 999,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    backgroundColor: colors.electricBlue,
  },
  following: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: glass.border,
  },
  followText: { color: colors.text, ...type.caption1, fontWeight: '700' },
  caption: { color: colors.text, ...type.callout },
  audioChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    backgroundColor: 'rgba(18,10,46,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
  },
  audioText: { color: colors.muted, ...type.caption1, fontWeight: '600' },
});
