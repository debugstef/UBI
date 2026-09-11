/**
 * app/chat/[id].tsx — thread bubbles + reu card; no real PII
 */
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  GlassScreen,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassBadge,
  GlassKicker,
  GlassTitle,
} from '../../components/glass-ui';
import { events } from '../../lib/data';
import { colors, space, type } from '../../lib/theme';

type Msg = { id: string; from: 'host' | 'peer' | 'me' | 'system'; name: string; text: string };

const SEED: Msg[] = [
  {
    id: '1',
    from: 'host',
    name: 'Host',
    text: 'Entrada por lista hasta 11:30. Cover S/30. Traigan DNI.',
  },
  {
    id: '2',
    from: 'peer',
    name: 'Mica',
    text: '¿Cómo está la cola?',
  },
  {
    id: '3',
    from: 'peer',
    name: 'Alex',
    text: 'Entra rápido, ~10 min. Nos vemos en la esquina del distrito.',
  },
  {
    id: '4',
    from: 'system',
    name: 'UBI',
    text: 'Este chat expira después del evento. Sin números de teléfono en el hilo.',
  },
];

export default function ChatThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = events.find((x) => x.id === id) || events[0];
  const [draft, setDraft] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>(SEED);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { id: String(Date.now()), from: 'me', name: 'Tú', text: t },
    ]);
    setDraft('');
  };

  return (
    <GlassScreen style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Chats
        </Text>
        <GlassKicker>Chat temporal</GlassKicker>
        <GlassTitle>{e.title}</GlassTitle>
        <Text style={styles.meta}>
          {e.isPrivate ? `Near ${e.district}` : e.district} · sin PII
        </Text>
      </View>

      {/* Reu / event card message */}
      <GlassCard intensity="medium" glow="violet" style={styles.reu}>
        <View style={styles.reuRow}>
          <Text style={styles.reuTitle}>{e.title}</Text>
          <GlassBadge label={e.type} tone="violet" />
        </View>
        <Text style={styles.reuMeta}>
          {e.isPrivate ? `Near ${e.district}` : `${e.district} · ${e.distance}`} ·{' '}
          {e.price === 0 ? 'Gratis' : `S/ ${e.price}`}
        </Text>
        <Text style={styles.reuHint}>Tarjeta del plan · dirección exacta no aparece aquí</Text>
      </GlassCard>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {msgs.map((m) => {
          const mine = m.from === 'me';
          const system = m.from === 'system';
          return (
            <View
              key={m.id}
              style={[
                styles.bubble,
                mine && styles.bubbleMine,
                system && styles.bubbleSystem,
              ]}
            >
              {!system ? <Text style={styles.user}>{m.name}</Text> : null}
              <Text style={[styles.text, system && styles.systemText]}>{m.text}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.composer}>
        <View style={styles.row}>
          <GlassButton label="SOS" variant="danger" style={styles.smallBtn} onPress={() => router.push('/sos')} />
          <GlassButton
            label="Plan B"
            variant="ghost"
            style={styles.smallBtn}
            onPress={() => router.push({ pathname: '/plan-b', params: { from: e.id } })}
          />
        </View>
        <GlassInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe algo…"
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <GlassButton label="Enviar" onPress={send} />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 52, paddingHorizontal: space[4] },
  header: { gap: space[1], marginBottom: space[3] },
  back: { color: colors.electricBlue, ...type.subhead },
  meta: { color: colors.dim, ...type.caption1 },
  reu: { gap: space[2], marginBottom: space[3] },
  reuRow: { flexDirection: 'row', justifyContent: 'space-between', gap: space[2] },
  reuTitle: { color: colors.text, ...type.headline, flex: 1 },
  reuMeta: { color: colors.muted, ...type.footnote },
  reuHint: { color: colors.gold, ...type.caption1 },
  list: { flex: 1 },
  listContent: { gap: space[2], paddingBottom: space[3] },
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '88%',
    backgroundColor: 'rgba(18,10,46,0.72)',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    gap: 4,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(79,107,255,0.22)',
    borderColor: 'rgba(79,107,255,0.45)',
  },
  bubbleSystem: {
    alignSelf: 'center',
    backgroundColor: 'rgba(42,22,80,0.45)',
    borderColor: 'rgba(139,126,200,0.35)',
  },
  user: { color: colors.electricBlue, ...type.caption1, fontWeight: '700' },
  text: { color: colors.text, ...type.callout },
  systemText: { color: colors.muted, textAlign: 'center', ...type.footnote },
  composer: { gap: space[2], paddingBottom: space[6], paddingTop: space[2] },
  row: { flexDirection: 'row', gap: space[2] },
  smallBtn: { flex: 1 },
});
