# UBI Pitch Notes — Demo script & mock vs real

## 60-second walkthrough

1. **Splash** (`index`) — UBI wordmark on dichroic night. Tap **Empezar** → onboarding, or **Abrir mapa** to skip.
2. **Onboarding** — three calm slides: mapa primero, privacidad (“exact location never public”), 18+ contextual. Skip or finish → **Mapa**.
3. **Mapa** — live map (already dichroic). Tap a pin → **Event detail**.
4. **Event** — badges (Live / Privado / 18+). Private events show **Near Barranco** only. Tap **Voy**, **Chat**, **Plan B**, or **SOS**.
5. **Feed** — horizontal story strip + event cards. Use **Ocultar** / **Reportar** (local state; empties feed if you clear all → restablecer).
6. **Crear** — title, type, district, price; **Privado** toggle shows “Near {district}” note; **18+** routes to verify-18. Publish → alert → mapa.
7. **Chats** → thread with bubbles + reu card; no phone numbers / exact pins.
8. **Perfil** — Demo data banner, clout chips, links to Safety / Verify 18 / SOS / Plan B. Privacy line visible.

## Privacy rules to call out

- Exact user lat/lng never rendered in UI.
- Private events: district only (“Near Barranco”), not street.
- 18+ is a contextual gate (create toggle, alcohol events), not an app-wide lock.
- Feed Hide/Report is device-local only for the pitch.
- No API keys, tokens, or secrets in this tree.

## Mock vs real

| Piece | Status |
|-------|--------|
| Dichroic theme + glass-ui | Real UI kit |
| Map screen | Largely real (prior work) |
| Events / stores data | **Mock** (`lib/data.ts`) |
| Feed stories & moderation | **Mock** local state |
| Create publish | **Mock** Alert + navigate |
| Chats / thread messages | **Mock** seeded copy |
| Voy commits / clout | **Mock** |
| Verify 18 / Safety reports | **Mock** (simulate) |
| Plan B ranking | Real sort over mock events |
| Backend / auth / push | Not in pitch build |

## Copy tone

Cupertino calm. Spanish labels OK: Voy, Plan B, Mapa, Crear. Human, jargon-light.

## File naming for CopyFromBox

Flat names in `/workspace/ubi-pitch/` map to app destinations listed in `MANIFEST.txt`. Imports inside each file already use the **destination-relative** paths (`../../components/...` for tabs, `../components/...` for app root, etc.).
