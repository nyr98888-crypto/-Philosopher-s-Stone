import type { Mood } from "../types";

type Props = {
  mood: Mood;
};

export function MoodGlow({ mood }: Props) {
  return (
    <div
      aria-hidden
      className={`absolute h-[160px] w-[160px] rounded-full blur-2xl transition-all duration-700 ease-in-out ${mood.color} ${mood.shadow}`}
    />
  );
}
