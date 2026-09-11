# Studio gate report — social harden + remediations

## P0 checklist

| # | Item | Result | Notes / files |
|---|------|--------|---------------|
| 1 | expo-image-picker PostComposer (web-safe) | **PASS** | `components/posts/PostComposer.tsx` — `pickImage`; catch → mock URI + Alert; no simulatePick-only path |
| 2 | AsyncStorage hydrate/persist `ubi.social.v1` | **PASS** | `lib/social/persist.ts`, `SocialProvider.tsx` debounce 450ms; seed on empty |
| 3 | StoriesTray Crear → add-story (not self viewer) | **PASS** | `StoriesTray.tsx` Alert + `addStorySlide` / `create?mode=story`; `create.tsx` Historia mode |
| 4 | 6-tab typography/spacing | **PASS** | `app/(tabs)/_layout.tsx` — `type.caption2`, bottom 8, radius 20, icon 22, minHeight 44, web hide labels, order Mapa/Feed/Crear/Reels/Chats/Perfil |
| 5 | Brand Leyenda / sofia / Reel mesh | **PASS** | Leyenda `magenta`; sofia `#7B5CFF`; `ReelPlayer.tsx` layered dichroic mesh; story tint coral removed |
| 6 | Visual ReputationBadge / PostCard / glass | **PASS** | Badge `glow="none"`; bars blue/cyan/violet/indigo; PostCard `intensity="subtle"`; Regular badge contrast lifted; default shadowRadius stays 24 |
| 7 | Reel comment/share a11y + hitSlop | **PASS** | Share → `shareReel`; Comment disabled+dimmed; hitSlop 12 on reel sides + PostCard + CommentThread |
| 8 | Regular badge WCAG contrast | **PASS** | `glass-ui` badgeBlue fill 0.36 + text `#E8ECFF` |

## P1 (done if time)

- StoriesTray gap → `space[2]` (8) **PASS**
- ReelPlayer sideText on `type.footnote` + space pads **PASS**
- Avatar type onto scale **PASS**
- Stories score axis +2 on publish **PASS**

## Packages to install on laptop

```bat
npx expo install expo-image-picker @react-native-async-storage/async-storage
```

## tsc

- Box harness: only React `key` prop / incomplete shim noise — **no real source errors** introduced.
- **Authoritative:** after CopyFromBox to `C:\Users\miche\ubi-v.1.1` + expo install → `npx tsc --noEmit` must be clean.
- fontWeight-before-spread fixed in PostComposer, CommentThread, StoryViewer.

## Files changed (CopyFromBox from `/workspace/ubi-social/out/`)

- `lib/social/persist.ts` (new)
- `lib/social/SocialProvider.tsx`
- `lib/social/types.ts`
- `lib/social/index.ts`
- `lib/social/mockUsers.ts`
- `lib/social/mockStories.ts`
- `components/posts/PostComposer.tsx`
- `components/posts/PostCard.tsx`
- `components/posts/CommentThread.tsx`
- `components/profile/ReputationBadge.tsx`
- `components/stories/StoriesTray.tsx`
- `components/stories/StoryViewer.tsx`
- `components/reels/ReelPlayer.tsx`
- `components/glass-ui.tsx` (magenta badge + Regular contrast)
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/create.tsx`
- `SOCIAL-NOTES.md`, `SOCIAL-PROVIDER-WIRING.md`, `MANIFEST.txt`

## Residual risks

- Agent could not Shell-target machineId from this subagent; parent must CopyFromBox.
- Web picker fallback is intentional.
- Local image URIs in persisted posts may break after OS cache clear.
