"use client";

import Link from "next/link";

export default function AfterScreeningPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        After the screening: go deeper
      </h1>
      <p style={{ marginBottom: "1.5rem" }}>
        Choose one of the following episodes to explore different witnessing dynamics
        and reflect on how the channel behaves.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link
          href="/impact/episode/episode-002"
          style={{
            display: "block",
            padding: "1rem 1.25rem",
            border: "2px solid #4a90e2",
            borderRadius: 12,
            color: "#4a90e2",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Episode 2: Narratives Form (MN + C)
        </Link>
        <Link
          href="/impact/episode/episode-003"
          style={{
            display: "block",
            padding: "1rem 1.25rem",
            border: "2px solid #4a90e2",
            borderRadius: 12,
            color: "#4a90e2",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Episode 3: Emotionalization (EM + C + MN)
        </Link>
      </div>
      <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.8 }}>
        Each episode includes prompts and a short reflection at the end.
      </p>
    </main>
  );
}
