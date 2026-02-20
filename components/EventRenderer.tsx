import type {
  Event,
  MessageEventPayload,
  PromptEventPayload,
  PromptChoicePayload,
  RevealEventPayload,
  CheckpointEventPayload,
} from "../types/event";
import type { StageId } from "@/lib/stages";
import type { BibliographyEntryId } from "@/lib/bibliography";
import type { RevealOverride } from "./InsightCard";
import MessageBubble from "./MessageBubble";
import DecisionCard from "./DecisionCard";
import InsightCard from "./InsightCard";
import ReflectionCard from "./ReflectionCard";

const CURRENT_USER = "Miguel";

export interface EventRendererProps {
  event: Event;
  promptSelectedAnswer?: {
    choiceId: string;
    choiceText: string;
    tag: string;
  } | null;
  promptOnSelectChoice?: (choice: PromptChoicePayload) => void;
  revealOverride?: RevealOverride | null;
  currentStageId?: StageId;
  onScrollToRef?: (entryId: BibliographyEntryId) => void;
}

/**
 * EventRenderer - pure switch renderer. No state, no ordering logic.
 * Receives props/callbacks from parent/provider.
 */
export default function EventRenderer({
  event,
  promptSelectedAnswer,
  promptOnSelectChoice,
  revealOverride,
  currentStageId,
  onScrollToRef,
}: EventRendererProps) {
  switch (event.type) {
    case "message": {
      const payload = event.payload as MessageEventPayload;
      return (
        <MessageBubble
          msg={payload.message}
          isSelf={payload.message.author === CURRENT_USER}
        />
      );
    }

    case "prompt": {
      const payload = event.payload as PromptEventPayload;
      return (
        <DecisionCard
          payload={payload}
          disabled={!!promptSelectedAnswer}
          selectedAnswer={promptSelectedAnswer ?? null}
          onSelectChoice={promptOnSelectChoice}
        />
      );
    }

    case "reveal": {
      const payload = event.payload as RevealEventPayload;
      return (
        <InsightCard
          payload={payload}
          override={revealOverride ?? undefined}
          stageId={currentStageId}
          onScrollToRef={onScrollToRef}
        />
      );
    }

    case "checkpoint": {
      const payload = event.payload as CheckpointEventPayload;
      return <ReflectionCard payload={payload} />;
    }

    default:
      return null;
  }
}
