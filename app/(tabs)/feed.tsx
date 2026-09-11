/**
 * app/(tabs)/feed.tsx
 * StoriesTray + suggestions UserCards + PostCards
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  GlassScreen,
  GlassKicker,
  GlassTitle,
  GlassCard,
  GlassSectionTitle,
  GlassButton,
} from '../../components/glass-ui';
import { StoriesTray } from '../../components/stories/StoriesTray';
import { PostCard } from '../../components/posts/PostCard';
import { PostComposer } from '../../components/posts/PostComposer';
import { UserCard } from '../../components/profile/UserCard';
import { useSocial, useSuggestions } from '../../lib/social/useSocial';
import { colors, space, type } from '../../lib/theme';

export default function Feed() {
  const { posts } = useSocial();
  const params = useLocalSearchParams<{ qaEmpty?: string }>();
  const postsView = params.qaEmpty === '1' ? [] : posts;
  const suggestions = useSuggestions(4);

  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Inicio</GlassKicker>
          <GlassTitle>Lo que se mueve esta noche.</GlassTitle>
          <Text style={styles.p}>
            Fotos, me gusta y comentarios.
          </Text>
        </View>

        <Text style={styles.section}>Historias</Text>
        <StoriesTray />

        {suggestions.length > 0 ? (
          <>
            <Text style={styles.section}>Sugerencias</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestStrip}
            >
              {suggestions.map((u) => (
                <GlassCard key={u.id} intensity="subtle" glow="none" style={styles.suggestCard}>
                  <UserCard user={u} compact />
                </GlassCard>
              ))}
            </ScrollView>
          </>
        ) : null}

        <GlassCard intensity="subtle" glow="none" style={styles.composerCard}>
          <PostComposer embedded />
        </GlassCard>

        <GlassSectionTitle
          title="Publicaciones"
          subtitle="Fotos, me gusta y comentarios."
        />
        <View style={styles.list}>
          {postsView.length === 0 ? (
            <GlassCard intensity="subtle" glow="none" style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Sin publicaciones aún</Text>
              <Text style={styles.emptyBody}>
                Sé el primero en contar qué se mueve cerca.
              </Text>
              <GlassButton
                label="Publicar"
                onPress={() => router.push('/(tabs)/create?mode=post')}
              />
              <GlassButton
                label="Ver mapa"
                variant="ghost"
                onPress={() => router.push('/(tabs)/map')}
              />
            </GlassCard>
          ) : (
            postsView.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </View>
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
  header: { gap: space[1], marginBottom: space[1] },
  p: { color: colors.muted, ...type.callout, marginTop: space[1] },
  section: {
    color: colors.muted,
    ...type.subhead,
    marginTop: space[2],
  },
  suggestStrip: { gap: space[3], paddingVertical: space[1], paddingRight: space[4] },
  suggestCard: { width: 280, paddingVertical: space[3] },
  composerCard: { marginTop: space[1] },
  list: { gap: space[3] },
  emptyCard: { gap: space[2], paddingVertical: space[5] },
  emptyTitle: { color: colors.text, ...type.headline },
  emptyBody: { color: colors.muted, ...type.callout },
});
