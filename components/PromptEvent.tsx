import type { PromptEventPayload, PromptChoicePayload } from "../types/event";

export interface PromptEventProps {
  payload: PromptEventPayload;
  disabled?: boolean;
  selectedAnswer: {
    choiceId: string;
    choiceText: string;
    tag: string;
  } | null;
  onSelectChoice?: (choice: PromptChoicePayload) => void;
}

/**
 * Renders a prompt (decision point) with choices as buttons.
 * When a choice is selected, shows the chosen text as a user bubble beneath (SPIKE: no event insertion).
 */
export default function PromptEvent({
  payload,
  disabled = false,
  selectedAnswer,
  onSelectChoice,
}: PromptEventProps) {
  const { promptId, question, choices } = payload;
  const hasChoices = choices && choices.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        marginBottom: 12,
        marginTop: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "2px dashed #4a90e2",
            borderRadius: 12,
            padding: "1rem 1.5rem",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#4a90e2",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Decision Point
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#333333",
              lineHeight: 1.5,
            }}
          >
            {question}
          </div>
          {hasChoices && (
            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectChoice?.(choice)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: 12,
                    textAlign: "left",
                    backgroundColor: disabled ? "#f0f0f0" : "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    cursor: disabled ? "default" : "pointer",
                    color: "#334155",
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAnswer && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 6,
            marginBottom: 0,
          }}
        >
          <div
            style={{
              maxWidth: "70%",
              backgroundColor: "#4a90e2",
              color: "#ffffff",
              padding: "0.45rem 0.7rem",
              borderRadius: "14px 14px 4px 14px",
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {selectedAnswer.choiceText}
          </div>
        </div>
      )}
    </div>
  );
}
