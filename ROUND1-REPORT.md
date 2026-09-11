# UBI Round 1 — executor report

## Access note
This executor box had **no MCP ListMachines / machineId Shell routing** (cursor MCP unavailable).
All P0 edits landed in `/workspace/ubi-social/out` + `/workspace/ubi-social/r1-overlay`.
**Parent must CopyFromBox → `C:\\Users\\miche\\ubi-v.1.1`** then `npx tsc --noEmit` on the laptop.

## P0 landed

| # | Item | Before → After | Files |
|---|------|----------------|-------|
| 1 | Event create → map store | Alert-only dead-end → `addEvent()` writes `eventsStore`; in-screen success card (Ver mapa / Crear otro) | `create.tsx`, `lib/eventsStore.ts`, `lib/data.ts` |
| 2 | Leyenda WCAG | magenta-on-magenta text → fill `rgba(123,92,255,0.34)` + cyan rim + text **#E8E0FF** (~9.8:1 on blended fill) | `glass-ui.tsx`, `ReputationBadge.tsx` |
| 3 | Quiet glass shadow | surface shadowRadius **24** / opacity 0.45 / elev 8 → **10** / **0.28** / elev **4** | `glass-ui.tsx` |
| 4 | PostComposer glow | `glow="cyan"` → `glow="none"`; clearMedia coral→muted | `PostComposer.tsx` |
| 5 | Tab bar bloom | electricBlue shadow/border → indigo shadow + quiet border; label weight 500, marginTop 0 | `_layout.tsx` |
| 6 | PostCard mock:// | already gated; explicit `mock://` reject before `<Image>` | `PostCard.tsx`, `PostComposer.tsx` |
| 7 | Feed/Reels empties | blank → Cupertino ES empty cards | `feed.tsx`, `ReelsFeed.tsx` |
| 8 | Reel a11y | SideAction + Seguir `accessibilityLabel` ES (Me gusta, Comentar, Compartir, Seguir) | `ReelPlayer.tsx` |
| 9 | Content ES scrub | Near→Cerca de; safety Enviar reporte/Bloquear; Exact location→Tu ubicación…; verify Confirmar 18+; EventCard Cerca de; kill Simular/demo EN chrome | `safety.tsx`, `verify-18.tsx`, `EventCard.tsx`, mocks, profile, StoriesTray |
| 10 | LiveMap pins | Previa gold / After champagne → violetLift / electricBlue dichroic | `LiveMap.tsx` (+ overlay map Tendencia/SOS, plan-b amigos) |

## Also landed (supporting)
- Reputation kicker `Reputación`; bars Publicaciones/Historias; glow none kept
- CommentThread empty + send a11y; actionText cyan
- UserCard orphan fontSizes → type tokens
- Create mode chip `Publicación`; draft/success states without Alert for event/post/story
- Reel hint `Reproducir` (was Reel mock); mock:// URIs kept internally

## tsc
Box check: `npx tsc --noEmit` in `tsc-check/` → **clean (exit 0)** after shim loosen + LiveMap exclude (Leaflet `any` noise).
Laptop: parent must re-run after CopyFromBox against real Expo types.

## Score lift (estimate, not claim)
Baseline **7.4** → estimated **7.8–8.1** after P0 visual/a11y/content + event→store.
Brand had dipped to ~6.7 on Leyenda/gold; Leyenda+#E8E0FF + pin dichroic + quiet shadow should recover past 7.4.
**Do not claim 9.9.**

## Deferred (R2 / R1b)
- Full map↔social bridge (tag place / host score mesh)
- Onboarding social slide
- BlurView system
- StoryStrip kill / token rename
- Tab ≤5
- QA smoke screenshots (R1b)
- Dual-stop story rings / reels single-mesh polish (partial chrome quiet only)

## Copy command hint (parent)
```
CopyFromBox /workspace/ubi-social/out/** → C:\\Users\\miche\\ubi-v.1.1\
CopyFromBox /workspace/ubi-social/r1-overlay/app/(tabs)/map.tsx → ...\\app\\(tabs)\\map.tsx
CopyFromBox /workspace/ubi-social/r1-overlay/app/(tabs)/chats.tsx → ...\\app\\(tabs)\\chats.tsx
CopyFromBox /workspace/ubi-social/r1-overlay/app/plan-b.tsx → plan-b path on laptop
```
