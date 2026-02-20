import type { Message, Phase } from "../types/message";

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(ts: string) {
  const d = new Date(ts);
  const month = MONTHS_SHORT[d.getMonth()];
  const day = d.getDate();
  const h = pad2(d.getHours());
  const m = pad2(d.getMinutes());
  return `${month} ${day}, ${h}:${m}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const phaseConfig: Record<
  Phase,
  { label: string; accent: string; bgBubble: string; bgHeader: string }
> = {
  shock: {
    label: "Stage 1 – Shock / Pereklychka",
    accent: "#60a5fa",
    bgBubble: "#0b1220",
    bgHeader: "radial-gradient(circle at top, #0f172a 0, #020617 70%)",
  },
  negotiation: {
    label: "Stage 2 – Negotiation & Safety",
    accent: "#a5b4fc",
    bgBubble: "#0b1120",
    bgHeader: "radial-gradient(circle at top, #0f172a 0, #020617 70%)",
  },
  polyvocal: {
    label: "Stage 3 – Polyvocal Narratives & Critique",
    accent: "#c4b5fd",
    bgBubble: "#111827",
    bgHeader: "radial-gradient(circle at top, #1b1630 0, #020617 70%)",
  },
  emotional: {
    label: "Stage 4 – Emotional Surge",
    accent: "#fb7185",
    bgBubble: "#111827",
    bgHeader: "radial-gradient(circle at top, #111827 0, #020617 70%)",
  },
  routine: {
    label: "Stage 5 – Routine Crisis",
    accent: "#a3e635",
    bgBubble: "#0f172a",
    bgHeader: "radial-gradient(circle at top, #111827 0, #020617 70%)",
  },
};

/**
 * MessageBubble component - renders existing message UI exactly as before.
 * Reused by EventRenderer for "message" type events.
 */
export default function MessageBubble({ msg, isSelf }: { msg: Message; isSelf: boolean }) {
  const cfg = phaseConfig[msg.phase];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isSelf ? "flex-end" : "flex-start",
        marginBottom: 6,
      }}
    >
      {!isSelf && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#4a90e2",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            marginRight: 8,
            marginTop: 4,
          }}
        >
          {initials(msg.author)}
        </div>
      )}

      <div
        style={{
          maxWidth: "70%",
          display: "flex",
          flexDirection: "column",
          alignItems: isSelf ? "flex-end" : "flex-start",
        }}
      >
        {!isSelf && (
          <span
            style={{
              fontSize: 11,
              opacity: 0.7,
              marginBottom: 1,
              color: "#333333",
            }}
          >
            {msg.author}
          </span>
        )}

        <div
          style={{
            backgroundColor: isSelf ? "#4a90e2" : "#ffffff",
            color: isSelf ? "#ffffff" : "#000000",
            padding: "0.45rem 0.7rem",
            borderRadius: isSelf ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            fontSize: 13,
            lineHeight: 1.35,
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            border: isSelf ? "none" : "1px solid #e0e0e0",
          }}
        >
          {msg.text}
        </div>

        <span
          style={{
            fontSize: 10,
            opacity: 0.55,
            marginTop: 2,
            color: "#666666",
          }}
        >
          {formatTime(msg.timestamp)}
        </span>
      </div>

      {isSelf && (
        <div style={{ width: 28, height: 28, marginLeft: 8, marginTop: 4 }} />
      )}
    </div>
  );
}
