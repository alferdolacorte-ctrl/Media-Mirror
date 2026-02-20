"use client";

import Link from "next/link";

export default function BeforeScreeningPage() {
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
        Before the screening: 5-minute primer
      </h1>
      <p style={{ marginBottom: "1rem" }}>
        This short experience simulates a wartime Telegram channel in the first
        hours of a crisis. You will see synthetic messages and be asked to make
        choices about how to respond. The goal is to surface witnessing dynamics—how
        people search for information, share (or withhold) locations, set rules,
        and express emotion—without sensationalizing. No real data is used.
      </p>
      <p style={{ marginBottom: "1.5rem" }}>
        When you are ready, start Episode 1: Information Scarcity. It takes about
        5 minutes.
      </p>
      <Link
        href="/impact/episode/episode-001"
        style={{
          display: "inline-block",
          padding: "0.5rem 1rem",
          backgroundColor: "#4a90e2",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Start Episode 1
      </Link>
    </main>
  );
}
