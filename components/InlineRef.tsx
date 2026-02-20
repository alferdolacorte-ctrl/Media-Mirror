"use client";

import type { StageId } from "@/lib/stages";
import { getRefNumber, getEntryById } from "@/lib/bibliography";
import type { BibliographyEntryId } from "@/lib/bibliography";

interface InlineRefProps {
  entryId: string;
  stageId: StageId;
  onScrollToRef: (entryId: BibliographyEntryId) => void;
}

/**
 * Superscript clickable reference number. Hover shows shortCitation; click opens drawer and scrolls to reference.
 */
export default function InlineRef({
  entryId,
  stageId,
  onScrollToRef,
}: InlineRefProps) {
  const num = getRefNumber(entryId as BibliographyEntryId, stageId);
  const entry = getEntryById(entryId as BibliographyEntryId);
  if (num === 0 || !entry) return null;

  return (
    <sup
      role="button"
      tabIndex={0}
      title={entry.shortCitation}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onScrollToRef(entry.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onScrollToRef(entry.id);
        }
      }}
      style={{
        fontSize: "0.75em",
        fontWeight: 600,
        color: "#4a90e2",
        cursor: "pointer",
        marginLeft: 1,
        verticalAlign: "baseline",
      }}
    >
      {num}
    </sup>
  );
}
