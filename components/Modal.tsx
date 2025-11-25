"use client";

import type { CSSProperties, MouseEvent } from "react";
import type { Post } from "../types/post";

type ModalProps = {
  post: Post | null;
  onClose: () => void;
};

const overlayStyles: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  zIndex: 1000,
};

const contentStyles: CSSProperties = {
  backgroundColor: "#141414",
  borderRadius: "12px",
  padding: "1.5rem",
  width: "100%",
  maxWidth: "500px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 20px 45px rgba(0,0,0,0.5)",
};

const closeButtonStyles: CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.3)",
  color: "#f5f5f5",
  borderRadius: "999px",
  padding: "0.25rem 0.75rem",
  cursor: "pointer",
  fontSize: "0.85rem",
  marginLeft: "auto",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
};

const contextStyles: CSSProperties = {
  marginTop: "1rem",
  color: "#cfcfcf",
  fontSize: "0.9rem",
  lineHeight: 1.5,
};

export default function Modal({ post, onClose }: ModalProps) {
  if (!post) return null;

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div style={overlayStyles} onClick={onClose} role="dialog" aria-modal="true">
      <div style={contentStyles} onClick={handleContentClick}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Post Detail</h3>
          <button style={closeButtonStyles} onClick={onClose}>
            Close
          </button>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "1rem", lineHeight: 1.6 }}>{post.text}</p>
        <small style={{ color: "#888" }}>{post.timestamp}</small>
        <div style={contextStyles}>
          <strong>Context:</strong>
          <p style={{ marginTop: "0.35rem" }}>
            Placeholder contextual information about the selected post will appear here.
            This could include metadata, cross-references, or analysis notes.
          </p>
        </div>
      </div>
    </div>
  );
}
