# Witness Lab — Conversion Plan

## A) Inventory of codebase

- **Where episodes are loaded**
  - `app/page.tsx`: loads `episode-001` via `loadEpisode("episode-001")` and dispatches `LOAD_EPISODE`.
  - `app/impact/episode/[id]/page.tsx`: loads episode by route param `id` via `loadEpisode(id)` and dispatches `LOAD_EPISODE`.
  - `lib/episodes/loadEpisode.ts`: static imports for `episode-001`, `episode-002`, `episode-003`; returns `Promise<Episode>`.

- **Where the reducer lives**
  - `lib/episode/episodeReducer.ts`: state (episodeId, events, progressIndex, lockedPromptId, answersByPromptId, witnessingProfile, gating, pendingHydrate), actions (HYDRATE, LOAD_EPISODE, ADVANCE, SELECT_CHOICE, REVEAL_SHOWN, RESET_EPISODE).
  - `lib/episode/EpisodeProvider.tsx`: wraps app with context, runs reducer, exposes `useEpisode()`, handles persist/hydrate and telemetry.

- **What components render the feed**
  - `EventRenderer`: pure switch on `event.type` → MessageBubble (message), DecisionCard (prompt), InsightCard (reveal), ReflectionCard (checkpoint).
  - Feed list: `visibleEvents.map(...)` in `app/page.tsx` and in `app/impact/episode/[id]/page.tsx`; each event gets EventRenderer with prompt/reveal props from provider.

- **How progression works**
  - `visibleEvents = state.events.slice(0, state.progressIndex + 1)` (canonical order; no sort by ts).
  - Timer in page calls `advance()` every 2s; reducer ADVANCE advances progressIndex unless gating/lockedPromptId; if next event is unanswered prompt, shows it and sets lockedPromptId.
  - User selects choice → SELECT_CHOICE → answer stored, witnessingProfile updated, lockedPromptId cleared, progressIndex + 1 (immediate reveal).

---

## B) What is implemented (Steps 1–9)

- **Step 1–3:** Canonical episode JSON schema, types, loader; witnessing taxonomy; RevealEvent/InsightCard uses TAXONOMY.
- **Step 4:** DecisionCard, InsightCard, ReflectionCard; EventRenderer uses them; UI rename only.
- **Step 5:** EpisodeProvider + useReducer; localStorage persist/hydrate; page is thin (load episode, timer, feed).
- **Step 6:** Reveal logic in `lib/witnessing/revealLogic.ts` (`buildReveal`); episodeContext + care notes; InsightCard accepts override for “You just performed: …” + context + care note after choice.
- **Step 7:** Three MVP episodes: episode-001 (SI, SA, CC), episode-002 (MN, C), episode-003 (EM, C, MN); 8–15 messages, 2 prompts, 1 checkpoint each; loadEpisode supports all three.
- **Step 8:** Impact routes: `/impact/before-screening` (primer + link to Episode 1), `/impact/after-screening` (links to Episode 2/3), `/impact/episode/[id]` (runs any episode), `/impact/education` (discussion prompts from TAXONOMY, print-friendly).
- **Step 9:** Telemetry in `lib/telemetry/logger.ts` (append-only localStorage, cap 500); EPISODE_STARTED, EPISODE_COMPLETED, PROMPT_SHOWN, CHOICE_SELECTED, SEGMENT_TIME, DROPOFF wired in EpisodeProvider.

---

## C) What remains next

- **Real branching:** Use `onSelect` in episode choices to branch event sequence; reducer or episode runner would resolve next event by choice.
- **Witnessing profile summary:** Use `witnessingProfile` (counts by tag) in ReflectionCard or a post-episode summary screen.
- **Scaling episode loading:** Replace hardcoded `loadEpisode` switch with dynamic import by id or fetch from `/content/episodes/${id}.json` (e.g. public or API route).
- **Partner deployment checklist:** Environment config, analytics opt-in, content moderation notes, accessibility pass, print/offline considerations.
