export type Post = {
  id: number;
  side: "russia" | "ukraine";
  timestamp: string;
  text: string;
  tags: string[];
  image: string | null;
};
