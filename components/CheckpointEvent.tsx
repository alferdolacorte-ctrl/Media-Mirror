import type { CheckpointEventPayload } from "../types/event";

/**
 * Placeholder component for checkpoint events.
 * Future: This will render reflection/summary UI with enhanced styling.
 */
export default function CheckpointEvent({ payload }: { payload: CheckpointEventPayload }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 16,
        marginTop: 12,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "2px solid #a3e635",
          borderRadius: 12,
          padding: "1.25rem 1.5rem",
          maxWidth: "85%",
          boxShadow: "0 2px 8px rgba(163, 230, 53, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#65a30d",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {payload.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#333333",
            lineHeight: 1.6,
          }}
        >
          {payload.summary}
        </div>
      </div>
    </div>
  );
}
