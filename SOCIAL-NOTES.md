# UBI Social — demo script (hardened)

Dichroic Cupertino social pillars (Reputation · Posts · Stories/Reels). Spanish UI. No Tailwind. Context + AsyncStorage.

## Prep (Windows laptop)

1. Copy `out/**` → `C:\Users\miche\ubi-v.1.1` per `MANIFEST.txt` (skip overwriting newer theme/glass if already current — merge magenta badge if needed).
2. Install deps (once):
   ```bat
   cd C:\Users\miche\ubi-v.1.1
   npx expo install expo-image-picker @react-native-async-storage/async-storage
   ```
3. Wrap root with `SocialProvider` (see `SOCIAL-PROVIDER-WIRING.md`).
4. `npx tsc --noEmit` — must be clean.
5. Reload Expo.

## Pillar 1 — Reputation

1. Open **Perfil**. Note total score, rank chip (Explorador → Habitual → Conector → **Leyenda** = magenta/violet apex, never coral), mini bars (Conexiones blue / Posts cyan / Stories violet / Reacciones indigo).
2. Feed → **Sugerencias** → **Seguir** Valentina → Perfil Conexiones +1, score jumps.
3. Unfollow → score drops. Reload app → follows/likes/posts/score **persist** (`ubi.social.v1`).

## Pillar 2 — Posts (real picker)

1. **Crear** → mode **Post** (or Feed composer).
2. Type: `Noche #Barranco con @vale.rmx https://ubi.pe/demo`
3. Tap **Añadir foto** → native gallery (`expo-image-picker`). Web: picker if available, else graceful mock URI + alert (no crash).
4. Progress 0→100% → preview (real `Image` for file/http/blob URIs).
5. **Publicar** → Feed top card (subtle frost, not heavy medium glass every row). Like / comment / save / share. Reload → post still there.

## Pillar 3 — Stories & Reels

1. Feed **Historias**: dashed **Crear** → alert “Publicar ahora” **or** “Ir a Crear” (`?mode=story`). Does **not** open self viewer.
2. Publishing a slide bumps **Stories +2**. Own ring appears; tap to view.
3. Viewer: progress, hold pause, Reaccionar.
4. **Reels**: vertical snap. Like + Seguir live. Share increments count; Comment side action is **honestly disabled** (dimmed, not a dead no-op).

## Tab bar (6)

Order: Mapa · Feed · Crear · Reels · Chats · Perfil. Labels `type.caption2`, radius 20, bottom 8, icons 22, item minHeight 44. Web hides labels to reduce crowding. Active = electricBlue.

## Rank thresholds

| Rank | Min | Badge tone |
|------|-----|------------|
| Explorador | 0 | cyan |
| Habitual | 90 | blue (lifted contrast) |
| Conector | 220 | violet |
| Leyenda | 400 | magenta (#7B5CFF) |

Weights: connections×12, posts×8, stories×6, reactions×2. Story publish +2 on stories axis.

## Persistence

- Key: `ubi.social.v1`
- Hydrate on mount; debounce-save ~450ms after interactions.
- Empty/corrupt storage → typed mocks seed.
- `resetSocial()` clears storage + reseeds (API).

## Packages

- `expo-image-picker`
- `@react-native-async-storage/async-storage`

## Residual risks

- Web picker UX varies by browser; fallback mock is intentional.
- Local file URIs may not survive forever in AsyncStorage across reinstalls.
- Comment-on-reel intentionally disabled until thread UI exists.
- Parent must CopyFromBox → Windows + `expo install` + `tsc` on the laptop (this agent box has no local-exec machineId routing).
