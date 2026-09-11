/**
 * lib/eventsStore.ts — mutable map/chats event catalog (local/mock)
 * Create writes here so map + chats consumers see new events.
 */
import { useEffect, useState, useCallback } from 'react';

export type UbiEvent = {
  id: string;
  title: string;
  type: string;
  district: string;
  distance: string;
  description: string;
  latitude: number;
  longitude: number;
  activity: 'bajo' | 'activo' | 'lleno' | 'trending';
  people: number;
  music: string[];
  price: number;
  age: string;
  friends: number;
  lastStory: number;
  voyCommits: number;
  isLiveNow: boolean;
  isPrivate?: boolean;
  is18Plus?: boolean;
  /** social user id of host — map sheet reputation chip */
  hostId?: string;
};

type Listener = (events: UbiEvent[]) => void;

const SEED: UbiEvent[] = [
  {
    id: 'glow-barranco',
    title: 'Glow Night Barranco',
    type: 'Discoteca',
    district: 'Barranco',
    distance: '2.4 km',
    description:
      'Reggaetón, house y ambiente neón. Alta actividad, historias recientes y chat activo para coordinar entrada.',
    latitude: -12.1499,
    longitude: -77.0217,
    activity: 'trending',
    people: 140,
    music: ['Reggaetón', 'House'],
    price: 30,
    age: '19-24',
    friends: 4,
    lastStory: 7,
    voyCommits: 18,
    isLiveNow: true,
    hostId: 'u-marco',
  },
  {
    id: 'previa-miraflores',
    title: 'Previa Miraflores',
    type: 'Previa',
    district: 'Miraflores',
    distance: '1.1 km',
    description:
      'Previa semiabierta antes de salir. Buena para coordinar grupo y moverse luego a un hotspot.',
    latitude: -12.1214,
    longitude: -77.0307,
    activity: 'activo',
    people: 35,
    music: ['Urbano', 'Pop'],
    price: 0,
    age: '18-23',
    friends: 7,
    lastStory: 12,
    voyCommits: 6,
    isLiveNow: true,
    hostId: 'u-vale',
  },
  {
    id: 'rooftop-san-isidro',
    title: 'Rooftop San Isidro',
    type: 'Rooftop',
    district: 'San Isidro',
    distance: '3.8 km',
    description:
      'Plan premium con vista, cocktails y música house/latin. Ideal como Plan B elegante.',
    latitude: -12.0976,
    longitude: -77.0365,
    activity: 'lleno',
    people: 82,
    music: ['House', 'Latin'],
    price: 50,
    age: '21-28',
    friends: 2,
    lastStory: 18,
    voyCommits: 14,
    isLiveNow: false,
    hostId: 'u-lia',
  },
];

let catalog: UbiEvent[] = SEED.map((e) => ({ ...e }));
const listeners = new Set<Listener>();

/** Cross-screen map selection (PostCard "Ver en mapa", deep links). */
type SelectListener = (id: string | null) => void;
let selectedEventId: string | null = null;
const selectListeners = new Set<SelectListener>();

function emitSelect() {
  selectListeners.forEach((l) => l(selectedEventId));
}

export function selectEvent(id: string | null) {
  selectedEventId = id;
  emitSelect();
}

export function getSelectedEventId(): string | null {
  return selectedEventId;
}

export function useSelectedEventId(): string | null {
  const [id, setId] = useState<string | null>(() => selectedEventId);
  useEffect(() => {
    selectListeners.add(setId);
    setId(selectedEventId);
    return () => {
      selectListeners.delete(setId);
    };
  }, []);
  return id;
}


function emit() {
  const snap = catalog.slice();
  listeners.forEach((l) => l(snap));
}

export function getEvents(): UbiEvent[] {
  return catalog.slice();
}

export function subscribeEvents(listener: Listener): () => void {
  listeners.add(listener);
  listener(catalog.slice());
  return () => {
    listeners.delete(listener);
  };
}

export type CreateEventInput = {
  title: string;
  type: string;
  district: string;
  price: number;
  isPrivate: boolean;
  is18Plus?: boolean;
};

/** District centroids (mock) so new pins land near the right zona. */
const DISTRICT_COORDS: Record<string, { latitude: number; longitude: number }> = {
  Barranco: { latitude: -12.1499, longitude: -77.0217 },
  Miraflores: { latitude: -12.1214, longitude: -77.0307 },
  'San Isidro': { latitude: -12.0976, longitude: -77.0365 },
  Surco: { latitude: -12.135, longitude: -76.995 },
  'La Molina': { latitude: -12.078, longitude: -76.945 },
};

export function addEvent(input: CreateEventInput): UbiEvent {
  const coords = DISTRICT_COORDS[input.district] ?? DISTRICT_COORDS.Barranco;
  const jitter = () => (Math.random() - 0.5) * 0.008;
  const event: UbiEvent = {
    id: `evt-${Date.now()}`,
    title: input.title.trim(),
    type: input.type,
    district: input.district,
    distance: 'Cerca',
    description: input.isPrivate
      ? `Plan privado · Cerca de ${input.district}. Dirección exacta oculta.`
      : `Nuevo plan en ${input.district}. Coordinación abierta en el mapa y chats.`,
    latitude: coords.latitude + jitter(),
    longitude: coords.longitude + jitter(),
    activity: 'activo',
    people: 1,
    music: ['Urbano'],
    price: input.price,
    age: input.is18Plus ? '18+' : '16+',
    friends: 0,
    lastStory: 0,
    voyCommits: 1,
    isLiveNow: true,
    isPrivate: input.isPrivate,
    is18Plus: !!input.is18Plus,
    hostId: 'u-stef',
  };
  catalog = [event, ...catalog];
  emit();
  return event;
}

export function useEvents(): UbiEvent[] {
  const [events, setEvents] = useState<UbiEvent[]>(() => getEvents());
  useEffect(() => subscribeEvents(setEvents), []);
  return events;
}

export function useAddEvent() {
  return useCallback((input: CreateEventInput) => addEvent(input), []);
}
