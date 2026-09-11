/**
 * app/event/[id].tsx — detail + Voy + Plan B + chat; private address masked
 */
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  GlassScreen,
  GlassCard,
  GlassButton,
  GlassBadge,
  GlassKicker,
  GlassTitle,
  GlassSectionTitle,
} from '../../components/glass-ui';
import { events } from '../../lib/data';
import { colors, space, type } from '../../lib/theme';

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = events.find((x) => x.id === id) || events[0];
  const [voy, setVoy] = useState(false);

  const placeLabel = e.isPrivate
    ? `Cerca de ${e.district}`
    : `${e.district} · ${e.distance}`;

  const onVoy = () => {
    if (e.is18Plus && !voy) {
      // Contextual gate — user can still browse; confirm intent
      Alert.alert('18+', 'Este plan marca alcohol / acceso restringido. ¿Continuar?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Voy',
          onPress: () => {
            setVoy(true);
            Alert.alert('Voy', 'Te sumaste. El chat del evento ya está abierto.');
          },
        },
        {
          text: 'Verificar 18+',
          onPress: () => router.push('/verify-18'),
        },
      ]);
      return;
    }
    setVoy((v) => !v);
    if (!voy) Alert.alert('Voy', 'Te sumaste al plan.');
  };

  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Mapa
        </Text>

        <View style={styles.badges}>
          <GlassBadge
            label={e.activity}
            tone={e.activity === 'trending' ? 'cyan' : 'blue'}
          />
          {e.isLiveNow ? <GlassBadge label="Live" tone="cyan" /> : null}
          {e.isPrivate ? <GlassBadge label="Privado" tone="violet" /> : null}
          {e.is18Plus ? <GlassBadge label="18+" tone="violet" /> : null}
        </View>

        <GlassKicker>{e.type}</GlassKicker>
        <GlassTitle>{e.title}</GlassTitle>
        <Text style={styles.meta}>{placeLabel}</Text>

        {e.isPrivate ? (
          <GlassCard intensity="subtle" style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>Dirección exacta oculta</Text>
            <Text style={styles.privacyBody}>
              Este plan es privado. Solo ves el distrito (“Near {e.district}”). El host comparte
              el punto por chat cuando toca.
            </Text>
          </GlassCard>
        ) : null}

        <GlassCard intensity="medium" style={styles.card}>
          <GlassSectionTitle title="Resumen" />
          <Text style={styles.row}>{e.people}+ personas estimadas</Text>
          <Text style={styles.row}>{e.music.join(' / ')}</Text>
          <Text style={styles.row}>{e.price === 0 ? 'Gratis' : `Cover S/ ${e.price}`}</Text>
          <Text style={styles.row}>Edad típica {e.age}</Text>
          <Text style={styles.row}>{e.friends} amigos interesados · {e.voyCommits} Voy</Text>
        </GlassCard>

        <Text style={styles.desc}>{e.description}</Text>

        <View style={styles.actions}>
          <GlassButton label={voy ? 'Voy ✓' : 'Voy'} onPress={onVoy} />
          <GlassButton
            label="Chat"
            variant="ghost"
            onPress={() => router.push(`/chat/${e.id}`)}
          />
          <GlassButton
            label="Plan B"
            variant="ghost"
            onPress={() => router.push({ pathname: '/plan-b', params: { from: e.id } })}
          />
          <GlassButton
            label="SOS / Resolver"
            variant="danger"
            onPress={() => router.push('/sos')}
          />
        </View>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: 58,
    paddingHorizontal: space[5],
    paddingBottom: 120,
    gap: space[3],
  },
  back: { color: colors.electricBlue, ...type.subhead, marginBottom: space[2] },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  meta: { color: colors.muted, ...type.callout, marginTop: -space[1] },
  privacyCard: { gap: space[2] },
  privacyTitle: { color: colors.gold, ...type.subhead },
  privacyBody: { color: colors.muted, ...type.footnote },
  card: { gap: space[2] },
  row: { color: colors.text, ...type.callout, fontWeight: '600' },
  desc: { color: colors.muted, ...type.body },
  actions: { gap: space[3], marginTop: space[2] },
});
