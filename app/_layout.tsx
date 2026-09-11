import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../lib/theme';
import { SocialProvider } from '../lib/social/SocialProvider';

export default function RootLayout() {
  return (
    <SocialProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="story/[userId]"
          options={{ presentation: 'fullScreenModal', headerShown: false }}
        />
      </Stack>
    </SocialProvider>
  );
}
