"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Event, MessageEventPayload, PromptEventPayload } from "../types/event";
import type { Phase } from "../types/message";
import { loadEpisode } from "../lib/episodes/loadEpisode";
import { mapEpisodeToEvents } from "../lib/episodes/mapEpisodeToEvents";
import { useEpisode } from "../lib/episode/EpisodeProvider";
import { getStageById, getNextStage, getStageIndex, getTotalStages } from "../lib/stages";
import type { BibliographyEntryId } from "../lib/bibliography";
import { buildReveal } from "../lib/witnessing/revealLogic";
import EventRenderer from "../components/EventRenderer";
import StageTransitionInterstitial from "../components/StageTransitionInterstitial";
import StageContextDrawer from "../components/StageContextDrawer";



// Helper functions and constants moved to MessageBubble component



const phaseConfig: Record<

  Phase,

  { label: string; accent: string; bgBubble: string; bgHeader: string }

> = {

  shock: {

    label: "Stage 1 – Shock / Pereklychka",

    accent: "#60a5fa",

    bgBubble: "#0b1220",

    bgHeader: "radial-gradient(circle at top, #0f172a 0, #020617 70%)",

  },

  negotiation: {

    label: "Stage 2 – Negotiation & Safety",

    accent: "#a5b4fc",

    bgBubble: "#0b1120",

    bgHeader: "radial-gradient(circle at top, #0f172a 0, #020617 70%)",

  },

  polyvocal: {

    label: "Stage 3 – Polyvocal Narratives & Critique",

    accent: "#c4b5fd",

    bgBubble: "#111827",

    bgHeader: "radial-gradient(circle at top, #1b1630 0, #020617 70%)",

  },

  emotional: {

    label: "Stage 4 – Emotional Surge",

    accent: "#fb7185",

    bgBubble: "#111827",

    bgHeader: "radial-gradient(circle at top, #111827 0, #020617 70%)",

  },

  routine: {

    label: "Stage 5 – Routine Crisis",

    accent: "#a3e635",

    bgBubble: "#0f172a",

    bgHeader: "radial-gradient(circle at top, #111827 0, #020617 70%)",

  },

};



const stageDescriptions: Record<Phase, string> = {

  shock:

    "First hours of the crisis: people try to locate explosions, blocked streets and missing relatives. Messages are short, functional and focused on survival.",

  negotiation:

    "After the initial shock, the chat begins to discuss rules: what is safe to post, how to avoid helping the enemy, how to separate verified information from rumors.",

  polyvocal:

    "Different stories and interpretations collide: accusations of collaboration, discussions about propaganda, conflicting accounts of what the city looks like.",

  emotional:

    "Anger, grief, fear and nostalgia break into the channel. People curse, mourn, reminisce and argue, all in the same stream as practical updates.",

  routine:

    "The crisis becomes background: outages, water trucks, queues and movement of checkpoints. The chat documents how catastrophe turns into everyday life.",

};



