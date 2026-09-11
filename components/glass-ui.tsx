/**
 * UBI Glass UI — dichroic Cupertino glassmorphism kit
 * (additive; does not replace components/ui.tsx)
 *
 * Usage:
 *   import { GlassScreen, GlassCard, GlassButton, GlassChip } from '../components/glass-ui';
 *
 *   <GlassScreen>
 *     <GlassCard intensity="strong">
 *       <GlassButton label="Voy" onPress={...} />
 *     </GlassCard>
 *   </GlassScreen>
 */
import { ReactNode, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, gradients, space, type } from '../lib/theme';

/** Real BlurView on iOS/Android; StyleSheet frost fill elsewhere (web / unsupported). */
const BLUR_NATIVE = Platform.OS === 'ios' || Platform.OS === 'android';
const blurIntensity = (i: 'subtle' | 'medium' | 'strong') =>
  i === 'subtle' ? 22 : i === 'strong' ? 52 : 36;

/* ─── Glass tokens (dichroic indigo/violet) ───────────────────────────────── */

export const glass = {
  fillSubtle: 'rgba(18, 10, 46, 0.38)',
  fillMedium: 'rgba(18, 10, 46, 0.55)',
  fillStrong: 'rgba(18, 10, 46, 0.72)',
  fillLift: 'rgba(79, 107, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.14)',
  borderBlue: 'rgba(79, 107, 255, 0.45)',
  borderViolet: 'rgba(139, 126, 200, 0.40)',
  borderCyan: 'rgba(92, 225, 255, 0.50)',
  /** @deprecated use borderBlue — kept for Barranco-era call sites */
  borderGreen: 'rgba(79, 107, 255, 0.45)',
  /** @deprecated use borderViolet */
  borderGold: 'rgba(139, 126, 200, 0.40)',
  highlight: 'rgba(255, 255, 255, 0.16)',
  glowBlue: colors.electricBlue,
  glowCyan: colors.cyanGlow,
  glowViolet: colors.gold,
  /** @deprecated aliases */
  glowGreen: colors.electricBlue,
  glowGold: colors.gold,
  sheen: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)', 'transparent'] as const,
  radius: {
    sm: 12,
    md: 20,
    lg: 16,
    xl: 20,
    pill: 999,
  },
} as const;

type Intensity = 'subtle' | 'medium' | 'strong';
type GlowTone = 'none' | 'blue' | 'cyan' | 'violet' | 'green' | 'gold';

const fillFor = (i: Intensity) =>
  i === 'subtle' ? glass.fillSubtle : i === 'strong' ? glass.fillStrong : glass.fillMedium;

/* ─── Ambient night screen ────────────────────────────────────────────────── */

export function GlassScreen({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient colors={[...gradients.night]} style={[styles.screen, style]}>
      <View pointerEvents="none" style={styles.ambient}>
        <LinearGradient
          colors={[...gradients.meshViolet]}
          style={styles.blobTL}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={[...gradients.meshBlue]}
          style={styles.blobC}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        {/* R3 austerity: no cyan ambient blob — frost hero is violet/blue only */}
      </View>
      {children}
    </LinearGradient>
  );
}

/* ─── Glass surface / card ────────────────────────────────────────────────── */

export function GlassSurface({
  children,
  intensity = 'medium',
  glow = 'none',
  style,
  blur = true,
}: {
  children?: ReactNode;
  intensity?: Intensity;
  glow?: GlowTone;
  style?: StyleProp<ViewStyle>;
  /** When true (default) use expo-blur on native; StyleSheet fill fallback otherwise */
  blur?: boolean;
}) {
  const g = glow === 'green' ? 'blue' : glow === 'gold' ? 'violet' : glow;
  const glowStyle =
    g === 'blue' ? styles.glowBlue : g === 'cyan' ? styles.glowCyan : g === 'violet' ? styles.glowViolet : null;
  const fill = fillFor(intensity);
  const useBlur = blur && BLUR_NATIVE;

  return (
    <View
      style={[
        styles.surface,
        useBlur ? styles.surfaceBlurHost : { backgroundColor: fill },
        glowStyle,
        style,
      ]}
    >
      {useBlur ? (
        <>
          <BlurView
            intensity={blurIntensity(intensity)}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFillObject, { backgroundColor: fill }]}
          />
        </>
      ) : null}
      <LinearGradient
        colors={[...glass.sheen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.35, y: 0.9 }}
        style={styles.sheen}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

