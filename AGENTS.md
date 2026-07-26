# AGENTS.md

## Analytics — Mixpanel

Product analytics tool: **Mixpanel** (`mixpanel-browser`). No CDP — direct client-side SDK.

- **Init:** `components/ui/MixpanelInit.tsx`, mounted once in `app/layout.tsx`. Runs `initMixpanel()` on mount (client-only).
- **Token:** hardcoded in `lib/mixpanel.ts` (not a secret — same treatment as the Contentsquare/Vercel Analytics IDs already in this codebase).
- **Tracking method:** client-side web only. No user accounts/auth on this site, so there's no `identify()`/`reset()` flow — all events are anonymous (`$device_id`-based `distinct_id`).
- **Consent:** no gate. Matches this site's existing tools (Contentsquare, Vercel Analytics), which also track unconditionally.

### Tracking plan

| Event | Fires from | Properties |
|---|---|---|
| `contact_link_clicked` | `components/ui/ContactFooterV3.tsx` — email copy button, phone/LinkedIn/OnlyMe links | `channel`: `"email" \| "phone" \| "linkedin" \| "onlyme"` |
| `project_opened` | `components/ui/ProjectCard.tsx` — any project card click | `project`: title string; `destination`: `"internal" \| "external"` |

Helper functions live in `lib/mixpanel.ts` (`trackContactClick`, `trackProjectOpened`) — reuse these rather than calling `mixpanel.track()` directly, and add new events there following the same `snake_case` naming.

### Adding a new event

1. Check `lib/mixpanel.ts` first — reuse an existing helper/property shape if a similar event already exists.
2. Add a new exported `trackX()` function there; call it from the component where the action happens.
3. Keep names `snake_case`, values lowercase strings, no PII, no dynamically-constructed event names.
