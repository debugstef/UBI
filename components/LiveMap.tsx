import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { UbiEvent, UbiStore } from '../lib/types';
import { colors } from '../lib/theme';

const GENRE: Record<string, { fill: string; shape: string }> = {
  Discoteca: { fill: colors.neonGreen, shape: 'diamond' },
  Previa: { fill: colors.gold, shape: 'circle' },
  Rooftop: { fill: colors.electricBlue, shape: 'tri' },
  Concierto: { fill: colors.magenta, shape: 'square' },
  After: { fill: colors.champagne, shape: 'square' },
  Reu: { fill: colors.muted, shape: 'circle' },
};

type HeatBand = 'soft' | 'mid' | 'hot';

function heatBandFromCommits(voyCommits: number): HeatBand {
  if (voyCommits >= 13) return 'hot';
  if (voyCommits >= 4) return 'mid';
  return 'soft';
}

/** Heat rings from voyCommits only — ethics: no fake “pulse” live. */
function markHtml(
  shape: string,
  fill: string,
  selected: boolean,
  heatBand: HeatBand,
  dimmed: boolean,
) {
  const size = selected ? 18 : 14;
  const showRing = selected || heatBand === 'mid' || heatBand === 'hot';
  const inset = heatBand === 'hot' ? -7 : -5;
  const ringOp = heatBand === 'hot' ? 0.35 : heatBand === 'mid' ? 0.28 : selected ? 0.28 : 0;
  const ring =
    showRing && ringOp > 0
      ? `<span style="position:absolute;inset:${inset}px;border-radius:999px;border:1.5px solid ${fill};opacity:${ringOp}"></span>`
      : heatBand === 'soft' && selected
        ? `<span style="position:absolute;inset:-4px;border-radius:999px;border:1px solid ${fill};opacity:.18"></span>`
        : '';

  let inner = '';
  if (shape === 'circle') {
    inner = `<span style="width:${size}px;height:${size}px;border-radius:999px;background:${fill};display:block"></span>`;
  } else if (shape === 'square') {
    inner = `<span style="width:${size}px;height:${size}px;border-radius:2px;background:${fill};display:block"></span>`;
  } else if (shape === 'diamond') {
    inner = `<span style="width:${size * 0.85}px;height:${size * 0.85}px;background:${fill};display:block;transform:rotate(45deg)"></span>`;
  } else {
    inner = `<span style="width:0;height:0;border-left:${size / 2}px solid transparent;border-right:${size / 2}px solid transparent;border-bottom:${size}px solid ${fill};display:block"></span>`;
  }

  const opacity = dimmed ? 0.45 : 1;
  return `<div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:rgba(12,11,10,.82);border-radius:999px;border:1px solid rgba(255,255,255,.18);cursor:pointer;opacity:${opacity}">${ring}${inner}</div>`;
}

function loadLeaflet(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  const w = window as any;
  if (w.L) return Promise.resolve(w.L);

  return new Promise((resolve, reject) => {
    if (!document.getElementById('ubi-leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'ubi-leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const existing = document.getElementById('ubi-leaflet-js');
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).L));
      return;
    }
    const script = document.createElement('script');
    script.id = 'ubi-leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error('leaflet load failed'));
    document.head.appendChild(script);
  });
}

