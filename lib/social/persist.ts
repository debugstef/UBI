/**
 * lib/social/persist.ts — AsyncStorage hydrate/save for social state
 * Key: ubi.social.v1
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReelItem, SocialPost, StoryBundle, UserSocial } from './types';
import { enrichUser, MOCK_USERS, CURRENT_USER_ID } from './mockUsers';
import { MOCK_POSTS } from './mockPosts';
import { MOCK_STORIES } from './mockStories';
import { MOCK_REELS } from './mockReels';

export const SOCIAL_STORAGE_KEY = 'ubi.social.v1';
export const SOCIAL_PERSIST_VERSION = 1 as const;

export type PersistedSocialV1 = {
  version: typeof SOCIAL_PERSIST_VERSION;
  users: UserSocial[];
  posts: SocialPost[];
  stories: StoryBundle[];
  reels: ReelItem[];
  savedAt?: string;
};

export type SocialSeed = {
  users: UserSocial[];
  posts: SocialPost[];
  stories: StoryBundle[];
  reels: ReelItem[];
};

export function seedSocialState(): SocialSeed {
  return {
    users: MOCK_USERS.map((u) => enrichUser({ ...u, activity: { ...u.activity } })),
    posts: MOCK_POSTS.map((p) => ({
      ...p,
      commentThread: p.commentThread.map((c) => ({
        ...c,
        replies: c.replies?.map((r) => ({ ...r })),
      })),
    })),
    stories: MOCK_STORIES.map((s) => ({ ...s, slides: [...s.slides] })),
    reels: MOCK_REELS.map((r) => ({ ...r })),
  };
}

function isScoreBreakdown(x: unknown): boolean {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.connections === 'number' &&
    typeof o.posts === 'number' &&
    typeof o.stories === 'number' &&
    typeof o.reactions === 'number'
  );
}

function sanitizeUsers(raw: unknown): UserSocial[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: UserSocial[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const u = item as Partial<UserSocial>;
    if (typeof u.id !== 'string' || typeof u.name !== 'string') return null;
    if (!isScoreBreakdown(u.activity)) return null;
    out.push(
      enrichUser({
        id: u.id,
        name: u.name,
        handle: typeof u.handle === 'string' ? u.handle : '@user',
        avatarInitial: typeof u.avatarInitial === 'string' ? u.avatarInitial : '?',
        avatarColor: typeof u.avatarColor === 'string' ? u.avatarColor : '#4F6BFF',
        bio: typeof u.bio === 'string' ? u.bio : '',
        district: typeof u.district === 'string' ? u.district : '',
        following: Boolean(u.following),
        isCurrentUser: Boolean(u.isCurrentUser) || u.id === CURRENT_USER_ID,
        activity: {
          connections: Math.max(0, Number((u.activity as UserSocial['activity']).connections) || 0),
          posts: Math.max(0, Number((u.activity as UserSocial['activity']).posts) || 0),
          stories: Math.max(0, Number((u.activity as UserSocial['activity']).stories) || 0),
          reactions: Math.max(0, Number((u.activity as UserSocial['activity']).reactions) || 0),
        },
      }),
    );
  }
  if (!out.some((u) => u.id === CURRENT_USER_ID)) return null;
  return out;
}

function sanitizePosts(raw: unknown): SocialPost[] | null {
  if (!Array.isArray(raw)) return null;
  const out: SocialPost[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const p = item as Partial<SocialPost>;
    if (typeof p.id !== 'string' || typeof p.authorId !== 'string' || typeof p.body !== 'string') {
      return null;
    }
    out.push({
      id: p.id,
      authorId: p.authorId,
      body: p.body,
      mediaUri: p.mediaUri ?? null,
      mediaUris: Array.isArray(p.mediaUris)
        ? p.mediaUris.filter((u): u is string => typeof u === 'string')
        : undefined,
      mediaTint: typeof p.mediaTint === 'string' ? p.mediaTint : undefined,
      linkPreview: p.linkPreview ?? null,
      eventId: typeof p.eventId === 'string' ? p.eventId : p.eventId === null ? null : undefined,
      placeLabel: typeof p.placeLabel === 'string' ? p.placeLabel : p.placeLabel === null ? null : undefined,
      likes: Math.max(0, Number(p.likes) || 0),
      comments: Math.max(0, Number(p.comments) || 0),
      shares: Math.max(0, Number(p.shares) || 0),
      saves: Math.max(0, Number(p.saves) || 0),
      liked: Boolean(p.liked),
      saved: Boolean(p.saved),
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date().toISOString(),
      commentThread: Array.isArray(p.commentThread) ? (p.commentThread as SocialPost['commentThread']) : [],
    });
  }
  return out;
}

function sanitizeStories(raw: unknown): StoryBundle[] | null {
  if (!Array.isArray(raw)) return null;
  const out: StoryBundle[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const s = item as Partial<StoryBundle>;
    if (typeof s.userId !== 'string' || !Array.isArray(s.slides)) return null;
    out.push({
      userId: s.userId,
      viewed: Boolean(s.viewed),
      slides: s.slides as StoryBundle['slides'],
    });
  }
  return out;
}

function sanitizeReels(raw: unknown): ReelItem[] | null {
  if (!Array.isArray(raw)) return null;
  const out: ReelItem[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const r = item as Partial<ReelItem>;
    if (typeof r.id !== 'string' || typeof r.authorId !== 'string') return null;
    out.push({
      id: r.id,
      authorId: r.authorId,
      caption: typeof r.caption === 'string' ? r.caption : '',
      audioLabel: typeof r.audioLabel === 'string' ? r.audioLabel : 'Audio',
      tint: typeof r.tint === 'string' ? r.tint : '#2A1650',
      likes: Math.max(0, Number(r.likes) || 0),
      comments: Math.max(0, Number(r.comments) || 0),
      shares: Math.max(0, Number(r.shares) || 0),
      liked: Boolean(r.liked),
      videoUri: r.videoUri ?? null,
    });
  }
  return out;
}

export function parsePersistedSocial(raw: string | null): SocialSeed | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<PersistedSocialV1>;
    if (data.version !== SOCIAL_PERSIST_VERSION) return null;
    const users = sanitizeUsers(data.users);
    const posts = sanitizePosts(data.posts);
    const stories = sanitizeStories(data.stories);
    const reels = sanitizeReels(data.reels);
    if (!users || !posts || !stories || !reels) return null;
    return { users, posts, stories, reels };
  } catch {
    return null;
  }
}

export async function loadSocialState(): Promise<SocialSeed> {
  try {
    const raw = await AsyncStorage.getItem(SOCIAL_STORAGE_KEY);
    const parsed = parsePersistedSocial(raw);
    if (parsed) return parsed;
  } catch {
    // AsyncStorage missing / web private mode — fall through to seed
  }
  return seedSocialState();
}

export async function saveSocialState(state: SocialSeed): Promise<void> {
  const blob: PersistedSocialV1 = {
    version: SOCIAL_PERSIST_VERSION,
    users: state.users,
    posts: state.posts,
    stories: state.stories,
    reels: state.reels,
    savedAt: new Date().toISOString(),
  };
  try {
    await AsyncStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(blob));
  } catch {
    // ignore quota / unavailable storage
  }
}

export async function clearSocialState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SOCIAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}
