const STORAGE_KEY = "mediaMirrorTelemetry";
const MAX_ENTRIES = 500;

export interface TelemetryEntry {
  eventName: string;
  payload: Record<string, unknown>;
  ts: number;
}

function getStored(): TelemetryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TelemetryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function store(entries: TelemetryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const capped = entries.slice(-MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // ignore
  }
}

/**
 * Append a telemetry event to local storage (append-only, cap at MAX_ENTRIES).
 * No external analytics; local only.
 */
export function track(eventName: string, payload: object): void {
  const entries = getStored();
  entries.push({
    eventName,
    payload: payload as Record<string, unknown>,
    ts: Date.now(),
  });
  store(entries);
}
