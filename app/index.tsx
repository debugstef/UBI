/**
 * app/index.tsx — dichroic splash + UBI wordmark
 */
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {
  GlassScreen,
  GlassButton,
  GlassKicker,
} from '../components/glass-ui';
import { colors, space, type } from '../lib/theme';

export default function Splash() {
  return (
    <GlassScreen style={styles.screen}>
      <View style={styles.top}>
        <GlassKicker>Lima · tonight</GlassKicker>
      </View>
      <View style={styles.hero}>
        <Text style={styles.logo}>UBI</Text>
        <Text style={styles.title}>Encuentra la noche</Text>
        <Text style={styles.copy}>
          Mapa en vivo de eventos, hotspots y quién va de verdad — sin calor inventado.
        </Text>
      </View>
      <View style={styles.footer}>
        <GlassButton label="Empezar" onPress={() => router.replace('/onboarding')} />
        <GlassButton
          label="Abrir mapa"
          variant="ghost"
          onPress={() => router.replace('/(tabs)/map')}
        />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: space[6],
    paddingBottom: space[12],
    paddingTop: 72,
    justifyContent: 'space-between',
  },
  top: { gap: space[1] },
  hero: { gap: space[3], maxWidth: 340 },
  logo: {
    color: colors.text,
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -2.4,
    lineHeight: 76,
  },
  title: {
    color: colors.text,
    ...type.title1,
    maxWidth: 280,
  },
  copy: {
    color: colors.muted,
    ...type.callout,
    maxWidth: 320,
  },
  footer: { gap: space[3] },
});
