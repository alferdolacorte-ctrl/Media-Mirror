import type { Event } from "@/types/event";
import type { PromptEventPayload, PromptChoicePayload } from "@/types/event";
import type { StageId } from "@/lib/stages";
import { getNextStage } from "@/lib/stages";

const STORAGE_KEY = "mediaMirrorEpisodeState:v1";

export type StageStatus = "in_progress" | "completed";

export interface EpisodeGating {
  sensitiveMode: boolean;
  progressLock: boolean;
}

export interface EpisodeState {
  episodeId: string | null;
  events: Event[];
  progressIndex: number;
  lockedPromptId: string | null;
  answersByPromptId: Record<
    string,
    { choiceId: string; choiceText: string; tag: string }
  >;
  witnessingProfile: Record<string, number>;
  gating: EpisodeGating;
  /** Set by HYDRATE; consumed by LOAD_EPISODE when episodeId matches */
  pendingHydrate: PersistedEpisodeState | null;
  /** Stage progression */
  currentStageId: StageId;
  stageStatus: StageStatus;
  isTransitionOpen: boolean;
  isContextOpen: boolean;
}

export interface PersistedEpisodeState {
  episodeId: string;
  progressIndex: number;
  lockedPromptId: string | null;
  answersByPromptId: Record<
    string,
    { choiceId: string; choiceText: string; tag: string }
  >;
  witnessingProfile: Record<string, number>;
  gating: EpisodeGating;
}

const defaultGating: EpisodeGating = {
  sensitiveMode: false,
  progressLock: false,
};

export const initialEpisodeState: EpisodeState = {
  episodeId: null,
  events: [],
  progressIndex: 0,
  lockedPromptId: null,
  answersByPromptId: {},
  witnessingProfile: {},
  gating: defaultGating,
  pendingHydrate: null,
  currentStageId: "stage-1",
  stageStatus: "in_progress",
  isTransitionOpen: false,
  isContextOpen: false,
};

export type EpisodeAction =
  | { type: "HYDRATE"; payload: PersistedEpisodeState | null }
  | { type: "LOAD_EPISODE"; episodeId: string; events: Event[] }
  | { type: "ADVANCE" }
  | {
      type: "SELECT_CHOICE";
      promptId: string;
      choice: PromptChoicePayload;
    }
  | { type: "REVEAL_SHOWN" }
  | { type: "RESET_EPISODE" }
  | { type: "COMPLETE_STAGE" }
  | { type: "OPEN_TRANSITION" }
  | { type: "CLOSE_TRANSITION" }
  | { type: "START_NEXT_STAGE" }
  | { type: "OPEN_CONTEXT" }
  | { type: "CLOSE_CONTEXT" };

export function episodeReducer(
  state: EpisodeState,
  action: EpisodeAction
): EpisodeState {
  switch (action.type) {
    case "HYDRATE": {
      return {
        ...state,
        pendingHydrate: action.payload,
      };
    }

    case "LOAD_EPISODE": {
      const { episodeId, events } = action;
      const hyd = state.pendingHydrate;
      const useHydrate = hyd && hyd.episodeId === episodeId;
      const maxIndex = Math.max(0, events.length - 1);
      const progressIndex = useHydrate
        ? Math.min(hyd.progressIndex, maxIndex)
        : 0;

      return {
        ...state,
        episodeId,
        events,
        progressIndex,
        lockedPromptId: useHydrate ? hyd.lockedPromptId : null,
        answersByPromptId: useHydrate ? hyd.answersByPromptId : {},
        witnessingProfile: useHydrate ? hyd.witnessingProfile : {},
        gating: useHydrate ? hyd.gating : defaultGating,
        pendingHydrate: null,
      };
    }

    case "ADVANCE": {
      if (state.gating.progressLock || state.lockedPromptId !== null) {
        return state;
      }
      const nextIndex = state.progressIndex + 1;
      if (nextIndex >= state.events.length) return state;

      const nextEvent = state.events[nextIndex];
      if (nextEvent.type === "prompt") {
        const promptId = (nextEvent.payload as PromptEventPayload).promptId;
        if (!state.answersByPromptId[promptId]) {
          return {
            ...state,
            progressIndex: nextIndex,
            lockedPromptId: promptId,
          };
        }
      }
      return { ...state, progressIndex: nextIndex };
    }

    case "SELECT_CHOICE": {
      const { promptId, choice } = action;
      const tag = choice.tag;
      const nextProfile = { ...state.witnessingProfile };
      nextProfile[tag] = (nextProfile[tag] ?? 0) + 1;

      return {
        ...state,
        answersByPromptId: {
          ...state.answersByPromptId,
          [promptId]: {
            choiceId: choice.id,
            choiceText: choice.text,
            tag: choice.tag,
          },
        },
        witnessingProfile: nextProfile,
        lockedPromptId: null,
        progressIndex: state.progressIndex + 1,
      };
    }

    case "REVEAL_SHOWN": {
      return state;
    }

    case "RESET_EPISODE": {
      return {
        ...initialEpisodeState,
        pendingHydrate: state.pendingHydrate,
      };
    }

    case "COMPLETE_STAGE": {
      return { ...state, stageStatus: "completed" };
    }

    case "OPEN_TRANSITION": {
      return { ...state, isTransitionOpen: true };
    }

    case "CLOSE_TRANSITION": {
      return { ...state, isTransitionOpen: false };
    }

    case "START_NEXT_STAGE": {
      const nextStage = getNextStage(state.currentStageId);
      if (!nextStage) return state;
      return {
        ...state,
        currentStageId: nextStage.id,
        stageStatus: "in_progress",
        isTransitionOpen: false,
        events: [],
        progressIndex: 0,
        episodeId: null,
        lockedPromptId: null,
        answersByPromptId: {},
      };
    }

    case "OPEN_CONTEXT": {
      return { ...state, isContextOpen: true };
    }

    case "CLOSE_CONTEXT": {
      return { ...state, isContextOpen: false };
    }

    default:
      return state;
  }
}

export function persistEpisodeState(state: EpisodeState): void {
  if (state.episodeId === null || typeof window === "undefined") return;
  const payload: PersistedEpisodeState = {
    episodeId: state.episodeId,
    progressIndex: state.progressIndex,
    lockedPromptId: state.lockedPromptId,
    answersByPromptId: state.answersByPromptId,
    witnessingProfile: state.witnessingProfile,
    gating: state.gating,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function loadPersistedEpisodeState(): PersistedEpisodeState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedEpisodeState;
    if (!parsed || typeof parsed.episodeId !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}
