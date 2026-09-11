/**
 * app/verify-18.tsx — contextual 18+ gate (not app-wide lock)
 */
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  GlassScreen,
  GlassCard,
  GlassButton,
  GlassKicker,
  GlassTitle,
  GlassSectionTitle,
} from '../components/glass-ui';
import { colors, space, type } from '../lib/theme';

export default function Verify18() {
  return (
    <GlassScreen style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Volver
        </Text>
        <GlassKicker>Verificación contextual</GlassKicker>
        <GlassTitle>18+ solo cuando corresponde</GlassTitle>

        <GlassCard intensity="medium" glow="none" style={styles.card}>
          <GlassSectionTitle
            title="¿Por qué aparece?"
            subtitle="Alcohol, promociones sensibles o eventos restringidos."
          />
          <Text style={styles.body}>
            No bloquea el mapa ni los planes generales. UBI puede pedir documento, consentimiento y
            selfie opcional — nunca se muestran datos sensibles en el feed.
          </Text>
        </GlassCard>

        <GlassButton label="Confirmar 18+" onPress={() => router.back()} />
        <GlassButton
          label="Seguir con acceso limitado"
          variant="ghost"
          onPress={() => router.replace('/(tabs)/map')}
        />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flex: 1,
    paddingTop: 58,
    paddingHorizontal: space[5],
    paddingBottom: space[12],
    gap: space[3],
  },
  back: { color: colors.electricBlue, ...type.subhead },
  card: { gap: space[3] },
  body: { color: colors.muted, ...type.callout },
});
