import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../lib/theme';

export function Screen({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={gradients.night} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View>
      <Text style={styles.st}>{title}</Text>
      {subtitle ? <Text style={styles.ss}>{subtitle}</Text> : null}
    </View>
  );
}

export function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.chip, active && styles.chipA]}>
      <Text style={[styles.ct, active && styles.ctA]}>{label}</Text>
    </View>
  );
}

export function Button({
  label,
  variant = 'primary',
  style,
  ...props
}: PressableProps & { label: string; variant?: 'primary' | 'ghost' | 'danger' }) {
  if (variant === 'ghost') {
    return (
      <Pressable style={[styles.ghost, style]} {...props}>
        <Text style={styles.gt}>{label}</Text>
      </Pressable>
    );
  }
  if (variant === 'danger') {
    return (
      <Pressable style={[styles.danger, style]} {...props}>
        <Text style={styles.dt}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable style={[styles.btnWrap, style]} {...props}>
      <View style={styles.btn}>
        <Text style={styles.bt}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(22,20,18,0.9)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 16,
  },
  st: { color: colors.text, fontWeight: '700', fontSize: 17, marginBottom: 5 },
  ss: { color: colors.muted, lineHeight: 21, fontWeight: '500' },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(247,200,115,0.2)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipA: {
    borderColor: colors.neonGreen,
    backgroundColor: 'rgba(166,90,69,0.14)',
  },
  ct: { color: colors.muted, fontWeight: '600' },
  ctA: { color: colors.text },
  btnWrap: { borderRadius: 12, overflow: 'hidden' },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: colors.neonGreen,
  },
  bt: { fontWeight: '700', color: '#F2EDE6' },
  ghost: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderGold,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(247,200,115,0.06)',
  },
  gt: { color: colors.champagne, fontWeight: '700' },
  danger: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,77,109,0.5)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,77,109,0.12)',
  },
  dt: { color: colors.alert, fontWeight: '700' },
});
