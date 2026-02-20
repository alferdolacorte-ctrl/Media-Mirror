import type { RevealEventPayload } from "../types/event";
import { TAXONOMY, type WitnessTag } from "../lib/witnessing/taxonomy";
import type { StageId } from "@/lib/stages";
import type { BibliographyEntryId } from "@/lib/bibliography";
import InlineRef from "./InlineRef";

export interface RevealOverride {
  title: string;
  body: string;
  careNote: string;
}

/**
 * Insight card: shows taxonomy or revealOverride (e.g. after a choice).
 * Optional refIds show as superscript numbers that scroll to Stage Context references.
 */
export default function InsightCard({
  payload,
  override,
  stageId,
  onScrollToRef,
}: {
  payload: RevealEventPayload;
  override?: RevealOverride | null;
  stageId?: StageId;
  onScrollToRef?: (entryId: BibliographyEntryId) => void;
}) {
  const tag = payload.tags?.[0];
  const taxonomyEntry =
    tag && tag in TAXONOMY ? TAXONOMY[tag as WitnessTag] : null;

  const blockStyle = {
    fontSize: 13,
    color: "#1e3a5f",
    lineHeight: 1.6,
    marginBottom: "0.5rem",
  } as const;

  const title = override
    ? override.title
    : taxonomyEntry
      ? taxonomyEntry.label
      : payload.title;
  const bodyContent = override
    ? override.body
    : taxonomyEntry
      ? taxonomyEntry.whyItMatters
      : payload.content;
  const careContent = override
    ? override.careNote
    : taxonomyEntry
      ? taxonomyEntry.risksAndCare
      : null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 12,
        marginTop: 8,
      }}
    >
      <div
        style={{
          backgroundColor: "#f0f7ff",
          border: "1px solid #7dd3fc",
          borderRadius: 12,
          padding: "1rem 1.5rem",
          maxWidth: "80%",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#0369a1",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </div>
        <div style={blockStyle}>{bodyContent}</div>
        {careContent && (
          <div style={{ ...blockStyle, marginBottom: 0, fontSize: 12, opacity: 0.9 }}>
            {careContent}
          </div>
        )}
        {payload.refIds && payload.refIds.length > 0 && stageId && onScrollToRef && (
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: 12,
              color: "#0369a1",
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "baseline",
            }}
          >
            {payload.refIds.map((id) => (
              <InlineRef
                key={id}
                entryId={id}
                stageId={stageId}
                onScrollToRef={onScrollToRef}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
