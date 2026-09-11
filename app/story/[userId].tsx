/**
 * app/story/[userId].tsx — modal route wrapping StoryViewer
 */
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StoryViewer } from '../../components/stories/StoryViewer';
import { colors } from '../../lib/theme';

export default function StoryRoute() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [visible, setVisible] = useState(true);
  const id = typeof userId === 'string' ? userId : userId?.[0] ?? '';

  useEffect(() => {
    setVisible(true);
  }, [id]);

  const close = () => {
    setVisible(false);
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/feed');
  };

  return (
    <View style={styles.root}>
      <StoryViewer userId={id} visible={visible} onClose={close} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.deepIndigo },
});
