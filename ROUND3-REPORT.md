# UBI Round 3 — executor report

## Access note
**No machineId Shell / MCP ListMachines** on this executor box.
All R3 edits landed in `/workspace/ubi-social/r3-overlay` (+ mirror `/workspace/ubi-social/out`).
**Parent must CopyFromBox → `C:\Users\miche\ubi-v.1.1`** then `npx expo install expo-blur` + `npx tsc --noEmit` on the laptop.
Do **not** claim 9.9.

## Baseline
Lead after R2 ≈ **~8.4**. Typography R2 ≈ **8.6**. R3 closes remaining design/IA gaps without real backend/video.

## Landed (R3)

| # | Item | Detail | Files |
|---|------|--------|-------|
| 1 | **expo-blur BlurView** | GlassSurface/GlassCard + TabBarFrostBackground; StyleSheet fill fallback on web | `glass-ui`, `_layout` |
| 2 | **Tab ≤5** | Chats `href: null`; Chat CTA on map event sheet (Voy \| Chat \| Plan B); chats deep-link kept | `_layout`, `map`, `chats` |
| 3 | **Frost/cyan austerity** | One frost hero; kickers → gold; killed cyan ambient blob + non-CTA cyan chrome; LIVE/Voy edge may keep cyan | `glass-ui`, `theme`, profile/feed/posts/stories/reels/LiveMap… |
| 4 | **Story place chips** | Create story mode: eventId/placeLabel chips like posts | `create.tsx` (+ SocialProvider already had fields) |
| 5 | **QA smoke** | SOCIAL-SMOKE.md + scripts/social-smoke-checklist.sh; qa-shots/social/ README (no Expo on box → no real shots) | docs/scripts |
| 6 | **Rank Explorador/Habitual** | `rankLabelEs(Regular)=Habitual`; onboarding copy | `score`, `onboarding` |
| 7 | **is18Plus on UbiEvent** | Field on type + addEvent; map 18+ filter prefers it | `types`, `eventsStore`, `map` |
| 8 | **MediaTypeOptions.Images** | PostComposer picker | `PostComposer` |
| 9 | **Typography steer** | radius.sm **12** (4pt); GlassSectionTitle **headline** (not title3); UserCard meta `space[1]`; StoriesTray gap `space[2]`=8; chip gap `space[2]` | `glass-ui`, `UserCard`, `StoriesTray` |

## tsc
Box: `npx tsc --noEmit` in `tsc-check/` against `out/` (LiveMap excluded; expo-blur shimmed).
Laptop: re-run after CopyFromBox + `expo install expo-blur`.

## Score estimate (not a claim)
R2 ≈ **8.4** + typography R2 **8.6** → R3 design/IA ceiling ≈ **8.8–9.2**.
**Cannot reach true 9.9** without real video + backend + device Blur/QA evidence.

## Remaining hard caps
- Real **video** (expo-av / native reels) — still stub
- **Backend** (auth, feed, follows, events API) — mock + AsyncStorage
- **Device evidence** of BlurView + dichroic sheen (box cannot screenshot Expo)
- Full chat product (sheet deep-link only; no realtime)
- Pin popover social mesh beyond sheet host badge

## Copy hint (parent)
```
CopyFromBox /workspace/ubi-social/r3-overlay/** → C:\Users\miche\ubi-v.1.1\
# or /workspace/ubi-social/out/** (same tree)
cd C:\Users\miche\ubi-v.1.1 && npx expo install expo-blur && npx tsc --noEmit
```