export function GlassCard({
  children,
  intensity = 'medium',
  glow = 'none',
  style,
  blur = true,
}: {
  children?: ReactNode;
  intensity?: Intensity;
  glow?: GlowTone;
  style?: StyleProp<ViewStyle>;
  blur?: boolean;
}) {
  return (
    <GlassSurface intensity={intensity} glow={glow} blur={blur} style={[styles.card, style]}>
      {children}
    </GlassSurface>
  );
}

/** ONE primary frosted sheet — keep glow none; quieter chrome elsewhere */
export function GlassSheet({
  children,
  style,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <GlassSurface intensity="strong" glow="none" style={[styles.sheet, style]}>
      <View style={styles.sheetHandle} />
      {children}
    </GlassSurface>
  );
}

/* ─── Typography ──────────────────────────────────────────────────────────── */

export function GlassSectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
    </View>
  );
}

export function GlassKicker({ children }: { children?: ReactNode }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

export function GlassTitle({ children }: { children?: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

/* ─── Chips / badges ──────────────────────────────────────────────────────── */

export function GlassChip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const bump = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, friction: 6, tension: 220 }).start();

  const body = (
    <Animated.View
      style={[
        styles.chip,
        active && styles.chipActive,
        { transform: [{ scale }] },
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Animated.View>
  );

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => bump(0.94)}
      onPressOut={() => bump(1)}
      accessibilityRole="button"
    >
      {body}
    </Pressable>
  );
}

export function GlassBadge({
  label,
  tone = 'blue',
}: {
  label: string;
  tone?: 'blue' | 'cyan' | 'violet' | 'magenta' | 'alert' | 'green' | 'gold';
}) {
  const t = tone === 'green' ? 'blue' : tone === 'gold' ? 'violet' : tone;
  const toneStyle =
    t === 'cyan'
      ? styles.badgeCyan
      : t === 'violet'
        ? styles.badgeViolet
        : t === 'magenta'
          ? styles.badgeMagenta
          : t === 'alert'
            ? styles.badgeAlert
            : styles.badgeBlue;
  const textStyle =
    t === 'cyan'
      ? styles.badgeTextCyan
      : t === 'violet'
        ? styles.badgeTextViolet
        : t === 'magenta'
          ? styles.badgeTextMagenta
          : t === 'alert'
            ? styles.badgeTextAlert
            : styles.badgeTextBlue;
  return (
    <View style={[styles.badge, toneStyle]}>
      <Text style={[styles.badgeText, textStyle]}>{label}</Text>
    </View>
  );
}

export function GlassPill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

/* ─── Buttons ─────────────────────────────────────────────────────────────── */

type BtnVariant = 'primary' | 'ghost' | 'danger';

export function GlassButton({
  label,
  variant = 'primary',
  style,
  disabled,
  ...props
}: Omit<PressableProps, 'style'> & {
  label: string;
  variant?: BtnVariant;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const bump = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, friction: 5, tension: 240 }).start();

  const inner =
    variant === 'primary' ? (
      <View style={styles.btnPrimary}>
        <Text style={styles.btnPrimaryText}>{label}</Text>
      </View>
    ) : variant === 'danger' ? (
      <View style={styles.btnDanger}>
        <Text style={styles.btnDangerText}>{label}</Text>
      </View>
    ) : (
      <View style={styles.btnGhost}>
        <Text style={styles.btnGhostText}>{label}</Text>
      </View>
    );

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => bump(0.96)}
      onPressOut={() => bump(1)}
      style={[styles.btnWrap, disabled && styles.btnDisabled, style]}
      {...props}
    >
      <Animated.View style={{ transform: [{ scale }], flex: 1 }}>{inner}</Animated.View>
    </Pressable>
  );
}

export function GlassIconButton({
  children,
  onPress,
  style,
}: {
  children?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 220 }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 220 }).start()
      }
    >
      <Animated.View style={[styles.iconBtn, style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ─── Input ───────────────────────────────────────────────────────────────── */

export function GlassInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.dim}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}


/* ─── Tab bar frost (BlurView + StyleSheet fallback) ──────────────────────── */

