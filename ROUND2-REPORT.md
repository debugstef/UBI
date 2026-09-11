# UBI Round 2 — executor report

## Access note
**No machineId Shell / MCP ListMachines** on this executor box.
All R2 edits landed in `/workspace/ubi-social/r2-overlay` (+ mirror `/workspace/ubi-social/out`).
**Parent must CopyFromBox → `C:\Users\miche\ubi-v.1.1`** then `npx tsc --noEmit` on the laptop.
Do **not** claim 9.9.

## Baseline
Lead re-rate after R1 ≈ **7.9/10**. Typography R1 ≈ **7.8**. Workplace R1 feedback folded into this round.

## Landed (R2)

| # | Item | Detail | Files |
|---|------|--------|-------|
| 1 | **map↔social bridge (MVP)** | Posts/stories can carry `eventId`/`placeLabel`; PostComposer place chips from `useEvents()`; map sheet shows Host + compact ReputationBadge (Explorador…Leyenda via `rankLabelEs`); seed hosts on events | `types`, `SocialProvider`, `PostComposer`, `PostCard`, `map`, `eventsStore`, `score`, `ReputationBadge`, `mockPosts`, `persist` |
| 2 | **Onboarding social slide** | Slide 2 primes Historias/Reputación; `seedOnboardingFollows(['u-vale','u-nico'])` on continue / after social; then map | `app/onboarding.tsx`, `SocialProvider.seedOnboardingFollows` |
| 3 | **Reels mesh polish** | Max 2 blobs @ ≤0.22; removed third magenta / glowMagenta; audio chip **muted** (not neon cyan); footer `right = space[16]+space[2]` (72) clears sideCol | `ReelPlayer.tsx` |
| 4 | **Type leftovers / kit** | glass-ui badge/btn/chip/input → `...type.*` spreads; `radius.sm` 14; minH 48; composer hierarchy = kicker+headline (**not** GlassSectionTitle/title3); killed dual “Vista previa”; Publicar CTA primary rank | `glass-ui`, `PostComposer` |
| 5 | **Tab IA light** | Hide labels when `width < 390` (web already hidden). **Kept 6 tabs** — chats→event fold not ready | `_layout.tsx` |
| 6 | **StoriesTray dual-stop** | Ring gradient **blue→violet** (`#4F6BFF`→`#7B5CFF`), no cyan in ring | `StoriesTray.tsx` |
| 7 | **Workplace copy** | Feed lead/sub; empty + Publicar / Ver mapa CTAs; create subtitle “Publicación, historia o plan.”; safety “Sin exponer datos” | `feed`, `create`, `safety` |
| 8 | **plan-b** | Rewrote off dead `components/ui` → glass + `useEvents` | `plan-b.tsx` |

## tsc
Box: `npx tsc --noEmit` in `tsc-check/` → **clean (exit 0)** (LiveMap Leaflet noise excluded; PanResponder shimmed).
Laptop: parent re-run after CopyFromBox against real Expo types.

## Score estimate (not a claim)
R1 ≈ **7.9** → R2 estimated **~8.3–8.6** after bridge MVP + onboarding social + mesh/type/workplace polish.
**Do not claim 9.9.**

## Remaining gaps to 9.9 (explicit)
- **Real video** pipeline (expo-av / native player) — reels still stub “Reproducir”
- **Backend** (auth, feed, follows, events API) — still local/mock + AsyncStorage
- **QA screenshots** / device smoke (R2b)
- **BlurView** system frosted glass (still StyleSheet frost)
- **Tab ≤5** fold (chats→event) — deferred; only narrow label-hide for now
- Full map pin popover social mesh / story place tags in Create story UI (posts done; story field exists but Create story form doesn’t expose place chips yet)
- Native Blur + dichroic sheen QA on iOS/Android

## Copy hint (parent)
```
CopyFromBox /workspace/ubi-social/r2-overlay/** → C:\Users\miche\ubi-v.1.1\
# or /workspace/ubi-social/out/** (same tree)
```
