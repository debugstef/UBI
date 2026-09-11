/**
 * lib/data.ts — re-exports live catalog from eventsStore
 * Map / chats should prefer useEvents() for reactivity; getEvents() for one-shot.
 */
export { getEvents, addEvent, subscribeEvents, useEvents, useAddEvent } from './eventsStore';
export type { UbiEvent, CreateEventInput } from './eventsStore';
import { getEvents } from './eventsStore';
import type { UbiStore } from './types';

/** @deprecated Prefer getEvents()/useEvents() — kept for call sites that import { events }. */
export const events = new Proxy([] as ReturnType<typeof getEvents>, {
  get(_t, prop, receiver) {
    const live = getEvents();
    const value = Reflect.get(live, prop, receiver);
    return typeof value === 'function' ? value.bind(live) : value;
  },
});

export const stores: UbiStore[] = [
  {
    id: 'market-barranco',
    name: 'Market 24 Barranco',
    district: 'Barranco',
    distance: '400 m',
    latitude: -12.146,
    longitude: -77.019,
    tags: ['Hielo', 'Agua', 'Snacks', 'Mixers'],
  },
  {
    id: 'grifo-miraflores',
    name: 'Grifo Shop Miraflores',
    district: 'Miraflores',
    distance: '900 m',
    latitude: -12.123,
    longitude: -77.026,
    tags: ['Hielo', 'Vasos', 'Snacks', 'Alcohol 18+'],
  },
  {
    id: 'late-san-isidro',
    name: 'Late Mini San Isidro',
    district: 'San Isidro',
    distance: '1.2 km',
    latitude: -12.099,
    longitude: -77.034,
    tags: ['Agua', 'Mixers', 'Snacks'],
  },
];
