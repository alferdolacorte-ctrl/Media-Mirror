import type { Event } from "@/types/event";
import type { Message, Phase } from "@/types/message";
import type {
  Episode,
  EpisodeEvent,
  EpisodeMessageEvent,
  EpisodePromptEvent,
  EpisodeRevealEvent,
  EpisodeCheckpointEvent,
} from "@/types/episode";

/** Map episode speaker to display author for MessageBubble */
function speakerToAuthor(speaker: string): string {
  switch (speaker) {
    case "channel":
      return "Channel";
    case "user":
      return "Miguel";
    case "mod":
      return "Mod";
    case "system":
      return "System";
    default:
      return speaker;
  }
}

/**
 * Map episode events to feed Event[].
 * Preserves array order exactly; do not sort by ts.
 */
export function mapEpisodeToEvents(episode: Episode): Event[] {
  const phase: Phase = "shock"; // episode messages don't have phase; use default
  return episode.events.map((ev, index): Event => {
    switch (ev.type) {
      case "message": {
        const m = ev as EpisodeMessageEvent;
        const msg: Message = {
          id: index + 1,
          author: speakerToAuthor(m.speaker),
          timestamp: new Date().toISOString(), // display only; episode uses ts
          phase,
          text: m.text,
          reply_to_id: null,
        };
        return {
          id: m.id,
          type: "message",
          timestamp: m.ts,
          payload: { message: msg },
        };
      }
      case "prompt": {
        const p = ev as EpisodePromptEvent;
        return {
          id: p.id,
          type: "prompt",
          timestamp: p.ts,
          payload: {
            promptId: p.id,
            question: p.question,
            choices: p.choices.map((c) => ({
              id: c.id,
              text: c.text,
              tag: c.tag,
              onSelect: c.onSelect,
            })),
          },
        };
      }
      case "reveal": {
        const r = ev as EpisodeRevealEvent;
        return {
          id: r.id,
          type: "reveal",
          timestamp: r.ts,
          payload: {
            title: "Insight",
            content: r.text,
            tags: r.tags?.length ? r.tags : undefined,
            refIds: r.refIds,
          },
        };
      }
      case "checkpoint": {
        const c = ev as EpisodeCheckpointEvent;
        return {
          id: c.id,
          type: "checkpoint",
          timestamp: c.ts,
          payload: {
            title: "Checkpoint",
            summary: c.text,
          },
        };
      }
      default: {
        const _: never = ev;
        throw new Error(`Unknown episode event type`);
      }
    }
  });
}
