/**
 * app/(tabs)/create.tsx
 * Dual mode: social PostComposer + event form that WRITES to eventsStore
 */
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  GlassScreen,
  GlassCard,
  GlassChip,
  GlassInput,
  GlassButton,
  GlassKicker,
  GlassTitle,
  GlassSectionTitle,
} from '../../components/glass-ui';
import { PostComposer } from '../../components/posts/PostComposer';
import { useSocial } from '../../lib/social/useSocial';
import { addEvent, useEvents, type UbiEvent } from '../../lib/eventsStore';
import { colors, space, type } from '../../lib/theme';

const TYPES = ['Reu', 'Previa', 'Discoteca', 'Concierto', 'Rooftop', 'After'] as const;
const DISTRICTS = ['Barranco', 'Miraflores', 'San Isidro', 'Surco', 'La Molina'] as const;

type Mode = 'post' | 'event' | 'story';

export default function Create() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const initial: Mode =
    params.mode === 'story' ? 'story' : params.mode === 'event' ? 'event' : 'post';
  const [mode, setMode] = useState<Mode>(initial);
  const [type, setType] = useState<string>('Previa');
  const [district, setDistrict] = useState<string>('Barranco');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isPrivate, setPrivate] = useState(false);
  const [is18Plus, set18Plus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<UbiEvent | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyPlaceEventId, setStoryPlaceEventId] = useState<string | null>(null);
  const [storyDone, setStoryDone] = useState(false);
  const [postDone, setPostDone] = useState(false);
  const { addStorySlide } = useSocial();
  const events = useEvents();
  const storyPlace = useMemo(
    () => events.find((e) => e.id === storyPlaceEventId),
    [events, storyPlaceEventId],
  );

  const validate = () => {
    if (!title.trim()) return 'Ponle un nombre al plan.';
    if (!type) return 'Elige un tipo.';
    if (!district) return 'Elige un distrito.';
    if (price.trim() !== '' && Number.isNaN(Number(price))) return 'Precio inválido.';
    return null;
  };

  const publish = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setPublishing(true);
    const priceNum = price.trim() === '' ? 0 : Number(price);
    const event = addEvent({
      title: title.trim(),
      type,
      district,
      price: priceNum,
      isPrivate,
      is18Plus,
    });
    setPublished(event);
    setPublishing(false);
  };

  const resetEventForm = () => {
    setPublished(null);
    setTitle('');
    setPrice('');
    setPrivate(false);
    set18Plus(false);
    setDraftSaved(false);
    setError(null);
  };

  return (
    <GlassScreen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GlassKicker>Crear</GlassKicker>
          <GlassTitle>Publicar o armar plan</GlassTitle>
          <Text style={styles.sub}>
            Publicación, historia o plan.
          </Text>
        </View>

        <View style={styles.modeRow}>
          <GlassChip
            label="Publicación"
            active={mode === 'post'}
            onPress={() => {
              setMode('post');
              setPostDone(false);
            }}
          />
          <GlassChip
            label="Historia"
            active={mode === 'story'}
            onPress={() => {
              setMode('story');
              setStoryDone(false);
            }}
          />
          <GlassChip
            label="Evento"
            active={mode === 'event'}
            onPress={() => {
              setMode('event');
              setPublished(null);
            }}
          />
        </View>

        {mode === 'story' ? (
          storyDone ? (
            <GlassCard intensity="medium" glow="none" style={styles.successCard}>
              <Text style={styles.successKicker}>Listo</Text>
              <Text style={styles.successTitle}>Historia publicada</Text>
              <Text style={styles.successBody}>
                Tu anillo aparece en Feed. Ábrela desde Historias.
              </Text>
              <GlassButton label="Ver Feed" onPress={() => router.push('/(tabs)/feed')} />
              <GlassButton
                label="Otra historia"
                variant="ghost"
                onPress={() => {
                  setStoryDone(false);
                  setStoryCaption('');
                  setStoryPlaceEventId(null);
                }}
              />
            </GlassCard>
          ) : (
            <GlassCard intensity="medium" glow="none" style={styles.card}>
              <GlassSectionTitle
                title="Nueva historia"
                subtitle="Aparece en el anillo del Feed. No abre el viewer automáticamente."
              />
              <GlassInput
                value={storyCaption}
                onChangeText={setStoryCaption}
                placeholder="Caption de la historia"
                accessibilityLabel="Caption historia"
              />
              <View style={styles.placeBlock}>
                <Text style={styles.placeLabel}>Lugar (opcional)</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.placeRow}
                >
                  <GlassChip
                    label="Sin lugar"
                    active={!storyPlaceEventId}
                    onPress={() => setStoryPlaceEventId(null)}
                  />
                  {events.slice(0, 6).map((e) => (
                    <GlassChip
                      key={e.id}
                      label={e.title}
                      active={storyPlaceEventId === e.id}
                      onPress={() => setStoryPlaceEventId(e.id)}
                    />
                  ))}
                </ScrollView>
              </View>
              <GlassButton
                label="Publicar historia"
                onPress={() => {
                  addStorySlide({
                    caption: storyCaption.trim() || 'Nueva historia',
                    tint: '#7B5CFF',
                    eventId: storyPlaceEventId,
                    placeLabel: storyPlace
                      ? `${storyPlace.title} · ${storyPlace.district}`
                      : null,
                  });
                  setStoryCaption('');
                  setStoryPlaceEventId(null);
                  setStoryDone(true);
                }}
              />
            </GlassCard>
          )
        ) : mode === 'post' ? (
          postDone ? (
            <GlassCard intensity="medium" glow="none" style={styles.successCard}>
              <Text style={styles.successKicker}>Listo</Text>
              <Text style={styles.successTitle}>Publicación lista</Text>
              <Text style={styles.successBody}>
                Suma al eje Publicaciones. Ya está en el Feed.
              </Text>
              <GlassButton label="Ver Feed" onPress={() => router.push('/(tabs)/feed')} />
              <GlassButton
                label="Escribir otra"
                variant="ghost"
                onPress={() => setPostDone(false)}
              />
            </GlassCard>
          ) : (
            <PostComposer onPublished={() => setPostDone(true)} />
          )
        ) : published ? (
          <GlassCard intensity="medium" glow="none" style={styles.successCard}>
            <Text style={styles.successKicker}>Publicado en el mapa</Text>
            <Text style={styles.successTitle}>{published.title}</Text>
            <Text style={styles.successBody}>
              {published.isPrivate
                ? `Solo se muestra Cerca de ${published.district}. Dirección exacta oculta.`
                : `Visible en ${published.district}. Ya aparece en el mapa (Chat desde la ficha).`}
            </Text>
            <Text style={styles.successMeta}>
              {published.type} · {published.district}
              {published.price > 0 ? ` · S/ ${published.price}` : ' · Gratis'}
            </Text>
            <GlassButton
              label="Ver mapa"
              onPress={() => router.push('/(tabs)/map')}
            />
            <GlassButton label="Crear otro" variant="ghost" onPress={resetEventForm} />
          </GlassCard>
        ) : (
          <>
            <GlassSectionTitle title="Tipo" subtitle="Reu, previa, discoteca, rooftop…" />
            <View style={styles.chips}>
              {TYPES.map((t) => (
                <GlassChip key={t} label={t} active={type === t} onPress={() => setType(t)} />
              ))}
            </View>

            <GlassSectionTitle title="Distrito" subtitle="Zona visible en el mapa." />
            <View style={styles.chips}>
              {DISTRICTS.map((d) => (
                <GlassChip
                  key={d}
                  label={d}
                  active={district === d}
                  onPress={() => setDistrict(d)}
                />
              ))}
            </View>

            <GlassCard intensity="medium" glow="none" style={styles.card}>
              <GlassSectionTitle title="Detalles" />
              <GlassInput
                value={title}
                onChangeText={(t: string) => {
                  setTitle(t);
                  if (error) setError(null);
                }}
                placeholder="Nombre del plan"
                accessibilityLabel="Nombre del plan"
              />
              <GlassInput
                value={price}
                onChangeText={setPrice}
                placeholder="Precio / aporte (S/) — 0 = gratis"
                keyboardType="numeric"
                accessibilityLabel="Precio"
              />

              <View style={styles.toggleRow}>
                <View style={styles.toggleCopy}>
                  <Text style={styles.toggleTitle}>Privado</Text>
                  <Text style={styles.toggleHint}>
                    {isPrivate
                      ? `Solo se muestra “Cerca de ${district}”. La dirección exacta queda oculta.`
                      : 'Si lo activas, la dirección exacta no se publica.'}
                  </Text>
                </View>
                <Switch
                  value={isPrivate}
                  onValueChange={setPrivate}
                  trackColor={{ false: 'rgba(255,255,255,0.14)', true: colors.electricBlue }}
                  thumbColor="#F2F4FF"
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleCopy}>
                  <Text style={styles.toggleTitle}>18+</Text>
                  <Text style={styles.toggleHint}>
                    Solo si hay alcohol o acceso restringido. No bloquea el resto de la app.
                  </Text>
                </View>
                <Switch
                  value={is18Plus}
                  onValueChange={(v: boolean) => {
                    set18Plus(v);
                    if (v) router.push('/verify-18');
                  }}
                  trackColor={{ false: 'rgba(255,255,255,0.14)', true: colors.electricBlue }}
                  thumbColor="#F2F4FF"
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </GlassCard>

            <View style={styles.actions}>
              <GlassButton
                label={publishing ? 'Publicando…' : 'Publicar evento'}
                variant="primary"
                disabled={publishing}
                onPress={publish}
              />
              <GlassButton
                label={draftSaved ? 'Borrador guardado' : 'Guardar borrador'}
                variant="ghost"
                onPress={() => setDraftSaved(true)}
              />
            </View>
          </>
        )}
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
  header: { gap: space[1], marginBottom: space[2] },
  sub: { color: colors.muted, ...type.callout, marginTop: space[1] },
  modeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  card: { gap: space[3] },
  successCard: { gap: space[3] },
  successKicker: {
    color: colors.gold,
    ...type.caption1,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  placeBlock: { gap: space[2] },
  placeLabel: { color: colors.muted, ...type.caption1 },
  placeRow: { gap: space[2], paddingRight: space[4] },
  successTitle: { color: colors.text, ...type.title2 },
  successBody: { color: colors.muted, ...type.callout },
  successMeta: { color: colors.text, ...type.footnote, fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[1],
  },
  toggleCopy: { flex: 1, gap: space[1] },
  toggleTitle: { color: colors.text, ...type.subhead },
  toggleHint: { color: colors.muted, ...type.footnote },
  error: { color: colors.alert, ...type.footnote, fontWeight: '600' },
  actions: { gap: space[3], marginTop: space[1] },
});
