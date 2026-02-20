import type { Episode, EpisodeFile } from "@/types/episode";

/**
 * Load an episode by id from /content/episodes/${id}.json.
 * Uses static import for known episodes (Next.js/bundler compatible).
 */
export async function loadEpisode(id: string): Promise<Episode> {
  if (id === "episode-001") {
    const data = (await import("@/content/episodes/episode-001.json")) as EpisodeFile;
    return data.episode;
  }
  if (id === "episode-002") {
    const data = (await import("@/content/episodes/episode-002.json")) as EpisodeFile;
    return data.episode;
  }
  if (id === "episode-003") {
    const data = (await import("@/content/episodes/episode-003.json")) as EpisodeFile;
    return data.episode;
  }
  throw new Error(`Episode not found: ${id}`);
}
