import type { RevealEventPayload } from "../types/event";
import { TAXONOMY, type WitnessTag } from "../lib/witnessing/taxonomy";

/**
 * Placeholder component for reveal events.
 * When payload.tags[0] is a witness tag, shows taxonomy (label, whyItMatters, risksAndCare).
 */
export default function RevealEvent({ payload }: { payload: RevealEventPayload }) {
  const tag = payload.tags?.[0];
  const taxonomyEntry =
    tag && tag in TAXONOMY ? TAXONOMY[tag as WitnessTag] : null;

  const blockStyle = {
    fontSize: 13,
    color: "#1e3a5f",
    lineHeight: 1.6,
    marginBottom: "0.5rem",
  } as const;

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
          {taxonomyEntry ? taxonomyEntry.label : payload.title}
        </div>
        {taxonomyEntry ? (
          <>
            <div style={blockStyle}>{taxonomyEntry.whyItMatters}</div>
            <div style={{ ...blockStyle, marginBottom: 0 }}>
              {taxonomyEntry.risksAndCare}
            </div>
          </>
        ) : (
          <div style={{ ...blockStyle, marginBottom: 0 }}>{payload.content}</div>
        )}
      </div>
    </div>
  );
}
