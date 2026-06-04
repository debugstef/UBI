# UBI v1.1 — Full Frontend MVP

UBI v1.1 is a complete frontend prototype for a nightlife social app: map-first discovery, events, hotspots, stories, event chats, group coordination, host tools, store/supplies layer, contextual 18+ verification, Party SOS, Plan B, profile/clout, privacy and safety flows.

## Stack

- React Native + Expo
- Expo Router
- TypeScript
- Expo Web support
- OpenStreetMap preview on web using an embedded iframe-style component
- Mock data now, Supabase-ready later

## Run locally

```bash
npm install
npm run web
```

Open the localhost URL that Expo prints.

## Product rules

- Map first.
- UBI is not a delivery app; stores are a secondary map layer.
- 18+ verification is contextual, not required for the whole app.
- Exact user location is never public.
- Private events hide exact address by default.
- Stories help users decide, not just entertain.
- Chats are tied to events.
