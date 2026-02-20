/**
 * Structured bibliography for Media Mirror. Used in Stage Context drawer
 * (minimal display) and on /methodology (full citations).
 */

import type { StageId } from "./stages";

export type BibliographyEntryId =
  | "bareikyte2024"
  | "holman2014"
  | "figley1995"
  | "zuboff2019"
  | "unPrivacy"
  | "tacticalTech";

export interface BibliographyEntry {
  id: BibliographyEntryId;
  title: string;
  /** 1–2 sentences for drawer; not full APA */
  summary: string;
  url: string;
  /** Short citation for hover tooltip (e.g. "Bareikytė & Makhortykh, 2024") */
  shortCitation: string;
  /** Full citation for /methodology page only */
  fullCitation: string;
}

export const BIBLIOGRAPHY: BibliographyEntry[] = [
  {
    id: "bareikyte2024",
    title: "Digitally witnessable war (Bareikytė & Makhortykh, 2024)",
    summary:
      "Explores how Telegram channels shift from information search to critique and emotionalization during wartime, and the politics of presence and publicness in the Ukrainian conflict.",
    url: "ADD_URL_HERE",
    shortCitation: "Bareikytė & Makhortykh, 2024",
    fullCitation:
      "Bareikytė, T., & Makhortykh, A. (2024). Materiality of Wartime Communication: The Politics of Presence and Publicness in the Ukrainian War on Telegram.",
  },
  {
    id: "holman2014",
    title: "Media exposure and acute stress (Holman et al., 2014)",
    summary:
      "Documents how repeated exposure to collective trauma via media can produce acute stress and anxiety in people who are not directly at the event.",
    url: "ADD_URL_HERE",
    shortCitation: "Holman et al., 2014",
    fullCitation:
      "Holman, E. A., Garfin, D. R., & Silver, R. C. (2014). Media’s role in broadcasting acute stress following the Boston Marathon bombings. Proceedings of the National Academy of Sciences, 111(1), 93–98.",
  },
  {
    id: "figley1995",
    title: "Compassion fatigue (Figley, 1995)",
    summary:
      "Introduces the concept of compassion fatigue among helpers and caregivers exposed to trauma narratives, with relevance to media and crisis exposure.",
    url: "ADD_URL_HERE",
    shortCitation: "Figley, 1995",
    fullCitation:
      "Figley, C. R. (1995). Compassion fatigue: Coping with secondary traumatic stress disorder in those who treat the traumatized. Brunner/Mazel.",
  },
  {
    id: "zuboff2019",
    title: "Surveillance capitalism (Zuboff, 2019)",
    summary:
      "Frames how behavioral data and digital infrastructure shape attention, prediction, and control—relevant to understanding platform dynamics in crisis communication.",
    url: "ADD_URL_HERE",
    shortCitation: "Zuboff, 2019",
    fullCitation:
      "Zuboff, S. (2019). The age of surveillance capitalism: The fight for a human future at the new frontier of power. PublicAffairs.",
  },
  {
    id: "unPrivacy",
    title: "UN Human Rights – Privacy in the digital age",
    summary:
      "International standards and guidance on the right to privacy in the context of digital surveillance and data collection.",
    url: "ADD_URL_HERE",
    shortCitation: "UN Human Rights, Privacy",
    fullCitation:
      "Office of the United Nations High Commissioner for Human Rights. (n.d.). The right to privacy in the digital age.",
  },
  {
    id: "tacticalTech",
    title: "Tactical Tech – Data Detox Kit",
    summary:
      "Practical self-protection habits and guides for digital environments, including privacy and security in messaging and social platforms.",
    url: "ADD_URL_HERE",
    shortCitation: "Tactical Tech, Data Detox Kit",
    fullCitation:
      "Tactical Tech. (n.d.). Data Detox Kit. https://datadetoxkit.org/",
  },
];

/** Stage → list of bibliography entry ids shown in that stage's context drawer */
export const STAGE_REFERENCES: Record<StageId, BibliographyEntryId[]> = {
  "stage-1": ["bareikyte2024", "tacticalTech", "unPrivacy"],
  "stage-2": ["bareikyte2024", "holman2014", "zuboff2019"],
};

export function getEntryById(id: BibliographyEntryId): BibliographyEntry | undefined {
  return BIBLIOGRAPHY.find((e) => e.id === id);
}

export function getEntriesForStage(stageId: StageId): BibliographyEntry[] {
  const ids = STAGE_REFERENCES[stageId] ?? [];
  return ids
    .map((id) => getEntryById(id))
    .filter((e): e is BibliographyEntry => e != null);
}

/** 1-based index of entry in the stage's reference list (for superscript number) */
export function getRefNumber(entryId: BibliographyEntryId, stageId: StageId): number {
  const ids = STAGE_REFERENCES[stageId] ?? [];
  const i = ids.indexOf(entryId);
  return i < 0 ? 0 : i + 1;
}

/** Groupings for /methodology page */
export type BibliographyGroupId =
  | "wartime-witnessing"
  | "emotional-impact"
  | "digital-rights";

export const METHODOLOGY_GROUPS: {
  id: BibliographyGroupId;
  title: string;
  entryIds: BibliographyEntryId[];
}[] = [
  {
    id: "wartime-witnessing",
    title: "Wartime Digital Witnessing",
    entryIds: ["bareikyte2024"],
  },
  {
    id: "emotional-impact",
    title: "Emotional Impact & Media Exposure",
    entryIds: ["holman2014", "figley1995"],
  },
  {
    id: "digital-rights",
    title: "Digital Rights & Infrastructure",
    entryIds: ["zuboff2019", "unPrivacy", "tacticalTech"],
  },
];
