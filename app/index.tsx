import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/ui';
import { colors, gradients } from '../lib/theme';

export default function Splash() {
  return (
    <LinearGradient colors={gradients.night} style={styles.screen}>
      <Text style={styles.kicker}>Lima</Text>
      <Text style={styles.logo}>UBI</Text>
      <Text style={styles.title}>Find tonight’s party</Text>
      <Text style={styles.copy}>
        Live map of events, hotspots, and who is actually going — not a feed of fake heat.
      </Text>
      <View style={styles.footer}>
        <Button label="Enter" onPress={() => router.replace('/onboarding')} />
        <Button label="Open map" variant="ghost" onPress={() => router.replace('/(tabs)/map')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, justifyContent: 'flex-end', paddingBottom: 48 },
  kicker: { color: colors.gold, fontWeight: '600', fontSize: 13, marginBottom: 8 },
  logo: {
    color: colors.text,
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 12,
    maxWidth: 280,
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 320,
    fontWeight: '500',
  },
  footer: { marginTop: 36, gap: 10 },
});
