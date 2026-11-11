export type Quote = {
  id: string;
  author: string;
  source: string;
  quote: string;
  modern_sanity_check: string;
};

export type MoodId = "stoic" | "taoist" | "existential" | "cynical";

export type Mood = {
  id: MoodId;
  label: string;
  zone: "top" | "right" | "bottom" | "left";
  color: string;
  shadow: string;
};
