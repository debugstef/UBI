/**
 * UBI Glass UI — glassmorphism kit (additive; does not replace components/ui.tsx)
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
import { colors, gradients } from '../lib/theme';

/* ─── Glass tokens (harmonized with lib/theme.ts) ─────────────────────────── */

export const glass = {
  fillSubtle: 'rgba(22, 20, 18, 0.45)',
  fillMedium: 'rgba(18, 16, 14, 0.62)',
  fillStrong: 'rgba(12, 11, 10, 0.78)',
  fillLift: 'rgba(166, 90, 69, 0.07)',
  border: 'rgba(255, 255, 255, 0.12)',
  borderGreen: 'rgba(166, 90, 69, 0.32)',
  borderGold: 'rgba(196, 165, 116, 0.4)',
  highlight: 'rgba(255, 255, 255, 0.16)',
  glowGreen: colors.neonGreen,
  glowGold: colors.gold,
  sheen: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.02)', 'transparent'] as const,
  radius: {
    sm: 14,
    md: 20,
    lg: 16,
    xl: 20,
    pill: 999,
  },
} as const;

type Intensity = 'subtle' | 'medium' | 'strong';

const fillFor = (i: Intensity) =>
  i === 'subtle' ? glass.fillSubtle : i === 'strong' ? glass.fillStrong : glass.fillMedium;

/* ─── Ambient night screen ────────────────────────────────────────────────── */

export function GlassScreen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient colors={[...gradients.night]} style={[styles.screen, style]}>
      <View pointerEvents="none" style={styles.ambient}>
        <LinearGradient
          colors={['rgba(166,90,69,0.05)', 'transparent']}
          style={styles.blobTL}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <LinearGradient
          colors={['rgba(196,165,116,0.05)', 'transparent']}
          style={styles.blobC}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
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
}: {
  children?: ReactNode;
  intensity?: Intensity;
  glow?: 'none' | 'green' | 'gold';
  style?: StyleProp<ViewStyle>;
}) {
  const glowStyle =
    glow === 'green'
      ? styles.glowGreen
      : glow === 'gold'
        ? styles.glowGold
        : null;

  return (
    <View style={[styles.surface, { backgroundColor: fillFor(intensity) }, glowStyle, style]}>
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
}: {
  children?: ReactNode;
  intensity?: Intensity;
  glow?: 'none' | 'green' | 'gold';
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <GlassSurface intensity={intensity} glow={glow} style={[styles.card, style]}>
      {children}
    </GlassSurface>
  );
}

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

export function GlassKicker({ children }: { children: string }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

export function GlassTitle({ children }: { children: string }) {
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

export function GlassBadge({ label, tone = 'green' }: { label: string; tone?: 'green' | 'gold' | 'alert' }) {
  const toneStyle =
    tone === 'gold' ? styles.badgeGold : tone === 'alert' ? styles.badgeAlert : styles.badgeGreen;
  const textStyle =
    tone === 'gold' ? styles.badgeTextGold : tone === 'alert' ? styles.badgeTextAlert : styles.badgeTextGreen;
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
}: PressableProps & { label: string; variant?: BtnVariant }) {
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
  children: ReactNode;
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
    width: 320,
    height: 320,
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
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: glass.highlight,
  },
  glowGreen: {
    borderColor: glass.borderGreen,
    shadowColor: glass.glowGreen,
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
  },
  glowGold: {
    borderColor: glass.borderGold,
    shadowColor: glass.glowGold,
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },

  card: {
    padding: 16,
  },
  sheet: {
    padding: 16,
    paddingTop: 10,
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
    marginBottom: 12,
  },

  sectionWrap: { gap: 4 },
  sectionTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  sectionSub: {
    color: colors.muted,
    lineHeight: 21,
  },
  kicker: {
    color: colors.gold,
    fontWeight: '600',
    letterSpacing: 0.3,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(247,200,115,0.18)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: glass.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: {
    borderColor: glass.borderGreen,
    backgroundColor: 'rgba(166,90,69,0.14)',
  },
  chipText: { color: colors.muted, fontWeight: '800' },
  chipTextActive: { color: colors.text },

  badge: {
    borderRadius: glass.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  badgeGreen: {
    backgroundColor: 'rgba(31,255,168,0.14)',
    borderColor: glass.borderGreen,
  },
  badgeGold: {
    backgroundColor: 'rgba(247,200,115,0.14)',
    borderColor: glass.borderGold,
  },
  badgeAlert: {
    backgroundColor: 'rgba(255,77,109,0.16)',
    borderColor: 'rgba(255,77,109,0.5)',
  },
  badgeText: { fontWeight: '900', fontSize: 12 },
  badgeTextGreen: { color: colors.neonGreen },
  badgeTextGold: { color: colors.gold },
  badgeTextAlert: { color: colors.alert },

  pill: {
    borderRadius: glass.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
  },
  pillText: { color: colors.champagne, fontWeight: '800', fontSize: 12 },

  btnWrap: { borderRadius: 12, overflow: 'hidden', minHeight: 48 },
  btnDisabled: { opacity: 0.45 },
  btnPrimary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neonGreen,
  },
  btnPrimaryText: { fontWeight: '700', color: '#F2EDE6', fontSize: 15, letterSpacing: 0.2 },
  btnGhost: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: glass.borderGold,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247,200,115,0.08)',
  },
  btnGhostText: { color: colors.champagne, fontWeight: '900', fontSize: 15 },
  btnDanger: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.55)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,77,109,0.18)',
  },
  btnDangerText: { color: colors.alert, fontWeight: '900', fontSize: 15 },

  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: glass.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: glass.fillMedium,
  },

  input: {
    borderWidth: 1,
    borderColor: glass.borderGreen,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    backgroundColor: 'rgba(2,8,6,0.45)',
    fontWeight: '600',
  },
});
