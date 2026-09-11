/**
 * components/posts/PostCard.tsx — quieter frost (subtle / hairline), real media Image
 * R3b: place chip tappable → map with selected eventId ("Ver en mapa")
 */
import { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { GlassCard, glass } from '../glass-ui';
import { colors, space, type } from '../../lib/theme';
import { UserCard } from '../profile/UserCard';
import { CommentThread } from './CommentThread';
import { useSocial } from '../../lib/social/useSocial';
import { selectEvent } from '../../lib/eventsStore';
import type { SocialPost } from '../../lib/social/types';

const TOKEN_RE = /(#[\wáéíóúñÁÉÍÓÚÑ]+|@[\w.]+)/g;

function isDisplayableUri(uri: string | null | undefined): boolean {
  if (!uri) return false;
  if (/^mock:\/\//i.test(uri)) return false;
  return /^(file:|content:|https?:|blob:|data:)/i.test(uri);
}

function RichBody({ body }: { body: string }) {
  const parts: { t: string; kind: 'text' | 'tag' | 'mention' }[] = [];
  let last = 0;
  const re = new RegExp(TOKEN_RE);
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    if (m.index > last) parts.push({ t: body.slice(last, m.index), kind: 'text' });
    parts.push({
      t: m[0],
      kind: m[0].startsWith('#') ? 'tag' : 'mention',
    });
    last = m.index + m[0].length;
  }
  if (last < body.length) parts.push({ t: body.slice(last), kind: 'text' });
  if (!parts.length) parts.push({ t: body, kind: 'text' });

  return (
    <Text style={styles.body}>
      {parts.map((p, i) => (
        <Text
          key={`${i}-${p.t}`}
          style={
            p.kind === 'tag' ? styles.tag : p.kind === 'mention' ? styles.mention : undefined
          }
        >
          {p.t}
        </Text>
      ))}
    </Text>
  );
}

function ActionBtn({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const bump = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.86, useNativeDriver: true, friction: 5, tension: 260 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 220 }),
    ]).start();
    onPress();
  };
  return (
    <Pressable onPress={bump} hitSlop={12} accessibilityRole="button">
      <Animated.Text
        style={[
          styles.action,
          active && styles.actionActive,
          { transform: [{ scale }] },
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

type Props = { post: SocialPost };

export function PostCard({ post }: Props) {
  const { getUser, togglePostLike, togglePostSave } = useSocial();
  const author = getUser(post.authorId);
  const [shares, setShares] = useState(post.shares);
  const [showComments, setShowComments] = useState(false);

  if (!author) return null;

  const uris =
    post.mediaUris && post.mediaUris.length
      ? post.mediaUris
      : post.mediaUri
        ? [post.mediaUri]
        : [];

  const openOnMap = () => {
    if (post.eventId) {
      selectEvent(post.eventId);
      router.push({
        pathname: '/(tabs)/map',
        params: { eventId: post.eventId },
      });
    } else {
      router.push('/(tabs)/map');
    }
  };

  const placeText = post.placeLabel
    ? `📍 ${post.placeLabel} · Ver en mapa`
    : '📍 Ver en mapa';

  return (
    <GlassCard intensity="subtle" glow="none" style={styles.card}>
      <UserCard user={author} compact showFollow={false} />
      <RichBody body={post.body} />

      {post.placeLabel || post.eventId ? (
        <Pressable
          onPress={openOnMap}
          style={styles.placeChip}
          accessibilityRole="button"
          accessibilityLabel="Ver en mapa"
          hitSlop={8}
        >
          <Text style={styles.placeChipText}>{placeText}</Text>
        </Pressable>
      ) : null}

      {uris.length > 0 ? (
        <View style={styles.mediaStack}>
          {uris.slice(0, 2).map((uri) =>
            isDisplayableUri(uri) ? (
              <Image key={uri} source={{ uri }} style={styles.mediaImage} />
            ) : (
              <View
                key={uri}
                style={[styles.media, { backgroundColor: post.mediaTint ?? colors.twilightViolet }]}
              >
                <Text style={styles.mediaCaption}>Multimedia</Text>
              </View>
            ),
          )}
        </View>
      ) : null}

      {post.linkPreview ? (
        <View style={styles.link}>
          <Text style={styles.linkDomain}>{post.linkPreview.domain}</Text>
          <Text style={styles.linkTitle}>{post.linkPreview.title}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <ActionBtn
          label={`♥ ${post.likes}`}
          active={post.liked}
          onPress={() => togglePostLike(post.id)}
        />
        <ActionBtn
          label={`💬 ${post.comments}`}
          onPress={() => setShowComments((v) => !v)}
        />
        <ActionBtn
          label={`↗ ${shares}`}
          onPress={() => setShares((s) => s + 1)}
        />
        <ActionBtn
          label={post.saved ? '★ Guardado' : '☆ Guardar'}
          active={post.saved}
          onPress={() => togglePostSave(post.id)}
        />
      </View>

      {showComments ? (
        <CommentThread postId={post.id} comments={post.commentThread} />
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space[3],
    borderWidth: StyleSheet.hairlineWidth,
  },
  body: { color: colors.text, ...type.callout },
  tag: { color: colors.electricBlue, fontWeight: '700' },
  mention: { color: colors.electricBlue, fontWeight: '700' },
  mediaStack: { gap: space[2] },
  mediaImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
    backgroundColor: colors.twilightViolet,
  },
  media: {
    height: 180,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaCaption: { color: colors.text, ...type.subhead },
  link: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.borderViolet,
    padding: space[3],
    gap: 2,
    backgroundColor: 'rgba(42,22,80,0.28)',
  },
  linkDomain: { color: colors.gold, ...type.caption1 },
  linkTitle: { color: colors.text, ...type.subhead },
  placeChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    backgroundColor: 'rgba(79,107,255,0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.borderBlue,
  },
  placeChipText: { color: colors.champagne, ...type.caption1, fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[3],
    alignItems: 'center',
  },
  action: { color: colors.muted, ...type.footnote, fontWeight: '700' },
  actionActive: { color: colors.electricBlue },
});
