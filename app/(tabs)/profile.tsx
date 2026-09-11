/**
 * app/(tabs)/profile.tsx — reputation-first profile
 */
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  GlassScreen,
  GlassCard,
  GlassChip,
  GlassButton,
  GlassKicker,
  GlassTitle,
  GlassSectionTitle,
  glass,
} from '../../components/glass-ui';
import { ReputationBadge } from '../../components/profile/ReputationBadge';
import { useSocial } from '../../lib/social/useSocial';
import { colors, space, type } from '../../lib/theme';

const BADGES = ['Early UBI', 'Good Host', 'Trusted Check-in', 'Night Explorer'] as const;

export default function Profile() {
  const { currentUser, posts, stories } = useSocial();
  const myPosts = posts.filter((p) => p.authorId === currentUser.id).length;
  const myStories = stories.find((s) => s.userId === currentUser.id)?.slides.length ?? 0;

  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Tu noche</GlassKicker>
          <GlassTitle>Perfil</GlassTitle>
          
        </View>

        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: currentUser.avatarColor }]}>
            <Text style={styles.avatarText}>{currentUser.avatarInitial}</Text>
          </View>
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.handle}>
            {currentUser.handle} · {currentUser.district}
          </Text>
          <Text style={styles.bio}>{currentUser.bio}</Text>
          <Text style={styles.stats}>
            {myPosts} posts · {myStories} slides · {currentUser.activity.connections} conexiones
          </Text>
        </View>

        <ReputationBadge />

        <GlassCard intensity="medium" style={styles.card}>
          <GlassSectionTitle
            title="Clout útil"
            subtitle="Premia aportar información real, no exposición riesgosa."
          />
          <View style={styles.chips}>
            {BADGES.map((x, i) => (
              <GlassChip key={x} label={x} active={i < 2} onPress={() => {}} />
            ))}
          </View>
        </GlassCard>

        <GlassCard intensity="subtle" style={styles.card}>
          <GlassSectionTitle
            title="Privacidad"
            subtitle="Tu ubicación exacta nunca es pública. Check-in opcional. Eventos privados ocultan dirección."
          />
          <Text style={styles.privacyNote}>Exact location never public</Text>
          <GlassButton
            label="Seguridad y reportes"
            variant="ghost"
            onPress={() => router.push('/safety')}
          />
          <GlassButton
            label="Verificar 18+"
            variant="ghost"
            onPress={() => router.push('/verify-18')}
          />
        </GlassCard>

        <GlassCard intensity="subtle" style={styles.card}>
          <GlassSectionTitle
            title="SOS / Plan B"
            subtitle="Si la noche se complica, hay salida."
          />
          <GlassButton label="Abrir SOS" variant="danger" onPress={() => router.push('/sos')} />
          <GlassButton label="Plan B" variant="ghost" onPress={() => router.push('/plan-b')} />
        </GlassCard>
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
  header: { gap: space[2], alignItems: 'flex-start' },
    avatarWrap: { alignItems: 'center', gap: space[1], marginVertical: space[2] },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: glass.borderBlue,
  },
  avatarText: { color: colors.text, fontSize: 42, fontWeight: '700' },
  name: { color: colors.text, ...type.title1 },
  handle: { color: colors.gold, ...type.subhead },
  bio: {
    color: colors.muted,
    textAlign: 'center',
    ...type.callout,
  },
  stats: { color: colors.muted, ...type.footnote, marginTop: space[1] },
  card: { gap: space[3] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  privacyNote: {
    color: colors.muted,
    ...type.footnote,
    fontWeight: '600',
  },
});
