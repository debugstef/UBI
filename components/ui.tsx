/**
 * components/ui.tsx — dichroic Screen/Card wrappers (compat layer over glass-ui)
 * Destination: components/ui.tsx → imports ../lib/theme and ./glass-ui
 */
import { ReactNode } from 'react';
import {
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  GlassScreen,
  GlassCard,
  GlassButton,
  GlassChip,
  GlassSectionTitle,
} from './glass-ui';
import { colors, space, type } from '../lib/theme';

export function Screen({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <GlassScreen style={style}>{children}</GlassScreen>;
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <GlassCard intensity="medium" style={style}>
      {children}
    </GlassCard>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <GlassSectionTitle title={title} subtitle={subtitle} />;
}

export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return <GlassChip label={label} active={active} onPress={onPress} />;
}

export function Button({
  label,
  variant = 'primary',
  style,
  ...props
}: Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: 'primary' | 'ghost' | 'danger';
  style?: StyleProp<ViewStyle>;
}) {
  return <GlassButton label={label} variant={variant} style={style} {...props} />;
}

/** Subtle demo ribbon for pitch screens */
export function DemoBanner({ label = 'Demo data' }: { label?: string }) {
  return (
    <View style={styles.demo} accessibilityRole="text">
      <Text style={styles.demoText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  demo: {
    alignSelf: 'flex-start',
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: 999,
    backgroundColor: 'rgba(92,225,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(92,225,255,0.45)',
  },
  demoText: {
    color: colors.cyanGlow,
    ...type.caption1,
    fontWeight: '600',
  },
});
