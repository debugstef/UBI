/**
 * lib/social/useSocial.ts — Context consumer hooks
 */
import { useContext, useMemo } from 'react';
import { SocialContext, type SocialContextValue } from './SocialProvider';
import { computeScore, rankProgress, maxBreakdown } from './score';
import type { UserSocial } from './types';

export function useSocial(): SocialContextValue {
  const ctx = useContext(SocialContext) as SocialContextValue | null;
  if (!ctx) {
    throw new Error('useSocial must be used within <SocialProvider>');
  }
  return ctx;
}

export function useUserScore(userId?: string) {
  const { users, currentUserId, currentUser } = useSocial();
  const user: UserSocial =
    userId && userId !== currentUserId
      ? users.find((u) => u.id === userId) ?? currentUser
      : currentUser;

  return useMemo(() => {
    const computed = computeScore(user.activity);
    const progress = rankProgress(computed.total);
    const maxW = maxBreakdown(user.activity);
    return {
      user,
      ...computed,
      progress,
      barFractions: {
        connections: computed.weighted.connections / maxW,
        posts: computed.weighted.posts / maxW,
        stories: computed.weighted.stories / maxW,
        reactions: computed.weighted.reactions / maxW,
      },
    };
  }, [user]);
}

export function useSuggestions(limit = 4): UserSocial[] {
  const { users, currentUserId } = useSocial();
  return useMemo(
    () =>
      users
        .filter((u) => u.id !== currentUserId && !u.following)
        .slice(0, limit),
    [users, currentUserId, limit],
  );
}
