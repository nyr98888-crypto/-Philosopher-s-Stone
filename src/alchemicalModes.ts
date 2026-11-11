export type AlchemicalModeId =
  | "spark"
  | "cosmos"
  | "void"
  | "mirror"
  | "depth";

export type AlchemicalMode = {
  id: AlchemicalModeId;
  label: string;
  theme: string;
  color: string;
  glow: string;
  rimGlow: string;
  quote: string;
  author: string;
  source: string;
};

export const ALCHEMICAL_MODES: Record<AlchemicalModeId, AlchemicalMode> = {
  spark: {
    id: "spark",
    label: "Spark",
    theme: "Energy & Initiative",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.9)",
    rimGlow:
      "0 0 50px 10px rgba(245, 158, 11, 0.75), inset 0 0 30px rgba(245, 158, 11, 0.4)",
    quote: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
  },
  cosmos: {
    id: "cosmos",
    label: "Cosmos",
    theme: "Perspective & Surrender",
    color: "#2563eb",
    glow: "rgba(37, 99, 235, 0.9)",
    rimGlow:
      "0 0 50px 10px rgba(37, 99, 235, 0.75), inset 0 0 30px rgba(37, 99, 235, 0.4)",
    quote:
      "If the problem can be solved, why worry? If the problem cannot be solved, worrying will do you no good.",
    author: "Shantideva",
    source: "Bodhicaryavatara",
  },
  void: {
    id: "void",
    label: "Void",
    theme: "Stillness & Solitude",
    color: "#e2e8f0",
    glow: "rgba(226, 232, 240, 0.85)",
    rimGlow:
      "0 0 45px 8px rgba(226, 232, 240, 0.65), inset 0 0 25px rgba(226, 232, 240, 0.3)",
    quote: "Silence is a source of great strength.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
  },
  mirror: {
    id: "mirror",
    label: "Mirror",
    theme: "Awareness & Perception",
    color: "#9333ea",
    glow: "rgba(147, 51, 234, 0.9)",
    rimGlow:
      "0 0 50px 10px rgba(147, 51, 234, 0.75), inset 0 0 30px rgba(147, 51, 234, 0.4)",
    quote: "The mind is everything. What you think, you become.",
    author: "Buddha",
    source: "Dhammapada",
  },
  depth: {
    id: "depth",
    label: "Depth",
    theme: "Truth & Humility",
    color: "#e11d48",
    glow: "rgba(225, 29, 72, 0.9)",
    rimGlow:
      "0 0 50px 10px rgba(225, 29, 72, 0.75), inset 0 0 30px rgba(225, 29, 72, 0.4)",
    quote: "Real knowledge is to know the extent of one's ignorance.",
    author: "Confucius",
    source: "Analects",
  },
};

export const DEFAULT_MODE: AlchemicalModeId = "depth";

export const SOCKET_COORDS = [
  { x: -116, y: 19 },
  { x: -79, y: 4 },
  { x: -41, y: -6 },
  { x: 0, y: -10 },
  { x: 41, y: -6 },
  { x: 79, y: 0 },
  { x: 114, y: 12 },
];
