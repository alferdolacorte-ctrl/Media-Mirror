"use client";

import { TAXONOMY, type WitnessTag } from "@/lib/witnessing/taxonomy";

const DISCUSSION_QUESTIONS: Record<WitnessTag, string[]> = {
  CC: [
    "Who gets to set the rules in the channel, and who is silenced?",
    "How do norms about what can be posted emerge without formal moderation?",
    "When does a rule protect people, and when does it exclude them?",
  ],
  SA: [
    "Why do people share or withhold locations in a crisis?",
    "How might sharing a location help or endanger someone?",
    "What would you need to know before reposting a location?",
  ],
  SI: [
    "How do people decide what counts as verified in the moment?",
    "What is the difference between asking for information and spreading a claim?",
    "When is it better to say 'I don't know' than to guess?",
  ],
  MN: [
    "Who is centered in the stories the channel tells, and who is missing?",
    "How do conflicting narratives coexist in the same space?",
    "When does a narrative help people cope, and when does it harm?",
  ],
  C: [
    "What does it cost to criticize the dominant view in the channel?",
    "How do communities hold each other accountable without formal power?",
    "When is critique constructive, and when does it shut down conversation?",
  ],
  EM: [
    "How does emotion show up alongside practical updates?",
    "Why might dismissing emotion as 'irrational' be misleading?",
    "How can a facilitator hold space for both information and feeling?",
  ],
  F: [
    "What role do jokes or small talk play in a crisis channel?",
    "When is 'filler' actually part of how the group holds together?",
    "Should facilitators treat off-topic messages as noise or as data?",
  ],
};

export default function EducationPage() {
  const tags = Object.keys(TAXONOMY) as WitnessTag[];

  return (
    <main className="education-print" style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Discussion prompts: Witnessing taxonomy
      </h1>
      <p style={{ marginBottom: "2rem", color: "#555", fontSize: 14 }}>
        Use these questions in facilitated discussion after the experience. Print this page for handouts.
      </p>
      {tags.map((tag) => (
        <section
          key={tag}
          style={{
            marginBottom: "1.75rem",
            paddingBottom: "1.25rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
            {TAXONOMY[tag].label} ({tag})
          </h2>
          <p style={{ fontSize: 13, color: "#666", marginBottom: "0.75rem" }}>
            {TAXONOMY[tag].whyItMatters}
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {DISCUSSION_QUESTIONS[tag].map((q, i) => (
              <li key={i} style={{ marginBottom: "0.35rem", lineHeight: 1.5 }}>
                {q}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
