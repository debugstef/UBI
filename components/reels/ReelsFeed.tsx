/**
 * components/reels/ReelsFeed.tsx — vertical paging snap FlatList
 */
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { ReelPlayer } from './ReelPlayer';
import { useSocial } from '../../lib/social/useSocial';
import { colors, space, type } from '../../lib/theme';
import type { ReelItem } from '../../lib/social/types';

const { height: SCREEN_H } = Dimensions.get('window');

type Props = {
  itemHeight?: number;
};

export function ReelsFeed({ itemHeight = SCREEN_H }: Props) {
  const { reels } = useSocial();
  const [activeId, setActiveId] = useState(reels[0]?.id);
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 80 }).current;

  const onViewable = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.item as ReelItem | undefined;
    if (first) setActiveId(first.id);
  }, []);

  if (reels.length === 0) {
    return (
      <View style={[styles.root, styles.emptyWrap]}>
        <Text style={styles.emptyTitle}>Sin reels por ahora</Text>
        <Text style={styles.emptyBody}>
          Cuando haya clips de la noche, aparecerán aquí en vertical.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={reels}
        keyExtractor={(item: ReelItem) => item.id}
        renderItem={({ item }: { item: ReelItem }) => <ReelPlayer reel={item} height={itemHeight} />}
        pagingEnabled
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        disableIntervalMomentum
        getItemLayout={(_data: ArrayLike<ReelItem> | null | undefined, index: number) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={viewConfig}
        windowSize={3}
        extraData={activeId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0620' },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[6],
    gap: space[2],
  },
  emptyTitle: { color: colors.text, ...type.headline, textAlign: 'center' },
  emptyBody: { color: colors.muted, ...type.callout, textAlign: 'center' },
});
