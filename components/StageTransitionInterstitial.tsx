"use client";

import { useEffect, useRef } from "react";
import type { StageDefinition } from "@/lib/stages";

interface StageTransitionInterstitialProps {
  nextStage: StageDefinition;
  onStart: () => void;
  onOpenContext: () => void;
  onClose: () => void;
}

export default function StageTransitionInterstitial({
  nextStage,
  onStart,
  onOpenContext,
  onClose,
}: StageTransitionInterstitialProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-labelledby="stage-transition-title"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 20,
        animation: "stageTransitionFade 0.25s ease-out",
      }}
    >
      <style>{`
        @keyframes stageTransitionFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .stage-transition-card {
          animation: stageTransitionSlide 0.3s ease-out;
        }
        @keyframes stageTransitionSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="stage-transition-card"
        style={{
          maxWidth: 420,
          width: "90%",
          backgroundColor: "#ffffff",
          borderRadius: 16,
          border: "1px solid #d1d1d1",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          padding: "1.5rem 1.75rem",
        }}
      >
        <h2
          id="stage-transition-title"
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111",
            margin: "0 0 0.5rem 0",
          }}
        >
          {nextStage.title}
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#444",
            lineHeight: 1.5,
            margin: "0 0 1.25rem 0",
          }}
        >
          {nextStage.teaser}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            type="button"
            onClick={onStart}
            style={{
              padding: "0.5rem 1rem",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#4a90e2",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Start {nextStage.title.replace(/^Stage \d+:\s*/, "")}
          </button>
          <button
            type="button"
            onClick={onOpenContext}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: 12,
              color: "#4a90e2",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Open Stage Context
          </button>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            padding: 0,
            border: "none",
            background: "transparent",
            color: "#666",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
