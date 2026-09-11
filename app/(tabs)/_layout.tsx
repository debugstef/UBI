/**
 * app/(tabs)/_layout.tsx — dichroic floating tab bar ≤5 tabs (map-first)
 * R3: Chats folded into map event sheet (+ deep route kept hidden).
 * TabBarFrostBackground = expo-blur BlurView on native, StyleSheet fallback.
 */
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { colors, space, type } from '../../lib/theme';
import { glass, TabBarFrostBackground } from '../../components/glass-ui';

const ICON = 22;
const NARROW = 390;

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const showLabels = Platform.OS !== 'web' && width >= NARROW;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.electricBlue,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarShowLabel: showLabels,
        tabBarBackground: () => <TabBarFrostBackground />,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="map" color={color} size={ICON} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="flame" color={color} size={ICON} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Crear',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="add-circle" color={color} size={ICON + 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="film" color={color} size={ICON} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="person" color={color} size={ICON} />,
        }}
      />
      {/* R3: fold Chats out of tab bar — still routable via map sheet / deep link */}
      <Tabs.Screen
        name="chats"
        options={{
          href: null,
          title: 'Chats',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: space[3],
    right: space[3],
    bottom: space[2],
    height: 64,
    borderRadius: glass.radius.md,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
    paddingBottom: space[2],
    paddingTop: space[2],
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.deepIndigo,
        shadowOpacity: 0.28,
        shadowRadius: space[2], // 8 — 4pt (was odd 10)
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  item: {
    minHeight: 44,
    paddingVertical: space[1],
  },
  label: {
    ...type.caption2,
    fontWeight: '500',
    marginTop: 0,
  },
});
