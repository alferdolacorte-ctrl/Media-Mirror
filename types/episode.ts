/**
 * Canonical episode schema for Witness Lab.
 * Canonical order = array order of events; ts is display-only.
 */

export type EpisodeSpeaker = "channel" | "user" | "mod" | "system";
export type EpisodeSafety = "none" | "sensitive";

export interface EpisodeMessageEvent {
  id: string;
  type: "message";
  ts: string;
  speaker: EpisodeSpeaker;
  text: string;
  tags: string[];
  safety: EpisodeSafety;
}

export interface PromptChoice {
  id: string;
  text: string;
  tag: string;
  onSelect: string;
}

export interface EpisodePromptEvent {
  id: string;
  type: "prompt";
  ts: string;
  speaker: EpisodeSpeaker;
  question: string;
  choices: PromptChoice[];
  safety: EpisodeSafety;
}

export interface EpisodeRevealEvent {
  id: string;
  type: "reveal";
  ts: string;
  speaker: EpisodeSpeaker;
  text: string;
  tags: string[];
  safety: EpisodeSafety;
  /** Optional bibliography entry ids for inline micro-references */
  refIds?: string[];
}

export interface EpisodeCheckpointEvent {
  id: string;
  type: "checkpoint";
  ts: string;
  speaker: EpisodeSpeaker;
  text: string;
  tags: string[];
  safety: EpisodeSafety;
}

export type EpisodeEvent =
  | EpisodeMessageEvent
  | EpisodePromptEvent
  | EpisodeRevealEvent
  | EpisodeCheckpointEvent;

export interface Episode {
  id: string;
  title: string;
  timeWindowLabel: string;
  phases: string[];
  events: EpisodeEvent[];
}

/** Root shape of episode JSON files: { episode: Episode } */
export interface EpisodeFile {
  episode: Episode;
}