export function TabBarFrostBackground() {
  if (BLUR_NATIVE) {
    return (
      <View style={styles.tabFrostHost}>
        <BlurView intensity={48} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: glass.fillStrong }]}
        />
      </View>
    );
  }
  return <View style={[styles.tabFrostHost, { backgroundColor: glass.fillStrong }]} />;
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1 },
  ambient: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  blobTL: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 999,
  },
  blobBR: {
    position: 'absolute',
    right: -80,
    bottom: 80,
    width: 260,
    height: 260,
    borderRadius: 999,
  },
  blobC: {
    position: 'absolute',
    top: '38%',
    left: '20%',
    width: 220,
    height: 220,
    borderRadius: 999,
  },

  surface: {
    borderRadius: glass.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0B0620',
        shadowOpacity: 0.28,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  surfaceBlurHost: {
    backgroundColor: 'transparent',
  },
  tabFrostHost: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: glass.radius.md,
    overflow: 'hidden',
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: glass.highlight,
  },
  glowBlue: {
    borderColor: glass.borderBlue,
    shadowColor: glass.glowBlue,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  glowCyan: {
    borderColor: glass.borderCyan,
    shadowColor: glass.glowCyan,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  glowViolet: {
    borderColor: glass.borderViolet,
    shadowColor: glass.glowViolet,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },

  card: {
    padding: space[4],
  },
  sheet: {
    padding: space[4],
    paddingTop: space[2],
    borderTopLeftRadius: glass.radius.xl,
    borderTopRightRadius: glass.radius.xl,
    borderBottomLeftRadius: glass.radius.lg,
    borderBottomRightRadius: glass.radius.lg,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.28)',
    marginBottom: space[3],
  },

  sectionWrap: { gap: space[1] },
  sectionTitle: {
    /* R3 typography: headline on cards (not title3) */
    color: colors.text,
    ...type.headline,
  },
  sectionSub: {
    color: colors.muted,
    ...type.callout,
  },
  kicker: {
    color: colors.gold,
    ...type.caption1,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  title: {
    color: colors.text,
    ...type.title1,
    fontWeight: '700',
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(18,10,46,0.38)',
    borderRadius: glass.radius.pill,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
  },
  chipActive: {
    borderColor: glass.borderBlue,
    backgroundColor: 'rgba(79,107,255,0.18)',
  },
  chipText: { color: colors.muted, ...type.caption1, fontWeight: '600' },
  chipTextActive: { color: colors.text, fontWeight: '700' },

  badge: {
    borderRadius: glass.radius.pill,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderWidth: 1,
  },
  badgeBlue: {
    /* Regular rank — lifted fill + light text for ≥4.5:1 on frost */
    backgroundColor: 'rgba(79,107,255,0.36)',
    borderColor: 'rgba(200,212,255,0.55)',
  },
  badgeCyan: {
    backgroundColor: 'rgba(92,225,255,0.12)',
    borderColor: glass.borderCyan,
  },
  badgeViolet: {
    backgroundColor: 'rgba(139,126,200,0.16)',
    borderColor: glass.borderViolet,
  },
  badgeMagenta: {
    /* Leyenda apex — luminous fill + cyan rim; text #E8E0FF ≥4.5:1 */
    backgroundColor: 'rgba(123,92,255,0.34)',
    borderColor: 'rgba(92,225,255,0.65)',
  },
  badgeAlert: {
    backgroundColor: 'rgba(79,107,255,0.20)',
    borderColor: 'rgba(92,225,255,0.45)',
  },
  badgeText: { ...type.caption1, fontWeight: '700' },
  badgeTextBlue: { color: '#E8ECFF' },
  badgeTextCyan: { color: colors.cyanGlow },
  badgeTextViolet: { color: colors.gold },
  badgeTextMagenta: { color: '#E8E0FF' },
  badgeTextAlert: { color: '#E8ECFF' },

  pill: {
    borderRadius: glass.radius.pill,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
  },
  pillText: { color: colors.text, ...type.caption1, fontWeight: '700' },

  btnWrap: { borderRadius: glass.radius.sm, overflow: 'hidden', minHeight: 48 },
  btnDisabled: { opacity: 0.45 },
  btnPrimary: {
    flex: 1,
    borderRadius: glass.radius.sm,
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.electricBlue,
  },
  btnPrimaryText: { ...type.subhead, fontWeight: '700', color: '#F2F4FF' }, // letterSpacing from type.subhead
  btnGhost: {
    flex: 1,
    borderRadius: glass.radius.sm,
    borderWidth: 1,
    borderColor: glass.borderViolet,
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(42,22,80,0.45)',
  },
  btnGhostText: { ...type.subhead, color: colors.text, fontWeight: '700' },
  btnDanger: {
    flex: 1,
    borderRadius: glass.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,92,122,0.55)',
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,92,122,0.16)',
  },
  btnDangerText: { ...type.subhead, color: colors.alert, fontWeight: '700' },

  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: glass.radius.sm,
    borderWidth: 1,
    borderColor: glass.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: glass.fillMedium,
  },

  input: {
    borderWidth: 1,
    borderColor: glass.borderBlue,
    borderRadius: glass.radius.sm,
    padding: space[4],
    minHeight: 48,
    color: colors.text,
    backgroundColor: 'rgba(11,6,32,0.55)',
    ...type.body,
    fontWeight: '600',
  },
});
