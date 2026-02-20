"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import type { PromptEventPayload } from "@/types/event";
import { loadEpisode } from "@/lib/episodes/loadEpisode";
import { mapEpisodeToEvents } from "@/lib/episodes/mapEpisodeToEvents";
import { useEpisode } from "@/lib/episode/EpisodeProvider";
import { buildReveal } from "@/lib/witnessing/revealLogic";
import EventRenderer from "@/components/EventRenderer";

export default function ImpactEpisodePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "episode-001";
  const {
    visibleEvents,
    answersByPromptId,
    selectChoice,
    advance,
    events,
    dispatch,
    episodeId,
  } = useEpisode();

  useEffect(() => {
    loadEpisode(id).then((episode) => {
      const events = mapEpisodeToEvents(episode);
      dispatch({ type: "LOAD_EPISODE", episodeId: episode.id, events });
    });
  }, [id, dispatch]);

  useEffect(() => {
    if (events.length === 0) return;
    const intervalId = setInterval(advance, 2000);
    return () => clearInterval(intervalId);
  }, [events.length, advance]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleEvents.length]);

  return (
    <main
      style={{
        height: "100vh",
        margin: 0,
        backgroundColor: "#e5e5e5",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: 24,
          border: "1px solid #d1d1d1",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "0.8rem 1rem",
            borderBottom: "1px solid #d1d1d1",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {episodeId ?? id} — Witness Lab
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.9rem 1.1rem 1.2rem",
            backgroundColor: "#e5e5e5",
          }}
        >
          {visibleEvents.map((event, i) => {
            const prev = i > 0 ? visibleEvents[i - 1] : null;
            const isRevealAfterAnsweredPrompt =
              event.type === "reveal" &&
              prev?.type === "prompt" &&
              episodeId &&
              answersByPromptId[(prev.payload as PromptEventPayload).promptId];
            const answer =
              prev?.type === "prompt"
                ? answersByPromptId[(prev.payload as PromptEventPayload).promptId]
                : null;
            const revealOverride =
              isRevealAfterAnsweredPrompt && answer && episodeId
                ? buildReveal({
                    tag: answer.tag,
                    episodeId,
                    promptId: (prev!.payload as PromptEventPayload).promptId,
                    choiceId: answer.choiceId,
                  })
                : undefined;
            return (
              <EventRenderer
                key={event.id}
                event={event}
                promptSelectedAnswer={
                  event.type === "prompt"
                    ? answersByPromptId[(event.payload as PromptEventPayload).promptId] ?? null
                    : undefined
                }
                promptOnSelectChoice={
                  event.type === "prompt"
                    ? (choice) =>
                        selectChoice(
                          (event.payload as PromptEventPayload).promptId,
                          choice
                        )
                    : undefined
                }
                revealOverride={event.type === "reveal" ? revealOverride : undefined}
              />
            );
          })}
          <div ref={messagesEndRef} />
          {visibleEvents.length === 0 && (
            <div style={{ marginTop: "2rem", textAlign: "center", fontSize: 12, color: "#666" }}>
              Loading…
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
