/**
 * lib/social/score.ts — pure reputation compute
 */
import type { Rank, ScoreBreakdown } from './types';

const WEIGHTS = {
  connections: 12,
  posts: 8,
  stories: 6,
  reactions: 2,
} as const;

const RANK_THRESHOLDS: { rank: Rank; min: number }[] = [
  { rank: 'Leyenda', min: 400 },
  { rank: 'Conector', min: 220 },
  { rank: 'Habitual', min: 90 },
  { rank: 'Explorador', min: 0 },
];

/** Next-tier progress helper (0–1 within current band). */
export function rankProgress(total: number): { rank: Rank; next: Rank | null; progress: number; remaining: number } {
  const rank = rankFor(total);
  const idx = RANK_THRESHOLDS.findIndex((r) => r.rank === rank);
  const currentMin = RANK_THRESHOLDS[idx]?.min ?? 0;
  const nextEntry = idx > 0 ? RANK_THRESHOLDS[idx - 1] : null;
  if (!nextEntry) {
    return { rank, next: null, progress: 1, remaining: 0 };
  }
  const span = nextEntry.min - currentMin;
  const progress = span <= 0 ? 1 : Math.min(1, Math.max(0, (total - currentMin) / span));
  return { rank, next: nextEntry.rank, progress, remaining: Math.max(0, nextEntry.min - total) };
}

export function rankFor(total: number): Rank {
  for (const t of RANK_THRESHOLDS) {
    if (total >= t.min) return t.rank;
  }
  return 'Explorador';
}

export function computeScore(activity: ScoreBreakdown): {
  total: number;
  rank: Rank;
  breakdown: ScoreBreakdown;
  weighted: ScoreBreakdown;
} {
  const weighted: ScoreBreakdown = {
    connections: activity.connections * WEIGHTS.connections,
    posts: activity.posts * WEIGHTS.posts,
    stories: activity.stories * WEIGHTS.stories,
    reactions: activity.reactions * WEIGHTS.reactions,
  };
  const total =
    weighted.connections + weighted.posts + weighted.stories + weighted.reactions;
  return {
    total,
    rank: rankFor(total),
    breakdown: { ...activity },
    weighted,
  };
}

export function maxBreakdown(activity: ScoreBreakdown): number {
  return Math.max(
    activity.connections * WEIGHTS.connections,
    activity.posts * WEIGHTS.posts,
    activity.stories * WEIGHTS.stories,
    activity.reactions * WEIGHTS.reactions,
    1,
  );
}

/** UI Spanish labels (internal Rank stays Explorer…) */
export function rankLabelEs(rank: Rank): string {
  switch (rank) {
    case 'Explorador':
      return 'Explorador';
    case 'Habitual':
      return 'Habitual';
    case 'Conector':
      return 'Conector';
    case 'Leyenda':
      return 'Leyenda';
    default:
      return rank;
  }
}

export { WEIGHTS, RANK_THRESHOLDS };
