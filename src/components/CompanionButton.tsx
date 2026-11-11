import { playTibetanBowl, triggerHaptic } from "../lib/feedback";

type Props = {
  onOpen?: () => void;
};

export function CompanionButton({ onOpen }: Props) {
  return (
    <button
      type="button"
      aria-label="Launch Talisman Menu"
      onClick={() => {
        playTibetanBowl("VOID");
        triggerHaptic([15, 10, 15]);
        onOpen?.();
      }}
      className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-950 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9),0_4px_12px_rgba(0,0,0,0.8)] select-none transition-all duration-150 ease-out active:translate-y-0.5 active:scale-90"
    >
      <img
        src="/icon-512.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-150 group-active:brightness-90"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-100 group-hover:bg-white/5 group-active:bg-black/35" />
    </button>
  );
}
