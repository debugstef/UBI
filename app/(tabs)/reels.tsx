/**
 * app/(tabs)/reels.tsx
 */
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { ReelsFeed } from '../../components/reels/ReelsFeed';
import { colors } from '../../lib/theme';

const TAB_BAR_APPROX = 84;

export default function ReelsScreen() {
  const { height } = useWindowDimensions();
  const itemHeight = Math.max(480, height - TAB_BAR_APPROX);

  return (
    <View style={styles.root}>
      <ReelsFeed itemHeight={itemHeight} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.deepIndigo },
});
