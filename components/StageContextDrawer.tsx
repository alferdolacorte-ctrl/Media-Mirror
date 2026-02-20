"use client";

import { useEffect, useRef } from "react";
import type { StageDefinition } from "@/lib/stages";
import { getEntriesForStage } from "@/lib/bibliography";
import type { BibliographyEntryId } from "@/lib/bibliography";

interface StageContextDrawerProps {
  stage: StageDefinition;
  isOpen: boolean;
  onClose: () => void;
  /** When set, drawer scrolls to this reference block (after open). Cleared by parent after scroll. */
  scrollToRefId?: BibliographyEntryId | null;
  onScrolledToRef?: () => void;
}

export default function StageContextDrawer({
  stage,
  isOpen,
  onClose,
  scrollToRefId,
  onScrolledToRef,
}: StageContextDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !scrollToRefId || !asideRef.current) return;
    const el = asideRef.current.querySelector(`[id="ref-${scrollToRefId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      onScrolledToRef?.();
    }
  }, [isOpen, scrollToRefId, onScrolledToRef]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  if (!isOpen) return null;

  const { context } = stage;
  const researchEntries = getEntriesForStage(stage.id);

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 40,
          animation: "stageDrawerBackdrop 0.2s ease-out",
        }}
      />
      <style>{`
        @keyframes stageDrawerBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes stageDrawerSlide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <aside
        role="dialog"
        aria-labelledby="stage-context-title"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(400px, 90vw)",
          backgroundColor: "#ffffff",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          zIndex: 41,
          overflowY: "auto",
          padding: "1.25rem 1.5rem",
          animation: "stageDrawerSlide 0.25s ease-out",
        }}
      >
        <div ref={asideRef} style={{ minHeight: "100%" }}>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            padding: 0,
            border: "none",
            background: "transparent",
            color: "#666",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <h2
          id="stage-context-title"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#111",
            margin: "0 0 0.75rem 0",
            paddingRight: 32,
          }}
        >
          {stage.title}
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#333",
            lineHeight: 1.6,
            margin: "0 0 1rem 0",
          }}
        >
          {context.summary}
        </p>
        <h3
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 0 0.5rem 0",
          }}
        >
          Key themes
        </h3>
        <ul
          style={{
            margin: "0 0 1rem 0",
            paddingLeft: "1.25rem",
            fontSize: 13,
            lineHeight: 1.5,
            color: "#333",
          }}
        >
          {context.themes.map((t, i) => (
            <li key={i} style={{ marginBottom: "0.25rem" }}>
              {t}
            </li>
          ))}
        </ul>
        <h3
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 0 0.5rem 0",
          }}
        >
          Readings
        </h3>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
          {context.readings.map((r, i) => (
            <li
              key={i}
              style={{
                marginBottom: "0.75rem",
                paddingBottom: "0.75rem",
                borderBottom: i < context.readings.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              {r.url.startsWith("ADD_URL") ? (
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#666",
                  }}
                >
                  {r.title}
                </span>
              ) : (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#4a90e2",
                    textDecoration: "none",
                  }}
                >
                  {r.title}
                </a>
              )}
              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  margin: "0.25rem 0 0 0",
                  lineHeight: 1.4,
                }}
              >
                {r.note}
              </p>
            </li>
          ))}
        </ul>
        {researchEntries.length > 0 && (
          <>
            <h3
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "1rem 0 0.5rem 0",
              }}
            >
              Research Foundations
            </h3>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {researchEntries.map((entry) => (
                <li
                  key={entry.id}
                  id={`ref-${entry.id}`}
                  style={{
                    marginBottom: "0.75rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111",
                    }}
                  >
                    {entry.title}
                  </span>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#666",
                      margin: "0.25rem 0 0 0",
                      lineHeight: 1.4,
                    }}
                  >
                    {entry.summary}
                  </p>
                  {!entry.url.startsWith("ADD_URL") ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{
                        fontSize: 12,
                        color: "#4a90e2",
                        textDecoration: "none",
                        marginTop: "0.25rem",
                        display: "inline-block",
                      }}
                    >
                      Read more →
                    </a>
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#999",
                        marginTop: "0.25rem",
                        display: "inline-block",
                      }}
                    >
                      Read more →
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        </div>
      </aside>
    </>
  );
}
