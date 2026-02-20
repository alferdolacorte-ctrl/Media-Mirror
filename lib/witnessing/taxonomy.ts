/**
 * Witnessing taxonomy: shared labels and guidance for Witness Lab.
 * Used by RevealEvent and future prompt/checkpoint UI.
 */

export type WitnessTag = "CC" | "SA" | "SI" | "MN" | "C" | "EM" | "F";

export const TAXONOMY: Record<
  WitnessTag,
  { label: string; whyItMatters: string; risksAndCare: string }
> = {
  CC: {
    label: "Chat communication",
    whyItMatters:
      "Meta talk about how the channel works—rules, bans, who can speak—shapes what gets said and who feels safe. It reflects how communities self-organize under pressure.",
    risksAndCare:
      "Moderation and rules can exclude or silence. Note that sharing exact locations or identifying information in chat can be dangerous; many communities explicitly warn against it.",
  },
  SA: {
    label: "Spatial attribution",
    whyItMatters:
      "Locations and addresses show how people map risk and help. They reveal what is considered safe to share and how space is understood in the crisis.",
    risksAndCare:
      "Sharing locations can endanger people. Treat any location data as sensitive; avoid republishing exact addresses. Consider that readers may include bad actors.",
  },
  SI: {
    label: "Searching for information",
    whyItMatters:
      "Questions and requests for verification show how people cope with information scarcity. They reveal what is unknown and what counts as evidence.",
    risksAndCare:
      "Unverified claims can spread quickly. Distinguish between asking for information and asserting facts. Be careful not to amplify rumors.",
  },
  MN: {
    label: "Making narratives",
    whyItMatters:
      "Stories and explanations—who did what, why—shape collective sense-making. They show how causality and blame are assigned in the moment.",
    risksAndCare:
      "Narratives can be weaponized or oversimplified. Notice who is centered and who is missing. Multiple conflicting narratives are common.",
  },
  C: {
    label: "Critique",
    whyItMatters:
      "Critique challenges dominant stories, rules, or behavior. It shows how communities debate norms and hold each other accountable.",
    risksAndCare:
      "Critique can be dismissed or punished. Consider power differences and the cost of speaking up in the channel.",
  },
  EM: {
    label: "Expression of emotion",
    whyItMatters:
      "Anger, grief, fear, and hope appear alongside practical updates. Emotion is part of how people witness and cope, not a side effect.",
    risksAndCare:
      "Emotional content can be intense or triggering. Treat it as meaningful testimony; avoid treating it as merely anecdotal or irrational.",
  },
  F: {
    label: "Filler",
    whyItMatters:
      "Off-topic or low-information messages (jokes, small talk) can signal trust, fatigue, or the need to keep the channel alive as a space.",
    risksAndCare:
      "Filler is still part of the social context. Don’t strip it out when analyzing without considering what it does for the group.",
  },
};
