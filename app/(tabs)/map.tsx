import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LiveMap } from '../../components/LiveMap';
import {
  GlassSheet,
  GlassButton,
  GlassChip,
  GlassIconButton,
  GlassBadge,
} from '../../components/glass-ui';
import { stores } from '../../lib/data';
import { useEvents, useSelectedEventId, selectEvent, type UbiEvent } from '../../lib/eventsStore';
import { colors, type, space } from '../../lib/theme';
import { ReputationBadge } from '../../components/profile/ReputationBadge';

const FILTERS = ['Cerca', 'Tendencia', 'Amigos', 'Tiendas', 'Alternas', '18+'] as const;
const SHEET_PAD = 240;

function coolerRank(a: UbiEvent) {
  let score = a.people;
  if (a.activity === 'trending') score += 80;
  if (a.activity === 'lleno') score += 40;
  if (a.activity === 'activo') score -= 10;
  if (a.activity === 'bajo') score -= 20;
  if (a.isLiveNow) score -= 5;
  return score;
}

/**
 * Map — dichroic Cupertino: electricBlue/violet chrome, one frosted sheet.
 */
export default function Map() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Cerca');
  const events = useEvents();
  const [selectedId, setSelectedId] = useState(events[0]?.id ?? '');
  const params = useLocalSearchParams<{ eventId?: string }>();
  const storeSelectedId = useSelectedEventId();

  // R3b: PostCard "Ver en mapa" → fly-to via query param or eventsStore select
  useEffect(() => {
    const fromParam = typeof params.eventId === 'string' ? params.eventId : undefined;
    const target = fromParam || storeSelectedId || undefined;
    if (!target) return;
    const exists = events.some((e) => e.id === target);
    if (!exists) return;
    setActiveFilter('Cerca');
    setQuery('');
    setSelectedId(target);
  }, [params.eventId, storeSelectedId, events]);

  const [radar, setRadar] = useState(0.65);
  const radarRef = useRef(radar);
  radarRef.current = radar;

  const isAlternas = activeFilter === 'Alternas';

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = events.slice();

    if (q === '__quiet__') return [];

    if (q.length > 0) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.district.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q),
      );
    }

    switch (activeFilter) {
      case 'Tendencia':
        list = list.filter((e) => e.activity === 'trending');
        break;
      case 'Amigos':
        // High bar → demo quiet-night empty (friends in data are 4/7/2)
        list = list.filter((e) => e.friends >= 10);
        break;
      case 'Tiendas':
        list = [];
        break;
      case 'Alternas':
        list = list
          .filter((e) => e.activity === 'activo' || e.activity === 'bajo' || !e.isLiveNow)
          .sort((a, b) => a.people - b.people);
        break;
      case '18+':
        list = list.filter((e) => {
          if (typeof e.is18Plus === 'boolean') return e.is18Plus;
          const min = parseInt(e.age.split('-')[0] || '0', 10);
          return min >= 18 || e.age === '18+';
        });
        break;
      case 'Cerca':
      default:
        break;
    }

    return list;
  }, [query, activeFilter]);

  // A5: clear selection when empty
  useEffect(() => {
    if (filteredEvents.length === 0) setSelectedId('');
  }, [filteredEvents.length]);

  const selected = useMemo(() => {
    if (!selectedId) return undefined;
    return filteredEvents.find((e) => e.id === selectedId);
  }, [selectedId, filteredEvents]);

  // Honest LIVE: only isLiveNow
  const liveCount = events.filter((e) => e.isLiveNow).length;
  const isLive = selected?.isLiveNow === true;

  const planBSheetOpen = isAlternas && filteredEvents.length > 0;
  const eventSheetOpen =
    !isAlternas && !!selectedId && filteredEvents.length > 0 && !!selected;
  const sheetOpen = eventSheetOpen || planBSheetOpen;

  const trackH = sheetOpen ? 56 : 96;
  const trackHRef = useRef(trackH);
  trackHRef.current = trackH;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const y = e.nativeEvent.locationY;
        const h = trackHRef.current;
        setRadar(Math.max(0.05, Math.min(1, 1 - y / h)));
      },
      onPanResponderMove: (e) => {
        const y = e.nativeEvent.locationY;
        const h = trackHRef.current;
        setRadar(Math.max(0.05, Math.min(1, 1 - y / h)));
      },
    }),
  ).current;

  const radarLabel =
    radar > 0.75 ? 'Noche' : radar > 0.45 ? 'Zona' : radar > 0.2 ? 'Barrio' : 'Cerca';

  const statusText =
    filteredEvents.length === 0
      ? 'Noche quieta · nada cerca'
      : isAlternas
        ? `Plan B · ${filteredEvents.length} opciones`
        : liveCount === 0
          ? `${events.length} cerca · noche quieta`
          : `${liveCount} en vivo · ${events.length} cerca`;

  const planBAlternatives = useMemo(() => {
    if (!isAlternas) return [];
    return filteredEvents.slice().sort((a, b) => coolerRank(a) - coolerRank(b)).slice(0, 2);
  }, [isAlternas, filteredEvents]);

  const isEmpty = filteredEvents.length === 0;

  return (
    <View style={styles.root}>
      <View style={styles.map}>
        <LiveMap
          events={filteredEvents}
          stores={activeFilter === 'Tiendas' ? stores : stores}
          selectedId={eventSheetOpen ? selectedId : undefined}
          onEventPress={(id) => {
            if (isAlternas) return;
            setSelectedId(id);
            selectEvent(id);
          }}
          sheetOpen={sheetOpen}
          sheetPadBottom={SHEET_PAD}
        />

        <Pressable style={styles.sos} onPress={() => router.push('/sos')}>
          <Text style={styles.sosText}>SOS</Text>
        </Pressable>

        {/* Vertical scrubber — dichroic violet/blue hairline; collapses when sheet */}
        <View
          style={[
            styles.radar,
            sheetOpen ? styles.radarCompact : null,
            { bottom: sheetOpen ? 268 : 120 },
          ]}
        >
          {!sheetOpen ? <Text style={styles.radarTop}>Noche</Text> : null}
          <View style={[styles.radarTrack, { height: trackH }]} {...pan.panHandlers}>
            <View
              style={[styles.radarFill, { height: Math.round(radar * trackH) }]}
            />
            <View
              style={[
                styles.radarThumb,
                { bottom: Math.max(0, Math.round(radar * trackH) - 8) },
              ]}
            />
          </View>
          {!sheetOpen ? <Text style={styles.radarBot}>Cerca</Text> : null}
          <Text style={styles.radarValue}>{radarLabel}</Text>
        </View>
      </View>

      <View style={styles.chrome} pointerEvents="box-none">
        <View style={styles.searchRow}>
          <View style={styles.searchPill}>
            <Ionicons name="search" size={16} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Fiesta o zona…"
              placeholderTextColor={colors.dim}
              style={styles.searchInput}
            />
          </View>
          <GlassIconButton onPress={() => router.push('/layers')} style={styles.layersBtn}>
            <Ionicons name="layers" size={20} color={colors.champagne} />
          </GlassIconButton>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.status}>{statusText}</Text>
          <Text style={styles.statusCity}>Lima</Text>
        </View>

        {/* A5: compact status-slot CTAs (not a modal) */}
        {isEmpty ? (
          <View style={styles.statusSlot}>
            <Pressable
              onPress={() => {
                setRadar(0.9);
                setActiveFilter('Cerca');
                setQuery('');
                setSelectedId(events[0]?.id ?? '');
              }}
              hitSlop={8}
            >
              <Text style={styles.statusSlotCta}>Ampliar radar</Text>
            </Pressable>
            <Text style={styles.statusSlotSep}>|</Text>
            <Pressable onPress={() => router.push('/plan-b')} hitSlop={8}>
              <Text style={styles.statusSlotCta}>Plan B</Text>
            </Pressable>
          </View>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((f) => (
            <GlassChip
              key={f}
              label={f}
              active={activeFilter === f}
              onPress={() => {
                setActiveFilter(f);
                if (f === 'Amigos' || f === 'Tiendas' || f === 'Alternas') {
                  setSelectedId('');
                }
              }}
            />
          ))}
        </ScrollView>
      </View>

      {/* A6 Plan B first-class sheet */}
      {planBSheetOpen ? (
        <View style={styles.sheetWrap}>
          <GlassSheet style={styles.sheet}>
            <View style={{ gap: 4 }}>
              <Text style={styles.sheetKicker}>PLAN B</Text>
              <Text style={styles.sheetTitle}>Cerca, menos calor, o con tus amigos</Text>
              <Text style={styles.sheetMeta}>
                Si el spot se llenó o se apagó, mira opciones más suaves.
              </Text>
            </View>
            {planBAlternatives.length > 0 ? (
              <View style={styles.altList}>
                {planBAlternatives.map((e) => (
                  <Pressable
                    key={e.id}
                    style={styles.altRow}
                    onPress={() => router.push(`/event/${e.id}`)}
                  >
                    <Text style={styles.altRowTitle} numberOfLines={1}>
                      {e.title}
                    </Text>
                    <Text style={styles.altRowMeta}>
                      {e.district} · {e.people}+
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <GlassButton
                label="Ver opciones"
                variant="primary"
                onPress={() => router.push('/plan-b')}
              />
            )}
          </GlassSheet>
        </View>
      ) : eventSheetOpen && selected ? (
        <View style={styles.sheetWrap}>
          <GlassSheet style={styles.sheet}>
            <View style={styles.sheetTop}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.sheetKicker}>
                  {selected.district} · {selected.distance}
                </Text>
                <Text style={styles.sheetTitle}>{selected.title}</Text>
                <Text style={styles.sheetMeta}>
                  {selected.people}+ · {selected.music.join(' / ')} · S/ {selected.price}
                </Text>
              </View>
              {isLive ? <GlassBadge label="LIVE" tone="cyan" /> : null}
            </View>
            {selected.hostId ? (
              <View style={styles.hostRow}>
                <Text style={styles.hostLabel}>Host</Text>
                <ReputationBadge userId={selected.hostId} compact />
              </View>
            ) : null}
            <View style={styles.sheetActions}>
              <GlassButton
                label="Voy"
                variant="primary"
                style={[styles.flex, isLive ? styles.voyLive : undefined]}
                onPress={() => router.push(`/event/${selected.id}`)}
              />
              <GlassButton
                label="Chat"
                variant="ghost"
                style={styles.flex}
                onPress={() => router.push(`/chat/${selected.id}`)}
              />
              <GlassButton
                label="Plan B"
                variant="ghost"
                style={styles.flex}
                onPress={() => router.push(`/plan-b?from=${selected.id}`)}
              />
            </View>
          </GlassSheet>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1 },
  sos: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(11,6,32,0.88)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  sosText: { fontWeight: '700', color: colors.muted, fontSize: 12 },
  radar: {
    position: 'absolute',
    right: 10,
    bottom: 120,
    width: 48,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(79,107,255,0.40)',
  },
  radarCompact: {
    width: 36,
    paddingVertical: 6,
    gap: 2,
  },
  radarTop: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  radarBot: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  radarTrack: {
    width: 10,
    height: 96,
    borderRadius: 999,
    backgroundColor: 'rgba(42,22,80,0.55)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  radarFill: {
    width: '100%',
    backgroundColor: 'rgba(79,107,255,0.65)',
    borderRadius: 999,
  },
  radarThumb: {
    position: 'absolute',
    left: -3,
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: colors.electricBlue,
    borderWidth: 2,
    borderColor: colors.background,
  },
  radarValue: {
    color: colors.champagne,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  chrome: {
    position: 'absolute',
    top: 48,
    left: 12,
    right: 60,
    gap: 8,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(18, 10, 46, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    ...type.footnote,
    fontWeight: '600',
    padding: 0,
  },
  layersBtn: {
    backgroundColor: 'rgba(18, 10, 46, 0.72)',
    width: 44,
    height: 44,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  status: {
    color: colors.text,
    ...type.subhead,
  },
  statusCity: {
    color: colors.gold,
    ...type.caption2,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  statusSlotCta: {
    color: colors.electricBlue,
    ...type.caption1,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusSlotSep: {
    color: colors.dim,
    ...type.caption1,
    fontWeight: '600',
  },
  chips: { gap: 8, paddingVertical: 2, paddingRight: 12 },
  sheetWrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 96,
  },
  sheet: { gap: space[3] },
  sheetTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sheetKicker: {
    color: colors.gold,
    ...type.caption1,
    fontWeight: '500',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  sheetTitle: {
    color: colors.text,
    ...type.title1,
    fontWeight: '700',
  },
  sheetMeta: { color: colors.muted, ...type.footnote },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[1],
  },
  hostLabel: {
    color: colors.muted,
    ...type.caption1,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sheetActions: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  /** Cyan edge on LIVE Voy only — not rainbow */
  voyLive: {
    borderWidth: 1.5,
    borderColor: colors.cyanGlow,
  },
  altList: { gap: 8 },
  altRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(42,22,80,0.45)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
    gap: 2,
  },
  altRowTitle: {
    color: colors.text,
    ...type.subhead,
    fontWeight: '700',
  },
  altRowMeta: {
    color: colors.muted,
    ...type.caption1,
  },
});