export default function Home() {
  const {
    visibleEvents,
    answersByPromptId,
    selectChoice,
    advance,
    events,
    dispatch,
    episodeId,
    currentStageId,
    stageStatus,
    isTransitionOpen,
    isContextOpen,
    openTransition,
    closeTransition,
    startNextStage,
    openContext,
    closeContext,
  } = useEpisode();

  const currentStage = getStageById(currentStageId) ?? getStageById("stage-1")!;
  const nextStage = getNextStage(currentStageId);

  useEffect(() => {
    const episodeFile = currentStage.episodeFile;
    loadEpisode(episodeFile).then((episode) => {
      const events = mapEpisodeToEvents(episode);
      dispatch({ type: "LOAD_EPISODE", episodeId: episode.id, events });
    });
  }, [currentStageId, dispatch]);

  useEffect(() => {
    if (events.length === 0) return;
    const id = setInterval(advance, 2000);
    return () => clearInterval(id);
  }, [events.length, advance]);

  const [showIntro, setShowIntro] = useState(true);
  const [scrollToRefId, setScrollToRefId] = useState<BibliographyEntryId | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleScrollToRef = (entryId: BibliographyEntryId) => {
    openContext();
    setScrollToRefId(entryId);
  };



  // Auto-scroll to bottom when new events arrive

  useEffect(() => {

    if (messagesEndRef.current) {

      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });

    }

  }, [visibleEvents.length]);



  // Determine current phase from the last message event

  // Future: Phase could also be determined from checkpoint events

  const currentPhase: Phase = useMemo(() => {

    const lastMessageEvent = [...visibleEvents]

      .reverse()

      .find((e): e is Event & { type: "message"; payload: MessageEventPayload } => e.type === "message");

    if (lastMessageEvent) {

      return lastMessageEvent.payload.message.phase;

    }

    return "shock";

  }, [visibleEvents]);



  const cfg = phaseConfig[currentPhase];

  return (
    <main

      style={{

        height: "100vh",

        overflow: "hidden",

        margin: 0,

        backgroundColor: "#e5e5e5",

        color: "#000000",

        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

        display: "flex",

        alignItems: "stretch",

        justifyContent: "center",

        padding: "1.2rem",

        position: "relative",

      }}

    >

      {showIntro && (

        <div

          style={{

            position: "fixed",

            inset: 0,

            backgroundImage: "url('/Photos/the_longer_you_bleed%20%289%29.jpg')",

            backgroundSize: "cover",

            backgroundPosition: "center",

            backgroundRepeat: "no-repeat",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            zIndex: 50,

          }}

        >

          {/* Dark overlay for readability */}

          <div

            style={{

              position: "absolute",

              inset: 0,

              backgroundColor: "rgba(2,6,23,0.85)",

            }}

          />

          <div

            style={{

              width: "100%",

              maxWidth: 720,

              borderRadius: 24,

              border: "1px solid rgba(255,255,255,0.1)",

              background:

                "radial-gradient(circle at top, rgba(2,6,23,0.95) 0, rgba(2,6,23,0.9) 100%)",

              boxShadow: "0 30px 90px rgba(0,0,0,0.8)",

              padding: "1.8rem 2rem 1.6rem",

              position: "relative",

              zIndex: 1,

              fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",

            }}

          >

            <h1

              style={{

                fontSize: "1.4rem",

                margin: 0,

                marginBottom: "0.6rem",

                color: "#ffffff",

                fontWeight: 600,

              }}

            >

              Crisis Chat – Synthetic Wartime Telegram

            </h1>

            <p

              style={{

                fontSize: "0.9rem",

                marginBottom: "0.9rem",

                color: "#d1d1d1",

                lineHeight: 1.6,

              }}

            >

              This interface is a continuous, synthetic reconstruction of a

              Telegram group chat during the Russian invasion of Ukraine. The

              messages are fictional, but the way the chat behaves follows

              patterns described in research on real wartime channels.

            </p>



            <p

              style={{

                fontSize: "0.85rem",

                marginBottom: "0.7rem",

                color: "#d1d1d1",

              }}

            >

              Over time, the chat moves through different stages:

            </p>



            <ul

              style={{

                fontSize: "0.82rem",

                paddingLeft: "1.1rem",

                marginTop: 0,

                marginBottom: "0.9rem",

                color: "#d1d1d1",

                lineHeight: 1.6,

              }}

            >

              <li>

                <strong style={{ color: "#7dd3fc" }}>Shock / Pereklychka</strong> – people locate danger and

                check if others are alive.

              </li>

              <li>

                <strong style={{ color: "#7dd3fc" }}>Negotiation &amp; Safety</strong> – the group decides what

                is safe to post and how to avoid helping the enemy.

              </li>

              <li>

                <strong style={{ color: "#7dd3fc" }}>Polyvocal Narratives</strong> – competing stories,

                interpretations and critiques of the occupation appear.

              </li>

              <li>

                <strong style={{ color: "#7dd3fc" }}>Emotional Surge</strong> – anger, grief, nostalgia and

                insults flood the feed.

              </li>

              <li>

                <strong style={{ color: "#7dd3fc" }}>Routine Crisis</strong> – queues, outages and checkpoints

                become everyday background.

              </li>

            </ul>



            <p

              style={{

                fontSize: "0.8rem",

                marginBottom: "1.1rem",

                color: "#d1d1d1",

                lineHeight: 1.5,

              }}

            >

              The chat runs in real time: new messages appear continuously, and

              the current stage changes as the simulated timeline advances. No

              real Telegram data is shown here.

            </p>



            <p

              style={{

                fontSize: "0.75rem",

                marginTop: "1.4rem",

                marginBottom: "1.1rem",

                lineHeight: 1.4,

                color: "#d1d1d1",

              }}

            >

              This project is inspired by the research described in:<br />

              <em style={{ color: "#d1d1d1" }}>

                Bareikytė, T. &amp; Makhortykh, A. (2024). Materiality of Wartime

                Communication: The Politics of Presence and Publicness in the

                Ukrainian War on Telegram.

              </em>

            </p>



            <div

              style={{

                display: "flex",

                justifyContent: "flex-end",

                gap: 10,

              }}

            >

              <button

                onClick={() => setShowIntro(false)}

                style={{

                  borderRadius: 999,

                  border: "1px solid #7dd3fc",

                  backgroundColor: "transparent",

                  color: "#7dd3fc",

                  padding: "0.35rem 0.9rem",

                  fontSize: "0.8rem",

                  cursor: "pointer",

                  fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",

                  transition: "all 0.2s ease",

                }}

                onMouseEnter={(e) => {

                  e.currentTarget.style.backgroundColor = "#7dd3fc";

                  e.currentTarget.style.color = "#000000";

                }}

                onMouseLeave={(e) => {

                  e.currentTarget.style.backgroundColor = "transparent";

                  e.currentTarget.style.color = "#7dd3fc";

                }}

              >

                Enter the chat

              </button>

            </div>

          </div>

        </div>

      )}



      <div

        style={{

          width: "100%",
          maxWidth: 900,
          height: "100%",
          borderRadius: 24,
          border: "1px solid #d1d1d1",
          overflow: "hidden",
          boxShadow: "0 26px 80px rgba(0,0,0,0.65)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          position: "relative",
        }}

      >

        {/* header */}

        <div

          style={{

            padding: "0.8rem 1rem",

            borderBottom: "1px solid #d1d1d1",

            background: "#ffffff",

            display: "flex",

            alignItems: "center",

            gap: 10,

          }}

        >

          <div

            style={{

              width: 36,

              height: 36,

              borderRadius: "50%",

              backgroundColor: "#4a90e2",

              color: "#ffffff",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: 14,

              fontWeight: 600,

            }}

          >

            CC

          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#000000" }}>
              Crisis Chat · City Channel
            </div>
            <div style={{ fontSize: 11, opacity: 0.65, color: "#666666" }}>
              synthetic reconstruction of a wartime Telegram chat
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                color: "#666666",
              }}
            >
              Stage {getStageIndex(currentStageId) + 1} of {getTotalStages()}
            </span>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                padding: "2px 8px",
                borderRadius: 999,
                border: `1px solid ${cfg.accent}80`,
                color: cfg.accent,
              }}
            >
              {currentStage.badgeLabel}
            </div>
            <button
              type="button"
              onClick={openContext}
              style={{
                fontSize: 11,
                color: "#4a90e2",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                padding: "2px 4px",
              }}
            >
              Stage Context
            </button>
            <Link
              href="/methodology"
              style={{
                fontSize: 11,
                color: "#4a90e2",
                textDecoration: "underline",
                padding: "2px 4px",
              }}
            >
              Methodology
            </Link>
          </div>
        </div>



        {/* stage explanation */}

        <div

          style={{

            padding: "0.6rem 1rem 0.4rem",

            borderBottom: "1px solid #d1d1d1",

            backgroundColor: "#f5f5f5",

          }}

        >

          <p

            style={{

              fontSize: 12,

              opacity: 0.8,

              margin: 0,

              color: "#333333",

            }}

          >

            {stageDescriptions[currentPhase]}

          </p>

        </div>



        {/* messages */}

        <div

          style={{

            flex: 1,

            overflowY: "auto",

            padding: "0.9rem 1.1rem 1.2rem",

            backgroundColor: "#e5e5e5",

            backgroundImage: "none",

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
                currentStageId={currentStageId}
                onScrollToRef={handleScrollToRef}
              />
            );
          })}

          <div ref={messagesEndRef} />

          {visibleEvents.length === 0 && (

            <div

              style={{

                marginTop: "2rem",

                textAlign: "center",

                fontSize: 12,

                opacity: 0.7,

                color: "#666666",

              }}

            >

              Waiting for the first messages of the crisis…

            </div>

          )}

        </div>



        {/* Stage transition interstitial (overlay inside chat frame) */}
        {isTransitionOpen && nextStage && (
          <StageTransitionInterstitial
            nextStage={nextStage}
            onStart={startNextStage}
            onOpenContext={() => {
              closeTransition();
              openContext();
            }}
            onClose={closeTransition}
          />
        )}

        {/* Bottom bar: CTA when stage completed, else disabled input */}
        {!isTransitionOpen && (
          <div
            style={{
              padding: "0.6rem 1rem",
              borderTop: "1px solid #d1d1d1",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {stageStatus === "completed" && nextStage ? (
              <button
                type="button"
                onClick={openTransition}
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "#4a90e2",
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                }}
              >
                Continue to {nextStage.title} →
              </button>
            ) : (
              <>
                <div
                  style={{
                    flex: 1,
                    borderRadius: 999,
                    backgroundColor: "#f0f0f0",
                    boxShadow: "0 0 0 1px #d1d1d1 inset",
                    padding: "0.4rem 0.8rem",
                    fontSize: 12,
                    color: "#666666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Type a message… (simulation)
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: "#0ea5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#020617",
                  }}
                >
                  ↗︎
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <StageContextDrawer
        stage={currentStage}
        isOpen={isContextOpen}
        onClose={closeContext}
        scrollToRefId={scrollToRefId}
        onScrolledToRef={() => setScrollToRefId(null)}
      />
    </main>

  );

}
