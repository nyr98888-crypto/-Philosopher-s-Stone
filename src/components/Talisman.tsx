import type { AlchemicalMode } from "../alchemicalModes";

type Props = {
  mode: AlchemicalMode;
  isLockedToday: boolean;
  isHolding: boolean;
  chargeProgress: number;
  onStartCharge: () => void;
  onCancelCharge: () => void;
};

export function Talisman({
  mode,
  isLockedToday,
  isHolding,
  chargeProgress,
  onStartCharge,
  onCancelCharge,
}: Props) {
  const rimActive = isLockedToday || isHolding;

  return (
    <div className="relative z-10 my-1 flex h-[290px] w-[290px] shrink-0 items-center justify-center">
      <div
        aria-hidden
        className="pointer-events-none absolute h-[255px] w-[255px] rounded-full transition-all duration-500"
        style={{
          boxShadow: rimActive ? mode.rimGlow : "none",
          border: `3px solid ${rimActive ? mode.color : "rgba(255,255,255,0.1)"}`,
          filter: "blur(4px)",
          opacity: isLockedToday
            ? 0.95
            : isHolding
              ? 0.4 + (chargeProgress / 100) * 0.55
              : 0.2,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full blur-3xl transition-all duration-500"
        style={{
          backgroundColor: mode.color,
          opacity: isLockedToday
            ? 0.45
            : isHolding
              ? 0.15 + (chargeProgress / 100) * 0.3
              : 0.1,
        }}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label={
          isLockedToday ? "Attuned for today" : "Hold stone to attune"
        }
        onMouseDown={onStartCharge}
        onMouseUp={onCancelCharge}
        onMouseLeave={onCancelCharge}
        onTouchStart={(e) => {
          e.preventDefault();
          onStartCharge();
        }}
        onTouchEnd={onCancelCharge}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") onStartCharge();
        }}
        onKeyUp={onCancelCharge}
        className={`relative flex h-full w-full cursor-pointer items-center justify-center select-none transition-transform duration-150 ${
          isHolding ? "scale-[0.98]" : "active:scale-95"
        }`}
      >
        <img
          src="/stone.png"
          alt="Alchemical Stone"
          draggable={false}
          className="pointer-events-none h-full w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.98)]"
        />

        {!isLockedToday && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {isHolding ? (
              <div className="flex h-14 w-14 animate-spin items-center justify-center rounded-full border-2 border-dashed border-white/80">
                <span className="font-mono text-[10px] font-bold tracking-widest">
                  {chargeProgress}%
                </span>
              </div>
            ) : (
              <span className="rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[9px] uppercase tracking-[0.25em] text-white/50 backdrop-blur-sm">
                Hold Stone to Attune
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
