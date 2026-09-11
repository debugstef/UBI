/**
 * components/posts/PostComposer.tsx
 * Quieter hierarchy (headline, not title3). Single preview surface.
 * Optional place chip from useEvents() — map↔social bridge.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  GlassButton,
  GlassCard,
  GlassChip,
  GlassKicker,
  glass,
} from '../glass-ui';
import { colors, space, type } from '../../lib/theme';
import { useSocial } from '../../lib/social/useSocial';
import { useEvents } from '../../lib/eventsStore';

const URL_RE = /(https?:\/\/[^\s]+)/i;
const TOKEN_RE = /(#[\wáéíóúñÁÉÍÓÚÑ]+|@[\w.]+)/g;

function parseLink(body: string): { url: string; title: string; domain: string } | null {
  const m = body.match(URL_RE);
  if (!m) return null;
  const url = m[1];
  try {
    const u = new URL(url);
    return {
      url,
      title: u.hostname,
      domain: u.hostname,
    };
  } catch {
    return { url, title: 'Enlace', domain: 'link' };
  }
}

function HighlightPreview({ text }: { text: string }) {
  const parts = useMemo(() => {
    const out: { t: string; kind: 'text' | 'tag' | 'mention' }[] = [];
    let last = 0;
    const re = new RegExp(TOKEN_RE);
    let m: RegExpExecArray | null;
    const src = text || '';
    while ((m = re.exec(src))) {
      if (m.index > last) out.push({ t: src.slice(last, m.index), kind: 'text' });
      out.push({
        t: m[0],
        kind: m[0].startsWith('#') ? 'tag' : 'mention',
      });
      last = m.index + m[0].length;
    }
    if (last < src.length) out.push({ t: src.slice(last), kind: 'text' });
    if (!out.length) out.push({ t: src || ' ', kind: 'text' });
    return out;
  }, [text]);

  return (
    <Text style={styles.previewText}>
      {parts.map((p, i) => (
        <Text
          key={`${i}-${p.t}`}
          style={
            p.kind === 'tag'
              ? styles.tag
              : p.kind === 'mention'
                ? styles.mention
                : undefined
          }
        >
          {p.t}
        </Text>
      ))}
    </Text>
  );
}

function isDisplayableUri(uri: string | null | undefined): boolean {
  if (!uri) return false;
  if (/^mock:\/\//i.test(uri)) return false;
  return /^(file:|content:|https?:|blob:|data:)/i.test(uri);
}

type Props = {
  onPublished?: () => void;
  embedded?: boolean;
};

export function PostComposer({ onPublished, embedded = false }: Props) {
  const { createPost } = useSocial();
  const events = useEvents();
  const [body, setBody] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [mediaTint, setMediaTint] = useState<string>('#2A1650');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [placeEventId, setPlaceEventId] = useState<string | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const inputH = useRef(new Animated.Value(88)).current;

  const linkPreview = useMemo(() => parseLink(body), [body]);
  const selectedEvent = useMemo(
    () => events.find((e) => e.id === placeEventId),
    [events, placeEventId],
  );

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: uploadProgress,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [uploadProgress, progressAnim]);

  const runUploadProgress = (uris: string[], tint: string) => {
    setUploading(true);
    setUploadProgress(0);
    setMediaTint(tint);
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + 10 + Math.floor(Math.random() * 14));
      setUploadProgress(p);
      if (p >= 100) {
        setMediaUri(uris[0] ?? null);
        setMediaUris(uris);
        setUploading(false);
        return;
      }
      setTimeout(tick, 70);
    };
    tick();
  };

  const fallbackMockPick = (reason?: string) => {
    const tintPool = ['#2A1650', '#4F6BFF', '#7B5CFF', '#0B0620', '#3D1F6E'];
    const tint = tintPool[Math.floor(Math.random() * tintPool.length)];
    const mock = `mock://media/upload-${Date.now()}`;
    if (Platform.OS === 'web' && reason) {
      Alert.alert('Foto (web)', reason);
    }
    runUploadProgress([mock], tint);
  };

  const pickImage = async () => {
    if (uploading) return;
    try {
      if (Platform.OS !== 'web') {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            'Permiso necesario',
            'Activa el acceso a la galería para adjuntar fotos.',
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 4,
        quality: 0.85,
        exif: false,
      });

      if (result.canceled || !result.assets?.length) return;

      const uris = result.assets
        .map((a) => a.uri)
        .filter((u): u is string => typeof u === 'string' && u.length > 0);
      if (!uris.length) {
        fallbackMockPick('No se obtuvo URI de imagen.');
        return;
      }
      const tintPool = ['#2A1650', '#4F6BFF', '#7B5CFF', '#0B0620', '#3D1F6E'];
      const tint = tintPool[Math.floor(Math.random() * tintPool.length)];
      runUploadProgress(uris, tint);
    } catch {
      fallbackMockPick(
        Platform.OS === 'web'
          ? 'El selector no está disponible aquí; usamos vista previa simulada.'
          : 'No se pudo abrir la galería; vista previa simulada.',
      );
    }
  };

  const clearMedia = () => {
    setMediaUri(null);
    setMediaUris([]);
    setUploadProgress(0);
  };

  const publish = () => {
    const trimmed = body.trim();
    if (!trimmed && !mediaUri) return;
    createPost({
      body: trimmed || ' ',
      mediaUri,
      mediaUris: mediaUris.length ? mediaUris : undefined,
      mediaTint,
      linkPreview,
      eventId: placeEventId,
      placeLabel: selectedEvent
        ? `${selectedEvent.title} · ${selectedEvent.district}`
        : null,
    });
    setBody('');
    clearMedia();
    setPlaceEventId(null);
    onPublished?.();
  };

  const onContentSize = (h: number) => {
    const next = Math.min(200, Math.max(88, h));
    Animated.timing(inputH, {
      toValue: next,
      duration: 120,
      useNativeDriver: false,
    }).start();
  };

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const previewUris = mediaUris.length ? mediaUris : mediaUri ? [mediaUri] : [];
  // Show token highlight only when no link card (kills dual "Vista previa")
  const showTokenHighlight = body.trim().length > 0 && !linkPreview;

  const inner = (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <GlassKicker>Publicación</GlassKicker>
        <Text style={styles.headline}>¿Qué está pasando?</Text>
        <Text style={styles.sub}>Hashtags, menciones, foto y lugar opcional.</Text>
      </View>

      <View style={styles.inputShell}>
        <Animated.View style={{ minHeight: inputH }}>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Escribe con #tags y @menciones…"
            placeholderTextColor={colors.dim}
            multiline
            style={styles.input}
            onContentSizeChange={(e: any) => onContentSize(e.nativeEvent.contentSize.height)}
            accessibilityLabel="Componer publicación"
          />
        </Animated.View>
        {showTokenHighlight ? (
          <View style={styles.highlightBox}>
            <HighlightPreview text={body} />
          </View>
        ) : null}
      </View>

      {linkPreview ? (
        <View style={styles.linkCard}>
          <Text style={styles.linkDomain}>{linkPreview.domain}</Text>
          <Text style={styles.linkTitle} numberOfLines={1}>
            {linkPreview.url}
          </Text>
        </View>
      ) : null}

      <View style={styles.placeBlock}>
        <Text style={styles.placeLabel}>Lugar (opcional)</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.placeRow}
        >
          <GlassChip
            label="Sin lugar"
            active={!placeEventId}
            onPress={() => setPlaceEventId(null)}
          />
          {events.slice(0, 6).map((e) => (
            <GlassChip
              key={e.id}
              label={e.title}
              active={placeEventId === e.id}
              onPress={() => setPlaceEventId(e.id)}
            />
          ))}
        </ScrollView>
      </View>

      {(uploading || mediaUri) && (
        <View style={styles.mediaBox}>
          {mediaUri && !uploading ? (
            <View style={styles.mediaRow}>
              {previewUris.slice(0, 4).map((uri) =>
                isDisplayableUri(uri) ? (
                  <Image key={uri} source={{ uri }} style={styles.mediaImage} />
                ) : (
                  <View
                    key={uri}
                    style={[styles.mediaThumb, { backgroundColor: mediaTint }]}
                  >
                    <Text style={styles.mediaLabel}>Media lista</Text>
                  </View>
                ),
              )}
              <Pressable onPress={clearMedia} hitSlop={12} accessibilityRole="button">
                <Text style={styles.clearMedia}>Quitar</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.uploadWrap}>
              <Text style={styles.uploadLabel}>Subiendo… {uploadProgress}%</Text>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: barWidth }]} />
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.actions}>
        <GlassButton
          label="Publicar"
          onPress={publish}
          disabled={(!body.trim() && !mediaUri) || uploading}
          style={styles.publishBtn}
        />
        <Pressable
          onPress={() => {
            void pickImage();
          }}
          style={styles.mediaBtn}
          accessibilityRole="button"
          accessibilityLabel="Añadir foto"
          disabled={uploading}
          hitSlop={8}
        >
          <Text style={styles.mediaBtnText}>
            {uploading ? 'Subiendo…' : 'Foto'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  if (embedded) return inner;
  return (
    <GlassCard intensity="medium" glow="none" style={styles.card}>
      {inner}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: space[3] },
  wrap: { gap: space[3] },
  head: { gap: space[1] },
  headline: { color: colors.text, ...type.headline },
  sub: { color: colors.muted, ...type.footnote },
  inputShell: {
    borderWidth: 1,
    borderColor: glass.borderBlue,
    borderRadius: glass.radius.sm,
    backgroundColor: 'rgba(11,6,32,0.55)',
    padding: space[3],
    gap: space[2],
  },
  input: {
    color: colors.text,
    ...type.body,
    fontWeight: '500',
    minHeight: 88,
    textAlignVertical: 'top',
    padding: 0,
  },
  highlightBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: glass.border,
    paddingTop: space[2],
  },
  previewText: { color: colors.text, ...type.callout },
  tag: { color: colors.electricBlue, fontWeight: '700' },
  mention: { color: colors.electricBlue, fontWeight: '700' },
  linkCard: {
    borderRadius: glass.radius.sm,
    borderWidth: 1,
    borderColor: glass.borderViolet,
    backgroundColor: 'rgba(42,22,80,0.45)',
    padding: space[3],
    gap: space[1],
  },
  linkDomain: { color: colors.muted, ...type.caption1 },
  linkTitle: { color: colors.text, ...type.footnote },
  placeBlock: { gap: space[2] },
  placeLabel: { color: colors.muted, ...type.caption1 },
  placeRow: { gap: space[2], paddingRight: space[4] },
  mediaBox: { gap: space[2] },
  mediaRow: { gap: space[2] },
  mediaImage: {
    width: '100%',
    height: 160,
    borderRadius: glass.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.borderBlue,
    backgroundColor: colors.twilightViolet,
  },
  mediaThumb: {
    height: 120,
    borderRadius: glass.radius.sm,
    borderWidth: 1,
    borderColor: glass.borderBlue,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
  mediaLabel: { color: colors.text, ...type.subhead },
  clearMedia: { color: colors.muted, ...type.footnote, fontWeight: '700' },
  uploadWrap: { gap: space[2] },
  uploadLabel: { color: colors.muted, ...type.footnote },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.electricBlue,
  },
  actions: { flexDirection: 'row', gap: space[3], alignItems: 'center' },
  publishBtn: { flex: 1, minHeight: 48 },
  mediaBtn: {
    borderRadius: glass.radius.sm,
    borderWidth: 1,
    borderColor: glass.borderViolet,
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    backgroundColor: 'rgba(42,22,80,0.45)',
    minHeight: 48,
    justifyContent: 'center',
  },
  mediaBtnText: { color: colors.text, ...type.footnote, fontWeight: '700' },
});
