# UBI Social — Round 3 QA smoke path

**Goal:** capture device/web shots proving R3 design/IA (not a claim of 9.9).
**Shots dir:** `qa-shots/social/` (create on laptop if missing).
**Hard caps:** no real video pipeline, no backend, no authentic BlurView proof without iOS/Android device.

## Preflight (laptop)
```
cd C:\Users\miche\ubi-v.1.1
npx expo install expo-blur   # if missing
npx tsc --noEmit
npx expo start
```
Optional web: `npx expo start --web` then open the URL.

## Exact click path (map-first)

1. **Onboarding** → slide social (Explorador → Habitual → Leyenda) → Continue → lands **Mapa**.
   - Shot: `01-onboarding-social.png`
2. **Mapa** — tap a pin → frosted **event sheet** (one frost hero). Confirm **Voy | Chat | Plan B** (no Chats tab).
   - Shot: `02-map-sheet-chat.png`
3. Sheet **Chat** → event chat route (or list via deep `/(tabs)/chats`).
   - Shot: `03-chat-from-sheet.png`
4. Tab **Feed** — StoriesTray ring blue→violet; composer; posts. One frost card hero; kickers gold not cyan.
   - Shot: `04-feed-frost.png`
5. Tab **Crear** → **Historia** → pick place chip → Publicar historia.
   - Shot: `05-create-story-place.png`
6. **Crear** → **Evento** → toggle **18+** (is18Plus) → verify-18 if prompted → Publicar.
   - Shot: `06-create-event-18.png`
7. Tab **Reels** — stub player still OK; mesh ≤2; no cyan neon chrome.
   - Shot: `07-reels.png`
8. Tab **Perfil** — ReputationBadge ranks **Explorador / Habitual / Conector / Leyenda**.
   - Shot: `08-profile-ranks.png`
9. Confirm **tab bar ≤5**: Mapa · Feed · Crear · Reels · Perfil (no Chats). BlurView on device / StyleSheet on web.
   - Shot: `09-tabbar-5.png`

## Capture notes
- Prefer iPhone simulator or device for real `expo-blur` BlurView.
- Web preview: frost is StyleSheet fallback — still capture for IA proof.
- Do **not** crop away the tab bar on shot 09.

## Box status
Executor box has **no machineId** and no runnable Expo app tree — screenshots must be taken on the laptop after CopyFromBox.


## Typography R3 checks (while shooting)
- Tab bar shows **exactly 5** items (no Chats).
- Cards use `radius.sm` **12** (4pt grid).
- In-card section titles read as **headline** weight/size (not oversized title3).
- UserCard / StoriesTray spacing uses space tokens (8pt tray gap).
- Ranks: **Explorador / Habitual / Conector / Leyenda**.
