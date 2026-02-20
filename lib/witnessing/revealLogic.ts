import { TAXONOMY, type WitnessTag } from "./taxonomy";

/** Episode + tag -> 1–2 lines of phase-specific context (early-war pereklychka, narratives, emotionalization). */
const episodeContext: Record<string, string> = {
  "episode-001:SI":
    "In the first hours, information is scarce; people coordinate to locate others and verify what is safe.",
  "episode-001:SA":
    "Early on, the channel negotiates what can be shared about places without endangering anyone.",
  "episode-001:CC":
    "Chat rules and moderation emerge under pressure—who can speak, what is allowed.",
  "episode-001:EM":
    "Emotion runs high even as people seek practical updates.",
  "episode-002:MN":
    "Stories and interpretations clash; people try to make sense of what happened and who is to blame.",
  "episode-002:C":
    "Critique of narratives and of those who stayed or left surfaces in the channel.",
  "episode-003:EM":
    "Anger, grief, and language become central; the chat holds both support and conflict.",
  "episode-003:C":
    "Governance and norms are debated—who gets to judge, and how the group should respond.",
  "episode-003:MN":
    "Narratives about loyalty, identity, and responsibility circulate alongside raw emotion.",
};

/** One-line care note by tag (verification, uncertainty, safety). */
const careNotes: Partial<Record<WitnessTag, string>> = {
  SI: "Verify before sharing; uncertainty is normal in crisis.",
  SA: "Locations can put people at risk; avoid reposting exact addresses.",
  CC: "Notice who sets rules and who is silenced.",
  MN: "Multiple stories can be true; be careful not to amplify one view.",
  C: "Critique has a cost; consider who can speak safely.",
  EM: "Emotional content is part of witnessing; treat it with care.",
};

export interface BuildRevealInput {
  tag: string;
  episodeId: string;
  promptId: string;
  choiceId: string;
}

export interface BuildRevealOutput {
  title: string;
  body: string;
  careNote: string;
}

/**
 * Build reveal content after a choice: category line, episode context, care note.
 * Uses TAXONOMY as shared truth for label.
 */
export function buildReveal(input: BuildRevealInput): BuildRevealOutput {
  const { tag, episodeId } = input;
  const key = `${episodeId}:${tag}`;
  const taxonomyEntry =
    tag in TAXONOMY ? TAXONOMY[tag as WitnessTag] : null;
  const label = taxonomyEntry ? taxonomyEntry.label : tag;
  const title = `You just performed: ${label} (${tag})`;
  const body = episodeContext[key] ?? taxonomyEntry?.whyItMatters ?? "";
  const careNote =
    (tag in careNotes ? careNotes[tag as WitnessTag] : null) ??
    (taxonomyEntry ? taxonomyEntry.risksAndCare.split(".")[0] + "." : "Consider impact before sharing.");

  return { title, body, careNote };
}
