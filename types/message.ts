export type Phase = "shock" | "negotiation" | "polyvocal" | "emotional" | "routine";

export interface Message {
  id: number;
  author: string;
  timestamp: string;
  phase: Phase;
  text: string;
  reply_to_id: number | null;
}
