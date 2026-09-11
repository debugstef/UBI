/**
 * lib/social/types.ts — UBI social graph types
 */

export type Rank = 'Explorador' | 'Habitual' | 'Conector' | 'Leyenda';

export type ScoreBreakdown = {
  connections: number;
  posts: number;
  stories: number;
  reactions: number;
};

export type UserSocial = {
  id: string;
  name: string;
  handle: string;
  avatarInitial: string;
  avatarColor: string;
  bio: string;
  district: string;
  following: boolean;
  isCurrentUser?: boolean;
  activity: ScoreBreakdown;
  /** computed on the fly — optional cache */
  score?: number;
  rank?: Rank;
};

export type MentionSegment =
  | { kind: 'text'; value: string }
  | { kind: 'hashtag'; value: string }
  | { kind: 'mention'; value: string };

export type PostComment = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  likes: number;
  replies?: PostComment[];
};

export type SocialPost = {
  id: string;
  authorId: string;
  body: string;
  mediaUri?: string | null;
  /** extra local URIs when multi-pick */
  mediaUris?: string[];
  mediaTint?: string;
  linkPreview?: { url: string; title: string; domain: string } | null;
  /** map↔social bridge — optional place / event tag */
  eventId?: string | null;
  placeLabel?: string | null;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  liked?: boolean;
  saved?: boolean;
  createdAt: string;
  commentThread: PostComment[];
};

export type StorySlide = {
  id: string;
  caption?: string;
  tint: string;
  /** optional video placeholder URI */
  videoUri?: string | null;
  durationMs?: number;
  /** map↔social bridge */
  eventId?: string | null;
  placeLabel?: string | null;
};

export type StoryBundle = {
  userId: string;
  viewed: boolean;
  slides: StorySlide[];
};

export type ReelItem = {
  id: string;
  authorId: string;
  caption: string;
  audioLabel: string;
  tint: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  videoUri?: string | null;
};

export type SocialState = {
  users: UserSocial[];
  posts: SocialPost[];
  stories: StoryBundle[];
  reels: ReelItem[];
  currentUserId: string;
};
