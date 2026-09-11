/**
 * components/stories/StoryViewer.tsx — full-screen modal story viewer
 * Segmented progress, hold to pause, tap L/R prev/next, mock colored slides.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, space, type } from '../../lib/theme';
import { glass } from '../glass-ui';
import { useSocial } from '../../lib/social/useSocial';

const { width: W, height: H } = Dimensions.get('window');
const DEFAULT_MS = 4500;

type Props = {
  userId: string;
  visible: boolean;
  onClose: () => void;
};

export function StoryViewer({ userId, visible, onClose }: Props) {
  const { stories, getUser, markStoryViewed, reactToStory, users } = useSocial();
  const bundle = stories.find((s) => s.userId === userId);
  const user = getUser(userId);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const raf = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);
  const pausedAt = useRef(0);

  const slides = bundle?.slides ?? [];
  const slide = slides[index];
  const duration = slide?.durationMs ?? DEFAULT_MS;

  const clearTimer = () => {
    if (raf.current) {
      clearInterval(raf.current);
      raf.current = null;
    }
  };

  const goNext = useCallback(() => {
    if (index >= slides.length - 1) {
      markStoryViewed(userId);
      onClose();
      return;
    }
    setIndex((i) => i + 1);
    setProgress(0);
  }, [index, slides.length, markStoryViewed, userId, onClose]);

  const goPrev = useCallback(() => {
    if (index <= 0) {
      setProgress(0);
      return;
    }
    setIndex((i) => i - 1);
    setProgress(0);
  }, [index]);

  useEffect(() => {
    if (!visible) {
      setIndex(0);
      setProgress(0);
      setPaused(false);
      clearTimer();
      return;
    }
  }, [visible, userId]);

  useEffect(() => {
    if (!visible || !slide || paused) {
      clearTimer();
      return;
    }
    startRef.current = Date.now() - (progress / 100) * duration;
    clearTimer();
    raf.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearTimer();
        goNext();
      }
    }, 50);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, index, paused, slide?.id]);

  if (!bundle || !user || !slide) {
    return (
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sin historias</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.close}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  // Order of story bundles for swipe-across users (optional future)
  void users;

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={[styles.root, { backgroundColor: slide.tint }]}>
        {/* Progress segments */}
        <View style={styles.progressRow}>
          {slides.map((s, i) => (
            <View key={s.id} style={styles.segTrack}>
              <View
                style={[
                  styles.segFill,
                  {
                    width:
                      i < index ? '100%' : i === index ? `${progress}%` : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.topBar}>
          <View style={styles.authorRow}>
            <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
              <Text style={styles.avatarText}>{user.avatarInitial}</Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

        {/* Slide content */}
        <View style={styles.slideBody}>
          {slide.videoUri ? (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoLabel}>▶ Video</Text>
              <Text style={styles.videoUri} numberOfLines={1}>
                {slide.videoUri}
              </Text>
            </View>
          ) : (
            <View style={styles.panel} />
          )}
          {slide.caption ? <Text style={styles.caption}>{slide.caption}</Text> : null}
        </View>

        {/* Tap zones */}
        <View style={styles.zones} pointerEvents="box-none">
          <Pressable
            style={styles.zoneLeft}
            onPress={goPrev}
            onLongPress={() => {
              pausedAt.current = progress;
              setPaused(true);
            }}
            onPressOut={() => setPaused(false)}
            delayLongPress={150}
          />
          <Pressable
            style={styles.zoneRight}
            onPress={goNext}
            onLongPress={() => {
              pausedAt.current = progress;
              setPaused(true);
            }}
            onPressOut={() => setPaused(false)}
            delayLongPress={150}
          />
        </View>

        <View style={styles.bottom}>
          <Pressable
            style={styles.reactBtn}
            onPress={() => reactToStory(userId)}
            accessibilityRole="button"
          >
            <Text style={styles.reactText}>♥ Reaccionar</Text>
          </Pressable>
          {paused ? <Text style={styles.paused}>Pausado</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, width: W, height: H },
  empty: {
    flex: 1,
    backgroundColor: colors.deepIndigo,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[3],
  },
  emptyText: { color: colors.muted, ...type.title3 },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingTop: 54,
    paddingHorizontal: space[3],
  },
  segTrack: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  segFill: {
    height: '100%',
    backgroundColor: '#F2F4FF',
    borderRadius: 999,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingTop: space[3],
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: glass.borderBlue,
  },
  avatarText: { color: colors.text, fontWeight: '700' },
  name: { color: colors.text, ...type.subhead },
  close: { color: colors.text, fontSize: 22, fontWeight: '600', padding: space[2] },
  slideBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[6],
    gap: space[4],
  },
  panel: {
    width: '100%',
    height: H * 0.45,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  videoPlaceholder: {
    width: '100%',
    height: H * 0.45,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: glass.borderBlue,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    padding: space[4],
  },
  videoLabel: { color: colors.electricBlue, ...type.title2 },
  videoUri: { color: colors.muted, ...type.caption1 },
  caption: {
    color: colors.text,
    ...type.title3,
    textAlign: 'center',
  },
  zones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    top: 100,
    bottom: 100,
  },
  zoneLeft: { flex: 1 },
  zoneRight: { flex: 1 },
  bottom: {
    paddingBottom: 48,
    paddingHorizontal: space[4],
    alignItems: 'center',
    gap: space[2],
  },
  reactBtn: {
    borderRadius: 999,
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    backgroundColor: 'rgba(18,10,46,0.55)',
    borderWidth: 1,
    borderColor: glass.borderBlue,
  },
  reactText: { color: colors.text, ...type.subhead, fontWeight: '700' },
  paused: { color: colors.champagne, ...type.caption1 },
});