function WebLeafletMap({
  events,
  stores,
  selectedId,
  onEventPress,
  sheetOpen = false,
  sheetPadBottom = 240,
}: {
  events: UbiEvent[];
  stores: UbiStore[];
  selectedId?: string;
  onEventPress?: (id: string) => void;
  sheetOpen?: boolean;
  sheetPadBottom?: number;
}) {
  const containerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const onPressRef = useRef(onEventPress);
  onPressRef.current = onEventPress;
  const sheetOpenRef = useRef(sheetOpen);
  sheetOpenRef.current = sheetOpen;
  const sheetPadRef = useRef(sheetPadBottom);
  sheetPadRef.current = sheetPadBottom;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = await loadLeaflet();
        if (cancelled || !containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView([-12.12, -77.03], 13);

        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 16,
          },
        ).addTo(map);

        mapRef.current = map;
        setTimeout(() => map.invalidateSize(), 100);
      } catch (e) {
        console.warn(e);
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  // Sheet-open: pad map container so selected pin sits in clear band
  useEffect(() => {
    const el = containerRef.current as HTMLElement | null;
    if (!el) return;
    el.style.paddingBottom = sheetOpen ? `${sheetPadBottom}px` : '0px';
    el.style.boxSizing = 'border-box';
    const m = mapRef.current;
    if (m) {
      setTimeout(() => m.invalidateSize(), 60);
    }
  }, [sheetOpen, sheetPadBottom]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await loadLeaflet();
      for (let i = 0; i < 20 && !mapRef.current; i++) {
        await new Promise((r) => setTimeout(r, 50));
      }
      const m = mapRef.current;
      if (!m || cancelled) return;

      const keep = new Set<string>();
      const open = sheetOpenRef.current;
      const pad = sheetPadRef.current;

      for (const e of events) {
        keep.add(e.id);
        const g = GENRE[e.type] ?? { fill: colors.neonGreen, shape: 'circle' };
        const selected = e.id === selectedId;
        const heat = heatBandFromCommits(e.voyCommits ?? 0);
        const dimmed = open && !selected;
        const hit = selected ? 44 : 28;
        const icon = L.divIcon({
          className: 'ubi-pin',
          html: markHtml(g.shape, g.fill, selected, heat, dimmed),
          iconSize: [hit, hit],
          iconAnchor: [hit / 2, hit / 2],
        });

        // Non-selected under sheet: not interactive to prevent mis-taps
        const interactive = selected || !open;

        const existing = markersRef.current[e.id];
        if (existing) {
          existing.setLatLng([e.latitude, e.longitude]);
          existing.setIcon(icon);
          existing.setZIndexOffset(selected ? 600 : 0);
          if (typeof existing.options !== 'undefined') {
            existing.options.interactive = interactive;
            existing.options.riseOnHover = true;
          }
          // Leaflet: toggle interaction via DOM pointer-events when possible
          const el = existing.getElement?.();
          if (el) {
            el.style.pointerEvents = interactive ? 'auto' : 'none';
          }
        } else {
          const marker = L.marker([e.latitude, e.longitude], {
            icon,
            interactive,
            riseOnHover: true,
          }).addTo(m);
          marker.on('click', () => onPressRef.current?.(e.id));
          markersRef.current[e.id] = marker;
        }
      }

      for (const s of stores) {
        const sid = `store-${s.id}`;
        keep.add(sid);
        const html = `<div style="width:20px;height:20px;border-radius:4px;background:rgba(95,115,100,.25);border:1px solid ${colors.storeGreen};display:flex;align-items:center;justify-content:center;color:${colors.storeGreen};font-size:12px;font-weight:700">+</div>`;
        const icon = L.divIcon({
          className: 'ubi-store',
          html,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        // Stores non-interactive when sheet open (under-sheet hit hygiene)
        const storeInteractive = !open;
        if (markersRef.current[sid]) {
          markersRef.current[sid].setLatLng([s.latitude, s.longitude]);
          markersRef.current[sid].setIcon(icon);
          const el = markersRef.current[sid].getElement?.();
          if (el) el.style.pointerEvents = storeInteractive ? 'auto' : 'none';
        } else {
          markersRef.current[sid] = L.marker([s.latitude, s.longitude], {
            icon,
            interactive: storeInteractive,
          }).addTo(m);
        }
      }

      for (const id of Object.keys(markersRef.current)) {
        if (!keep.has(id)) {
          m.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      }

      if (selectedId && markersRef.current[selectedId]) {
        const latlng = markersRef.current[selectedId].getLatLng();
        m.setView(latlng, m.getZoom(), { animate: true });
        // Lift pin above sheet band
        if (open && pad > 0) {
          setTimeout(() => {
            if (!mapRef.current) return;
            mapRef.current.panBy([0, -Math.round(pad / 3)], { animate: true });
            setTimeout(() => mapRef.current?.invalidateSize(), 80);
          }, 120);
        } else {
          setTimeout(() => m.invalidateSize(), 80);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [events, stores, selectedId, sheetOpen, sheetPadBottom]);

  return React.createElement('div', {
    ref: containerRef,
    style: {
      width: '100%',
      height: '100%',
      background: colors.background,
      boxSizing: 'border-box',
    },
  });
}

export function LiveMap({
  events,
  stores,
  selectedId,
  onEventPress,
  sheetOpen = false,
  sheetPadBottom = 240,
}: {
  events: UbiEvent[];
  stores: UbiStore[];
  selectedId?: string;
  onEventPress?: (id: string) => void;
  sheetOpen?: boolean;
  sheetPadBottom?: number;
}) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrap}>
        <WebLeafletMap
          events={events}
          stores={stores}
          selectedId={selectedId}
          onEventPress={onEventPress}
          sheetOpen={sheetOpen}
          sheetPadBottom={sheetPadBottom}
        />
      </View>
    );
  }

  return (
    <View style={styles.fallback}>
      <Text style={styles.osm}>Map available on web preview</Text>
      <Text style={styles.hint}>Open localhost to pan pins with the map.</Text>
    </View>
  );
}

export function MapOverlay() {
  return null;
}

const styles = StyleSheet.create({
  webWrap: { flex: 1, overflow: 'hidden' },
  fallback: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  osm: { color: colors.text, fontWeight: '700', fontSize: 16 },
  hint: { color: colors.muted, fontWeight: '500', textAlign: 'center' },
});
