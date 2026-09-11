/**
 * components/profile/UserCard.tsx
 */
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { glass } from '../glass-ui';
import { colors, space, type } from '../../lib/theme';
import { ReputationBadge } from './ReputationBadge';
import { useSocial } from '../../lib/social/useSocial';
import type { UserSocial } from '../../lib/social/types';

type Props = {
  user: UserSocial;
  compact?: boolean;
  showFollow?: boolean;
  onPress?: () => void;
};

export function UserCard({ user, compact = false, showFollow = true, onPress }: Props) {
  const { toggleFollow, currentUserId } = useSocial();
  const isSelf = user.id === currentUserId;
  const scale = useRef(new Animated.Value(1)).current;

  const follow = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 6, tension: 240 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 220 }),
    ]).start();
    toggleFollow(user.id);
  };

  const body = (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
        <Text style={styles.avatarText}>{user.avatarInitial}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.handle} numberOfLines={1}>
          {user.handle}
        </Text>
        <ReputationBadge userId={user.id} compact />
      </View>
      {showFollow && !isSelf ? (
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            onPress={follow}
            style={[styles.followBtn, user.following && styles.followGhost]}
            accessibilityRole="button"
            accessibilityLabel={user.following ? 'Dejar de seguir' : 'Seguir'}
          >
            <Text style={[styles.followText, user.following && styles.followTextGhost]}>
              {user.following ? 'Siguiendo' : 'Seguir'}
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {body}
      </Pressable>
    );
  }
  return body;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  rowCompact: {
    gap: space[2],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: glass.borderBlue,
  },
  avatarText: { color: colors.text, ...type.headline, fontWeight: '700' },
  meta: { flex: 1, gap: space[1], minWidth: 0 },
  name: { color: colors.text, ...type.subhead },
  handle: { color: colors.muted, ...type.caption1 },
  followBtn: {
    borderRadius: 12,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    backgroundColor: colors.electricBlue,
    minWidth: 88,
    alignItems: 'center',
  },
  followGhost: {
    backgroundColor: 'rgba(42,22,80,0.45)',
    borderWidth: 1,
    borderColor: glass.borderViolet,
  },
  followText: { color: colors.text, ...type.caption1, fontWeight: '700' },
  followTextGhost: { color: colors.muted },
});
