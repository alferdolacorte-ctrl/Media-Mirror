/**
 * Stage registry: maps stages to episode files and holds context content.
 * Used for stage-to-stage transitions and the Stage Context panel.
 */

export type StageId = "stage-1" | "stage-2";

export interface StageReading {
  title: string;
  note: string;
  url: string;
}

export interface StageContextContent {
  summary: string;
  themes: string[];
  readings: StageReading[];
  citations?: string[];
}

export interface StageDefinition {
  id: StageId;
  title: string;
  subtitle?: string;
  badgeLabel: string;
  teaser: string;
  context: StageContextContent;
  /** Episode file id passed to loadEpisode (e.g. episode-001) */
  episodeFile: string;
}

export const STAGES: StageDefinition[] = [
  {
    id: "stage-1",
    title: "Stage 1: Information Scarcity",
    subtitle: "Shock / Pereklychka",
    badgeLabel: "STAGE 1 — SHOCK / PEREKLYCHKA",
    teaser: "The first hours are about locating people and negotiating what can be shared. Next we look at how narratives form and how the channel debates truth.",
    episodeFile: "episode-001",
    context: {
      summary:
        "In the first hours of a crisis, Telegram channels often enter a phase researchers call pereklychka—a “switch-over” where communication shifts from everyday chatter to survival coordination. Information is scarce: people ask who is safe, where it is dangerous, and what is known. Spatial attribution (SA) appears as people share or withhold locations and warn against posting exact addresses. At the same time, the channel begins to negotiate chat rules and safety (CC): what is safe to post, how to avoid helping adversaries, and how to separate verified information from rumors. Verification under uncertainty becomes a central challenge.",
      themes: [
        "Searching for information (SI)",
        "Spatial attribution (SA)",
        "Chat rules and safety (CC)",
        "Verification under uncertainty",
      ],
      readings: [
        {
          title: "Digitally witnessable war (Bareikytė & Makhortykh, 2024)",
          note: "How Telegram witnessing shifts from information search to critique and emotionalization.",
          url: "ADD_URL_HERE",
        },
        {
          title: "Tactical Tech – Data Detox Kit",
          note: "Practical self-protection habits for digital environments.",
          url: "ADD_URL_HERE",
        },
      ],
    },
  },
  {
    id: "stage-2",
    title: "Stage 2: Narrative Formation & Critique",
    subtitle: "Narratives Form",
    badgeLabel: "STAGE 2 — NARRATIVE FORMATION & CRITIQUE",
    teaser: "Stories and interpretations clash. The channel debates authenticity, staging, and who gets to judge. Next we explore emotion and governance.",
    episodeFile: "episode-002",
    context: {
      summary:
        "As the crisis unfolds, the channel shifts from immediate coordination to narrative sense-making. People tell stories about what happened, who is to blame, and who stayed or left. Making narratives (MN) shapes how the group understands the situation; at the same time, critique (C) challenges dominant stories and calls out misinformation or staging. Authenticity debates—is this photo real? Is this narrative fair?—mix with polyvocal meaning-making, where multiple interpretations coexist and sometimes polarize. Understanding this stage helps facilitators notice who is centered in the stories and how critique is received.",
      themes: [
        "Making narratives (MN)",
        "Critique (C)",
        "Authenticity and staging debates",
        "Polyvocality and polarization",
      ],
      readings: [
        {
          title: "Digitally witnessable war (Bareikytė & Makhortykh, 2024)",
          note: "How Telegram witnessing shifts from information search to critique and emotionalization.",
          url: "ADD_URL_HERE",
        },
        {
          title: "Tactical Tech – Data Detox Kit",
          note: "Practical self-protection habits for digital environments.",
          url: "ADD_URL_HERE",
        },
      ],
    },
  },
];

export function getStageById(id: StageId): StageDefinition | undefined {
  return STAGES.find((s) => s.id === id);
}

export function getNextStage(currentId: StageId): StageDefinition | null {
  const i = STAGES.findIndex((s) => s.id === currentId);
  if (i < 0 || i >= STAGES.length - 1) return null;
  return STAGES[i + 1] ?? null;
}

export function getStageIndex(id: StageId): number {
  const i = STAGES.findIndex((s) => s.id === id);
  return i < 0 ? 0 : i;
}

export function getTotalStages(): number {
  return STAGES.length;
}
