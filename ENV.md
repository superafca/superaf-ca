# Optional environment

These are not required for the site to run.

| Name | Where | Notes |
|---|---|---|
| `VITE_SEASON` | Vercel, exposed to the browser | `fall`, `christmas`, `winter`, `spring`, or `summer`. Invalid values are ignored. `SEASON_OVERRIDE` in `src/lib/season.ts` wins if set. `?season=` overrides one page view only. |
| `GOOGLE_PLACES_API_KEY` | Vercel, **server only**. Do not use a `VITE_` prefix. | Google Places API (New). This is a billed Google Cloud key. Leave unset to keep the static review card. |
| `GOOGLE_PLACE_ID` | Vercel, **server only**. | Place whose rating and reviews the homepage may load. |

Set the Google pair together in the Vercel project environment for Production and Preview. The key must never ship in the client bundle.
