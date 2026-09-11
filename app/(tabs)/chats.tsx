/**
 * app/(tabs)/chats.tsx — R3: hidden from tab bar (href:null).
 * Entry: map event sheet "Chat" or deep link /(tabs)/chats.
 */
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  GlassScreen,
  GlassCard,
  GlassKicker,
  GlassTitle,
  GlassButton,
} from '../../components/glass-ui';
import { useEvents } from '../../lib/eventsStore';
import { colors, space, type } from '../../lib/theme';

export default function Chats() {
  const events = useEvents();
  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Chats</GlassKicker>
          <GlassTitle>Cada chat vive en un evento</GlassTitle>
          <Text style={styles.hint}>
            También puedes abrir Chat desde la ficha del mapa.
          </Text>
        </View>
        <GlassButton
          label="Volver al mapa"
          variant="ghost"
          onPress={() => router.push('/(tabs)/map')}
        />
        <View style={styles.list}>
          {events.map((e) => (
            <Pressable key={e.id} onPress={() => router.push(`/chat/${e.id}`)}>
              <GlassCard intensity="medium" glow="none" style={styles.card}>
                <Text style={styles.title}>{e.title}</Text>
                <Text style={styles.p}>
                  {e.district} · Host fijó entrada. Chat expira después del evento.
                </Text>
              </GlassCard>
            </Pressable>
          ))}
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
  hint: { color: colors.muted, ...type.footnote, marginTop: space[1] },
  list: { gap: space[2] },
  card: { gap: space[1] },
  title: { color: colors.text, ...type.headline, fontWeight: '700' },
  p: { color: colors.muted, ...type.callout },
});
