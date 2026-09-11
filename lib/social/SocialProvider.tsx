/**
 * lib/social/SocialProvider.tsx — React Context for live score + social interactions
 * Hydrates/persists via AsyncStorage key ubi.social.v1
 */
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  SocialPost,
  SocialState,
  StoryBundle,
  StorySlide,
  ReelItem,
  UserSocial,
  ScoreBreakdown,
} from './types';
import { enrichUser, CURRENT_USER_ID } from './mockUsers';
import {
  clearSocialState,
  loadSocialState,
  saveSocialState,
  seedSocialState,
} from './persist';

function bumpActivity(
  users: UserSocial[],
  userId: string,
  key: keyof ScoreBreakdown,
  delta: number,
): UserSocial[] {
  return users.map((u) => {
    if (u.id !== userId) return u;
    const activity: ScoreBreakdown = {
      ...u.activity,
      [key]: Math.max(0, u.activity[key] + delta),
    };
    return enrichUser({ ...u, activity });
  });
}

export type SocialContextValue = {
  users: UserSocial[];
  posts: SocialPost[];
  stories: StoryBundle[];
  reels: ReelItem[];
  currentUserId: string;
  currentUser: UserSocial;
  hydrated: boolean;
  getUser: (id: string) => UserSocial | undefined;
  toggleFollow: (userId: string) => void;
  createPost: (input: {
    body: string;
    mediaUri?: string | null;
    mediaUris?: string[];
    mediaTint?: string;
    linkPreview?: SocialPost['linkPreview'];
    eventId?: string | null;
    placeLabel?: string | null;
  }) => void;
  togglePostLike: (postId: string) => void;
  togglePostSave: (postId: string) => void;
  addComment: (postId: string, body: string, parentId?: string) => void;
  markStoryViewed: (userId: string) => void;
  reactToStory: (authorId: string) => void;
  addStorySlide: (input?: {
    caption?: string;
    tint?: string;
    mediaUri?: string | null;
    eventId?: string | null;
    placeLabel?: string | null;
  }) => void;
  toggleReelLike: (reelId: string) => void;
  shareReel: (reelId: string) => void;
  followFromReel: (userId: string) => void;
  /** Onboarding: follow 1–2 seed accounts if not already */
  seedOnboardingFollows: (userIds?: string[]) => void;
  resetSocial: () => Promise<void>;
};

export const SocialContext = createContext<SocialContextValue | null>(null);

const PERSIST_DEBOUNCE_MS = 450;

