"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { PromptChoicePayload } from "@/types/event";
import type { PromptEventPayload } from "@/types/event";
import { track } from "@/lib/telemetry/logger";
import {
  episodeReducer,
  initialEpisodeState,
  loadPersistedEpisodeState,
  persistEpisodeState,
  type EpisodeState,
} from "./episodeReducer";

interface EpisodeContextValue extends EpisodeState {
  visibleEvents: EpisodeState["events"];
  selectChoice: (promptId: string, choice: PromptChoicePayload) => void;
  advance: () => void;
  dispatch: React.Dispatch<import("./episodeReducer").EpisodeAction>;
  openTransition: () => void;
  closeTransition: () => void;
  startNextStage: () => void;
  openContext: () => void;
  closeContext: () => void;
  completeStage: () => void;
}

const EpisodeContext = createContext<EpisodeContextValue | null>(null);

export function EpisodeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(episodeReducer, initialEpisodeState);
  const episodeStartedRef = useRef(false);
  const completedRef = useRef(false);
  const segmentStartRef = useRef<number>(0);
  const prevProgressRef = useRef(0);
  const lastPromptShownRef = useRef<string | null>(null);

  useEffect(() => {
    const persisted = loadPersistedEpisodeState();
    dispatch({ type: "HYDRATE", payload: persisted });
  }, []);

  useEffect(() => {
    persistEpisodeState(state);
  }, [
    state.episodeId,
    state.progressIndex,
    state.lockedPromptId,
    state.answersByPromptId,
    state.witnessingProfile,
    state.gating,
  ]);

  useEffect(() => {
    if (state.episodeId && state.events.length > 0) {
      if (segmentStartRef.current === 0) segmentStartRef.current = Date.now();
      if (!episodeStartedRef.current) {
        episodeStartedRef.current = true;
        track("EPISODE_STARTED", { episodeId: state.episodeId, ts: Date.now() });
      }
    }
    if (state.episodeId && state.events.length > 0 && state.progressIndex >= state.events.length - 1 && !completedRef.current) {
      completedRef.current = true;
      track("EPISODE_COMPLETED", { episodeId: state.episodeId, ts: Date.now() });
    }
  }, [state.episodeId, state.events.length, state.progressIndex]);

  useEffect(() => {
    episodeStartedRef.current = false;
    completedRef.current = false;
    lastPromptShownRef.current = null;
    prevProgressRef.current = 0;
    segmentStartRef.current = Date.now();
  }, [state.episodeId]);

  useEffect(() => {
    const last = state.events[state.progressIndex];
    if (last?.type === "prompt" && state.episodeId) {
      const promptId = (last.payload as PromptEventPayload).promptId;
      if (lastPromptShownRef.current !== promptId) {
        lastPromptShownRef.current = promptId;
        track("PROMPT_SHOWN", {
          episodeId: state.episodeId,
          promptId,
          index: state.progressIndex,
          ts: Date.now(),
        });
      }
    }
  }, [state.events, state.progressIndex, state.episodeId]);

  useEffect(() => {
    if (state.progressIndex > prevProgressRef.current && state.episodeId) {
      track("SEGMENT_TIME", {
        episodeId: state.episodeId,
        fromIndex: prevProgressRef.current,
        toIndex: state.progressIndex,
        ms: Date.now() - segmentStartRef.current,
      });
      segmentStartRef.current = Date.now();
      prevProgressRef.current = state.progressIndex;
    }
  }, [state.progressIndex, state.episodeId]);

  useEffect(() => {
    const onDropoff = () => {
      if (state.episodeId != null) {
        track("DROPOFF", { episodeId: state.episodeId, lastIndex: state.progressIndex, ts: Date.now() });
      }
    };
    window.addEventListener("visibilitychange", onDropoff);
    window.addEventListener("beforeunload", onDropoff);
    return () => {
      window.removeEventListener("visibilitychange", onDropoff);
      window.removeEventListener("beforeunload", onDropoff);
    };
  }, [state.episodeId, state.progressIndex]);

  const visibleEvents = useMemo(
    () => state.events.slice(0, state.progressIndex + 1),
    [state.events, state.progressIndex]
  );

  const selectChoice = useCallback(
    (promptId: string, choice: PromptChoicePayload) => {
      const episodeId = state.episodeId;
      dispatch({ type: "SELECT_CHOICE", promptId, choice });
      if (episodeId) {
        track("CHOICE_SELECTED", {
          episodeId,
          promptId,
          choiceId: choice.id,
          tag: choice.tag,
          ts: Date.now(),
        });
      }
    },
    [state.episodeId]
  );

  const advance = useCallback(() => {
    dispatch({ type: "ADVANCE" });
  }, []);

  useEffect(() => {
    if (state.events.length === 0) return;
    const lastIndex = state.progressIndex;
    const lastEvent = state.events[lastIndex];
    if (lastEvent?.type === "checkpoint" && state.stageStatus === "in_progress") {
      dispatch({ type: "COMPLETE_STAGE" });
    }
  }, [state.events, state.progressIndex, state.stageStatus, dispatch]);

  const openTransition = useCallback(() => dispatch({ type: "OPEN_TRANSITION" }), [dispatch]);
  const closeTransition = useCallback(() => dispatch({ type: "CLOSE_TRANSITION" }), [dispatch]);
  const startNextStage = useCallback(() => dispatch({ type: "START_NEXT_STAGE" }), [dispatch]);
  const openContext = useCallback(() => dispatch({ type: "OPEN_CONTEXT" }), [dispatch]);
  const closeContext = useCallback(() => dispatch({ type: "CLOSE_CONTEXT" }), [dispatch]);
  const completeStage = useCallback(() => dispatch({ type: "COMPLETE_STAGE" }), [dispatch]);

  const value = useMemo<EpisodeContextValue>(
    () => ({
      ...state,
      visibleEvents,
      selectChoice,
      advance,
      dispatch,
      openTransition,
      closeTransition,
      startNextStage,
      openContext,
      closeContext,
      completeStage,
    }),
    [state, visibleEvents, selectChoice, advance, openTransition, closeTransition, startNextStage, openContext, closeContext, completeStage]
  );

  return (
    <EpisodeContext.Provider value={value}>{children}</EpisodeContext.Provider>
  );
}

export function useEpisode(): EpisodeContextValue {
  const ctx = useContext(EpisodeContext);
  if (!ctx) throw new Error("useEpisode must be used within EpisodeProvider");
  return ctx;
}
