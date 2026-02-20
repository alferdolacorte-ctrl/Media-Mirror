"use client";

import Link from "next/link";
import { METHODOLOGY_GROUPS, getEntryById } from "@/lib/bibliography";
import type { BibliographyEntryId } from "@/lib/bibliography";

export default function MethodologyPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      <p style={{ marginBottom: "1rem" }}>
        <Link
          href="/"
          style={{ color: "#4a90e2", textDecoration: "none", fontSize: 14 }}
        >
          ← Back to Crisis Chat
        </Link>
      </p>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#111",
          marginBottom: "0.5rem",
        }}
      >
        Research &amp; methodology
      </h1>
      <p
        style={{
          marginBottom: "2rem",
          color: "#555",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        Full bibliography for the Media Mirror prototype, grouped by theme. Use
        the Stage Context panel in the chat for short summaries and links.
      </p>

      {METHODOLOGY_GROUPS.map((group) => (
        <section
          key={group.id}
          style={{
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#333",
              marginBottom: "1rem",
            }}
          >
            {group.title}
          </h2>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {group.entryIds.map((id) => {
              const entry = getEntryById(id as BibliographyEntryId);
              if (!entry) return null;
              return (
                <li
                  key={entry.id}
                  style={{
                    marginBottom: "1rem",
                    paddingLeft: 0,
                  }}
                >
                  {entry.url.startsWith("ADD_URL") ? (
                    <span
                      style={{
                        fontSize: 14,
                        color: "#333",
                        lineHeight: 1.6,
                      }}
                    >
                      {entry.fullCitation}
                    </span>
                  ) : (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{
                        fontSize: 14,
                        color: "#333",
                        lineHeight: 1.6,
                        textDecoration: "none",
                      }}
                    >
                      {entry.fullCitation}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
