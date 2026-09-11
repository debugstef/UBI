/**
 * components/stories/StoriesTray.tsx
 * "Crear" opens add-story flow (Create tab / story mode) — does NOT open self viewer.
 */
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { glass } from '../glass-ui';
import { colors, space, type } from '../../lib/theme';
import { useSocial } from '../../lib/social/useSocial';

type Cell =
  | { kind: 'create'; userId: string }
  | { kind: 'story'; userId: string; viewed: boolean };

export function StoriesTray() {
  const { stories, users, currentUserId, currentUser, addStorySlide } = useSocial();

  const data: Cell[] = [
    { kind: 'create', userId: currentUserId },
    ...stories
      .filter((s) => s.userId !== currentUserId)
      .map((s) => ({ kind: 'story' as const, userId: s.userId, viewed: s.viewed })),
    ...(stories.some((s) => s.userId === currentUserId)
      ? [
          {
            kind: 'story' as const,
            userId: currentUserId,
            viewed: stories.find((s) => s.userId === currentUserId)!.viewed,
          },
        ]
      : []),
  ];

  const seen = new Set<string>();
  const cells: Cell[] = [];
  for (const c of data) {
    if (c.kind === 'create') {
      cells.push(c);
      continue;
    }
    if (seen.has(c.userId)) continue;
    seen.add(c.userId);
    cells.push(c);
  }

  const openStory = (userId: string) => {
    router.push(`/story/${userId}`);
  };

  const startCreateStory = () => {
    Alert.alert('Nueva historia', 'Publica un slide dichroic o abre Crear → Historia.', [
      {
        text: 'Publicar ahora',
        onPress: () => {
          addStorySlide({
            caption: 'Nueva historia',
            tint: '#4F6BFF',
          });
          Alert.alert('Listo', 'Historia añadida. Ábrela desde tu anillo.');
        },
      },
      {
        text: 'Ir a Crear',
        onPress: () => router.push('/(tabs)/create?mode=story'),
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <FlatList
      horizontal
      data={cells}
      keyExtractor={(item: any, i: number) =>
        item.kind === 'create' ? `create-${item.userId}` : `story-${item.userId}-${i}`
      }
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
      renderItem={({ item }: { item: any }) => {
        if (item.kind === 'create') {
          return (
            <Pressable
              onPress={startCreateStory}
              style={styles.cell}
              accessibilityRole="button"
              accessibilityLabel="Crear historia"
              hitSlop={8}
            >
              <View style={[styles.ring, styles.ringCreate]}>
                <View style={[styles.avatar, { backgroundColor: currentUser.avatarColor }]}>
                  <Text style={styles.plus}>+</Text>
                </View>
              </View>
              <Text style={styles.label} numberOfLines={1}>
                Crear
              </Text>
            </Pressable>
          );
        }

        const user = users.find((u) => u.id === item.userId);
        if (!user) return null;
        const ring = item.viewed ? (
          <View style={[styles.ring, styles.ringViewed]}>
            <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
              <Text style={styles.initial}>{user.avatarInitial}</Text>
            </View>
          </View>
        ) : (
          <LinearGradient
            colors={['#4F6BFF', '#7B5CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ringGradient}
          >
            <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
              <Text style={styles.initial}>{user.avatarInitial}</Text>
            </View>
          </LinearGradient>
        );

        return (
          <Pressable
            onPress={() => openStory(item.userId)}
            style={styles.cell}
            accessibilityRole="button"
            accessibilityLabel={`Historia de ${user.name}`}
            hitSlop={8}
          >
            {ring}
            <Text style={styles.label} numberOfLines={1}>
              {user.isCurrentUser ? 'Tu historia' : user.name.split(' ')[0]}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const AVATAR = 56;

const styles = StyleSheet.create({
  strip: {
    gap: space[2], // 8
    paddingVertical: space[2],
    paddingRight: space[4],
  },
  cell: { width: 72, alignItems: 'center', gap: space[2] },
  ringGradient: {
    width: AVATAR + 8,
    height: AVATAR + 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[1], // 4pt ring pad (was odd 3)
  },
  ring: {
    width: AVATAR + 8,
    height: AVATAR + 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  ringCreate: { borderColor: glass.border, borderStyle: 'dashed' }, // R3b: glass.border / indigo, not cyan
  ringViewed: { borderColor: 'rgba(255,255,255,0.22)' },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.deepIndigo,
  },
  initial: { color: colors.text, ...type.title3, fontWeight: '700' },
  plus: { color: colors.electricBlue, ...type.title1, fontWeight: '700', marginTop: -2 },
  label: {
    color: colors.muted,
    ...type.caption2,
    textAlign: 'center',
    width: '100%',
  },
});
