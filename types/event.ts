import type { Message } from "./message";

/**
 * Event types represent narrative progression, not time.
 * Events are rendered in index order, not timestamp order.
 */
export type EventType = "message" | "prompt" | "reveal" | "checkpoint";

/**
 * Base Event structure for the event-driven feed architecture.
 * 
 * Events are rendered sequentially by index order (canonical narrative sequence),
 * NOT by timestamp. The timestamp field is optional and display-only.
 * 
 * This enables future branching logic where event sequence can diverge based on
 * user decisions or narrative conditions.
 */
export interface Event {
  id: string;
  type: EventType;
  timestamp?: string; // Optional, display-only - NOT used for ordering
  payload: EventPayload;
}

/**
 * Payload types for each event type (discriminated union).
 * Each payload type corresponds to a specific EventType.
 * Future: This will expand as we add interaction logic.
 */
export type EventPayload =
  | MessageEventPayload
  | PromptEventPayload
  | RevealEventPayload
  | CheckpointEventPayload;

export interface MessageEventPayload {
  message: Message;
}

/** Choice for prompt events (SPIKE: onSelect unused for now) */
export interface PromptChoicePayload {
  id: string;
  text: string;
  tag: string;
  onSelect: string;
}

export interface PromptEventPayload {
  promptId: string;
  question: string;
  choices: PromptChoicePayload[];
  options?: string[]; // legacy
}

export interface RevealEventPayload {
  title: string;
  content: string;
  /** Optional witness tag; when present, RevealEvent can show taxonomy (label, whyItMatters, risksAndCare). */
  tags?: string[];
  /** Optional bibliography entry ids for inline micro-references (superscript numbers). */
  refIds?: string[];
}

export interface CheckpointEventPayload {
  title: string;
  summary: string;
}
