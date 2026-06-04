import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/ui';
import { colors, gradients } from '../lib/theme';

export default function Splash() {
  return (
    <LinearGradient colors={gradients.night} style={styles.screen}>
      <View style={styles.logoBox}>
        <Text style={styles.logo}>UBI</Text>
        <Text style={styles.mark}>◆</Text>
      </View>
      <Text style={styles.title}>Mapa vivo de la noche</Text>
      <Text style={styles.copy}>Eventos, reus, hotspots, tiendas y coordinación social en tiempo real.</Text>
      <View style={styles.footer}>
        <Button label="Entrar a UBI" onPress={() => router.replace('/onboarding')} />
        <Button label="Ir directo al mapa" variant="ghost" onPress={() => router.replace('/(tabs)/map')} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, justifyContent: 'center' },
  logoBox: { alignItems: 'center', marginBottom: 22 },
  logo: { color: colors.text, fontSize: 104, fontWeight: '900', letterSpacing: -7, textShadowColor: colors.neonGreen, textShadowRadius: 26 },
  mark: { color: colors.gold, marginTop: -22, fontSize: 34, textShadowColor: colors.gold, textShadowRadius: 18 },
  title: { color: colors.text, textAlign: 'center', fontSize: 30, fontWeight: '900' },
  copy: { color: colors.muted, textAlign: 'center', fontSize: 16, lineHeight: 23, marginTop: 10 },
  footer: { position: 'absolute', left: 24, right: 24, bottom: 42, gap: 12 },
});