export function SocialProvider({ children }: { children: ReactNode }) {
  const seed = seedSocialState();
  const [users, setUsers] = useState<UserSocial[]>(seed.users);
  const [posts, setPosts] = useState<SocialPost[]>(seed.posts);
  const [stories, setStories] = useState<StoryBundle[]>(seed.stories);
  const [reels, setReels] = useState<ReelItem[]>(seed.reels);
  const [hydrated, setHydrated] = useState(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextPersist = useRef(true);

  const currentUserId = CURRENT_USER_ID;

  useEffect(() => {
    let alive = true;
    (async () => {
      const loaded = await loadSocialState();
      if (!alive) return;
      setUsers(loaded.users);
      setPosts(loaded.posts);
      setStories(loaded.stories);
      setReels(loaded.reels);
      skipNextPersist.current = true;
      setHydrated(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      void saveSocialState({ users, posts, stories, reels });
    }, PERSIST_DEBOUNCE_MS);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [users, posts, stories, reels, hydrated]);

  const getUser = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users],
  );

  const currentUser = useMemo(() => {
    const u = users.find((x) => x.id === currentUserId);
    if (!u) {
      return enrichUser({
        id: currentUserId,
        name: 'Stefano',
        handle: '@stef',
        avatarInitial: 'S',
        avatarColor: '#4F6BFF',
        bio: '',
        district: 'Barranco',
        following: false,
        isCurrentUser: true,
        activity: { connections: 0, posts: 0, stories: 0, reactions: 0 },
      });
    }
    return u;
  }, [users, currentUserId]);

  const toggleFollow = useCallback(
    (userId: string) => {
      if (userId === currentUserId) return;
      setUsers((prev) => {
        const target = prev.find((u) => u.id === userId);
        if (!target) return prev;
        const willFollow = !target.following;
        let next = prev.map((u) =>
          u.id === userId ? enrichUser({ ...u, following: willFollow }) : u,
        );
        next = bumpActivity(next, currentUserId, 'connections', willFollow ? 1 : -1);
        next = bumpActivity(next, userId, 'connections', willFollow ? 1 : -1);
        return next;
      });
    },
    [currentUserId],
  );

  const createPost = useCallback(
    (input: {
      body: string;
      mediaUri?: string | null;
      mediaUris?: string[];
      mediaTint?: string;
      linkPreview?: SocialPost['linkPreview'];
      eventId?: string | null;
      placeLabel?: string | null;
    }) => {
      const id = `p-${Date.now()}`;
      const post: SocialPost = {
        id,
        authorId: currentUserId,
        body: input.body,
        mediaUri: input.mediaUri ?? null,
        mediaUris: input.mediaUris,
        mediaTint: input.mediaTint,
        linkPreview: input.linkPreview ?? null,
        eventId: input.eventId ?? null,
        placeLabel: input.placeLabel ?? null,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        liked: false,
        saved: false,
        createdAt: new Date().toISOString(),
        commentThread: [],
      };
      setPosts((prev) => [post, ...prev]);
      setUsers((prev) => bumpActivity(prev, currentUserId, 'posts', 1));
    },
    [currentUserId],
  );

  const togglePostLike = useCallback(
    (postId: string) => {
      setPosts((prevPosts) => {
        const target = prevPosts.find((p) => p.id === postId);
        if (!target) return prevPosts;
        const liked = !target.liked;
        const authorId = target.authorId;

        setUsers((prevUsers) => {
          let next = bumpActivity(prevUsers, currentUserId, 'reactions', liked ? 1 : -1);
          if (authorId !== currentUserId) {
            next = bumpActivity(next, authorId, 'reactions', liked ? 1 : -1);
          }
          return next;
        });

        return prevPosts.map((p) =>
          p.id === postId
            ? { ...p, liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) }
            : p,
        );
      });
    },
    [currentUserId],
  );

  const togglePostSave = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              saved: !p.saved,
              saves: Math.max(0, p.saves + (p.saved ? -1 : 1)),
            }
          : p,
      ),
    );
  }, []);

  const addComment = useCallback(
    (postId: string, body: string, parentId?: string) => {
      const comment = {
        id: `c-${Date.now()}`,
        authorId: currentUserId,
        body,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [] as SocialPost['commentThread'],
      };
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          if (!parentId) {
            return {
              ...p,
              comments: p.comments + 1,
              commentThread: [...p.commentThread, comment],
            };
          }
          return {
            ...p,
            comments: p.comments + 1,
            commentThread: p.commentThread.map((c) =>
              c.id === parentId
                ? { ...c, replies: [...(c.replies ?? []), comment] }
                : c,
            ),
          };
        }),
      );
      setUsers((prev) => bumpActivity(prev, currentUserId, 'reactions', 1));
    },
    [currentUserId],
  );

  const markStoryViewed = useCallback((userId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.userId === userId ? { ...s, viewed: true } : s)),
    );
  }, []);

  const reactToStory = useCallback(
    (authorId: string) => {
      setUsers((prev) => {
        let next = bumpActivity(prev, currentUserId, 'reactions', 1);
        if (authorId !== currentUserId) {
          next = bumpActivity(next, authorId, 'reactions', 1);
        }
        return next;
      });
    },
    [currentUserId],
  );

  const addStorySlide = useCallback(
    (input?: {
      caption?: string;
      tint?: string;
      mediaUri?: string | null;
      eventId?: string | null;
      placeLabel?: string | null;
    }) => {
      const slide: StorySlide = {
        id: `ss-${Date.now()}`,
        caption: input?.caption ?? 'Nueva historia',
        tint: input?.tint ?? '#4F6BFF',
        videoUri: input?.mediaUri ?? null,
        durationMs: 5000,
        eventId: input?.eventId ?? null,
        placeLabel: input?.placeLabel ?? null,
      };
      setStories((prev) => {
        const idx = prev.findIndex((s) => s.userId === currentUserId);
        if (idx === -1) {
          return [{ userId: currentUserId, viewed: false, slides: [slide] }, ...prev];
        }
        return prev.map((s, i) =>
          i === idx
            ? { ...s, viewed: false, slides: [...s.slides, slide] }
            : s,
        );
      });
      // Strengthen stories score axis (+2 per published slide for demo visibility)
      setUsers((prev) => bumpActivity(prev, currentUserId, 'stories', 2));
    },
    [currentUserId],
  );

  const toggleReelLike = useCallback(
    (reelId: string) => {
      setReels((prevReels) => {
        const target = prevReels.find((r) => r.id === reelId);
        if (!target) return prevReels;
        const liked = !target.liked;
        const authorId = target.authorId;

        setUsers((prevUsers) => {
          let next = bumpActivity(prevUsers, currentUserId, 'reactions', liked ? 1 : -1);
          if (authorId !== currentUserId) {
            next = bumpActivity(next, authorId, 'reactions', liked ? 1 : -1);
          }
          return next;
        });

        return prevReels.map((r) =>
          r.id === reelId
            ? { ...r, liked, likes: Math.max(0, r.likes + (liked ? 1 : -1)) }
            : r,
        );
      });
    },
    [currentUserId],
  );

  const shareReel = useCallback(
    (reelId: string) => {
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId ? { ...r, shares: r.shares + 1 } : r,
        ),
      );
      setUsers((prev) => bumpActivity(prev, currentUserId, 'reactions', 1));
    },
    [currentUserId],
  );

  const followFromReel = useCallback(
    (userId: string) => {
      toggleFollow(userId);
    },
    [toggleFollow],
  );

  const seedOnboardingFollows = useCallback(
    (userIds: string[] = ['u-vale', 'u-nico']) => {
      setUsers((prev) => {
        let next = prev;
        let changed = false;
        for (const userId of userIds) {
          if (userId === currentUserId) continue;
          const target = next.find((u) => u.id === userId);
          if (!target || target.following) continue;
          changed = true;
          next = next.map((u) =>
            u.id === userId ? enrichUser({ ...u, following: true }) : u,
          );
          next = bumpActivity(next, currentUserId, 'connections', 1);
          next = bumpActivity(next, userId, 'connections', 1);
        }
        return changed ? next : prev;
      });
    },
    [currentUserId],
  );

  const resetSocial = useCallback(async () => {
    await clearSocialState();
    const fresh = seedSocialState();
    skipNextPersist.current = true;
    setUsers(fresh.users);
    setPosts(fresh.posts);
    setStories(fresh.stories);
    setReels(fresh.reels);
  }, []);

  const value = useMemo<SocialContextValue>(
    () => ({
      users,
      posts,
      stories,
      reels,
      currentUserId,
      currentUser,
      hydrated,
      getUser,
      toggleFollow,
      createPost,
      togglePostLike,
      togglePostSave,
      addComment,
      markStoryViewed,
      reactToStory,
      addStorySlide,
      toggleReelLike,
      shareReel,
      followFromReel,
      seedOnboardingFollows,
      resetSocial,
    }),
    [
      users,
      posts,
      stories,
      reels,
      currentUserId,
      currentUser,
      hydrated,
      getUser,
      toggleFollow,
      createPost,
      togglePostLike,
      togglePostSave,
      addComment,
      markStoryViewed,
      reactToStory,
      addStorySlide,
      toggleReelLike,
      shareReel,
      followFromReel,
      seedOnboardingFollows,
      resetSocial,
    ],
  );

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export type { SocialState };
