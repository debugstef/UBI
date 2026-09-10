import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassScreen, GlassKicker, GlassTitle } from '../../components/glass-ui';
import { StoryCard } from '../../components/StoryCard';
import { events } from '../../lib/data';
import { colors } from '../../lib/theme';

export default function Feed() {
  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Historias para decidir</GlassKicker>
          <GlassTitle>Así está la noche</GlassTitle>
          <Text style={styles.p}>
            El feed no reemplaza al mapa: cada historia vuelve a un evento o lugar.
          </Text>
        </View>
        <View style={styles.list}>
          {events.map((e) => (
            <StoryCard key={e.id} event={e} onPress={() => router.push(`/event/${e.id}`)} />
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
  p: { color: colors.muted, lineHeight: 22, marginTop: 4 },
  list: { gap: 12 },
});
