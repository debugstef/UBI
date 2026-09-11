/**
 * lib/social/mockUsers.ts
 */
import type { UserSocial } from './types';
import { computeScore } from './score';

const raw: UserSocial[] = [
  {
    id: 'u-stef',
    name: 'Stefano',
    handle: '@stef',
    avatarInitial: 'S',
    avatarColor: '#4F6BFF',
    bio: 'Barranco / Miraflores · House + Reggaetón',
    district: 'Barranco',
    following: false,
    isCurrentUser: true,
    activity: { connections: 14, posts: 6, stories: 4, reactions: 38 },
  },
  {
    id: 'u-vale',
    name: 'Valentina',
    handle: '@vale.rmx',
    avatarInitial: 'V',
    avatarColor: '#7B5CFF',
    bio: 'DJ sets · Miraflores rooftops',
    district: 'Miraflores',
    following: false,
    activity: { connections: 28, posts: 12, stories: 9, reactions: 120 },
  },
  {
    id: 'u-nico',
    name: 'Nico',
    handle: '@nico.waves',
    avatarInitial: 'N',
    avatarColor: '#5CE1FF',
    bio: 'Surf + afters · Barranco',
    district: 'Barranco',
    following: true,
    activity: { connections: 9, posts: 3, stories: 2, reactions: 22 },
  },
  {
    id: 'u-lia',
    name: 'Lia',
    handle: '@lia.neon',
    avatarInitial: 'L',
    avatarColor: '#8B7EC8',
    bio: 'Fotografía nocturna · Surco',
    district: 'Surco',
    following: false,
    activity: { connections: 18, posts: 8, stories: 11, reactions: 64 },
  },
  {
    id: 'u-marco',
    name: 'Marco',
    handle: '@marco.club',
    avatarInitial: 'M',
    avatarColor: '#3D1F6E',
    bio: 'Promoter · San Isidro',
    district: 'San Isidro',
    following: false,
    activity: { connections: 42, posts: 20, stories: 15, reactions: 210 },
  },
  {
    id: 'u-sofia',
    name: 'Sofía',
    handle: '@sofi.glow',
    avatarInitial: 'S',
    avatarColor: '#7B5CFF',
    bio: 'Fashion + previas · La Molina',
    district: 'La Molina',
    following: true,
    activity: { connections: 6, posts: 2, stories: 1, reactions: 14 },
  },
];

export const CURRENT_USER_ID = 'u-stef';

export function enrichUser(u: UserSocial): UserSocial {
  const { total, rank } = computeScore(u.activity);
  return { ...u, score: total, rank };
}

export const MOCK_USERS: UserSocial[] = raw.map(enrichUser);

export function getUserById(users: UserSocial[], id: string): UserSocial | undefined {
  return users.find((u) => u.id === id);
}
