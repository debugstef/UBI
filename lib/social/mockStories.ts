/**
 * lib/social/mockStories.ts
 */
import type { StoryBundle } from './types';

export const MOCK_STORIES: StoryBundle[] = [
  {
    userId: 'u-stef',
    viewed: false,
    slides: [
      {
        id: 'ss-stef-1',
        caption: 'Preparando la noche ✨',
        tint: '#4F6BFF',
        durationMs: 4500,
      },
      {
        id: 'ss-stef-2',
        caption: 'Playlist lista',
        tint: '#2A1650',
        durationMs: 4000,
      },
    ],
  },
  {
    userId: 'u-vale',
    viewed: false,
    slides: [
      {
        id: 'ss-vale-1',
        caption: 'Soundcheck rooftop',
        tint: '#7B5CFF',
        durationMs: 5000,
      },
      {
        id: 'ss-vale-2',
        caption: 'Vista Miraflores',
        tint: '#5CE1FF',
        videoUri: 'mock://video/vale-rooftop',
        durationMs: 6000,
      },
      {
        id: 'ss-vale-3',
        caption: 'Empieza 22:00',
        tint: '#3D1F6E',
        durationMs: 4000,
      },
    ],
  },
  {
    userId: 'u-nico',
    viewed: true,
    slides: [
      {
        id: 'ss-nico-1',
        caption: 'After waves 🌊',
        tint: '#120A2E',
        durationMs: 4000,
      },
    ],
  },
  {
    userId: 'u-lia',
    viewed: false,
    slides: [
      {
        id: 'ss-lia-1',
        caption: 'Neon frames',
        tint: '#8B7EC8',
        durationMs: 4500,
      },
      {
        id: 'ss-lia-2',
        caption: '#Barranco glow',
        tint: '#3D1F6E',
        durationMs: 4500,
      },
    ],
  },
  {
    userId: 'u-marco',
    viewed: false,
    slides: [
      {
        id: 'ss-marco-1',
        caption: 'Lista VIP abierta',
        tint: '#0B0620',
        durationMs: 5000,
      },
    ],
  },
];
