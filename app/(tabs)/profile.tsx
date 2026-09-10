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
import { colors } from '../../lib/theme';

const BADGES = ['Early UBI', 'Good Host', 'Trusted Check-in', 'Night Explorer'] as const;

export default function Profile() {
  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Tu noche</GlassKicker>
          <GlassTitle>Perfil</GlassTitle>
        </View>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text style={styles.name}>@ubi_user</Text>
          <Text style={styles.bio}>Night Explorer · Barranco/Miraflores · House + Reggaetón</Text>
        </View>

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
            subtitle="Ubicación exacta nunca pública. Check-in opcional. Eventos privados ocultan dirección."
          />
          <GlassButton
            label="Abrir privacidad y seguridad"
            variant="ghost"
            onPress={() => router.push('/safety')}
          />
        </GlassCard>

        <GlassCard intensity="subtle" style={styles.card}>
          <GlassSectionTitle
            title="Ranking semanal"
            subtitle="Mock futuro por zona/universidad. Debe ser opcional."
          />
        </GlassCard>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 14,
    alignItems: 'stretch',
  },
  header: { gap: 4, alignItems: 'flex-start' },
  avatarWrap: { alignItems: 'center', gap: 6, marginVertical: 8 },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deepGreen,
    borderWidth: 1.5,
    borderColor: glass.borderGold,
  },
  avatarText: { color: colors.text, fontSize: 42, fontWeight: '800' },
  name: { color: colors.text, fontSize: 26, fontWeight: '800' },
  bio: { color: colors.muted, textAlign: 'center', lineHeight: 22, fontWeight: '600' },
  card: { gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
