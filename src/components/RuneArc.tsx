import { SOCKET_COORDS, type AlchemicalMode } from "../alchemicalModes";

type Props = {
  mode: AlchemicalMode;
  streakDay?: number;
};

export function RuneArc({ mode, streakDay = 1 }: Props) {
  return (
    <div className="pointer-events-none relative z-20 mx-auto -mb-4 flex h-12 w-full max-w-[340px] shrink-0 items-center justify-center">
      {SOCKET_COORDS.map((pos, idx) => {
        const isLit = idx < streakDay;
        return (
          <div
            key={idx}
            className="pointer-events-auto absolute flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/60 bg-zinc-950/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95),0_1px_2px_rgba(255,255,255,0.08)]"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          >
            <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-zinc-900/90 bg-zinc-950 shadow-inner">
              {isLit ? (
                <div
                  className="h-3 w-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: mode.color,
                    boxShadow: `0 0 10px 2px ${mode.glow}`,
                  }}
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-800/80" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
