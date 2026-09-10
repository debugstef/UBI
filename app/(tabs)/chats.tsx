import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  GlassScreen,
  GlassCard,
  GlassKicker,
  GlassTitle,
  glass,
} from '../../components/glass-ui';
import { events } from '../../lib/data';
import { colors } from '../../lib/theme';

export default function Chats() {
  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Chats contextuales</GlassKicker>
          <GlassTitle>Cada chat vive en un evento</GlassTitle>
        </View>
        <View style={styles.list}>
          {events.map((e) => (
            <Pressable key={e.id} onPress={() => router.push(`/chat/${e.id}`)}>
              <GlassCard intensity="medium" style={styles.card}>
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
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 14,
  },
  header: { gap: 4, marginBottom: 4 },
  list: { gap: 10 },
  card: { gap: 6 },
  title: { color: colors.neonGreen, fontSize: 17, fontWeight: '800' },
  p: { color: colors.muted, lineHeight: 21, fontWeight: '600' },
});
