import {
  ALCHEMICAL_MODES,
  type AlchemicalModeId,
} from "../alchemicalModes";
import { playTibetanBowl, triggerHaptic } from "../lib/feedback";

type Props = {
  currentMode: AlchemicalModeId;
  onSelect: (id: AlchemicalModeId) => void;
};

export function ModeSelector({ currentMode, onSelect }: Props) {
  return (
    <div className="grid w-full grid-cols-5 gap-2">
      {(Object.keys(ALCHEMICAL_MODES) as AlchemicalModeId[]).map((key) => {
        const mode = ALCHEMICAL_MODES[key];
        const isSelected = currentMode === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              playTibetanBowl(key);
              triggerHaptic(15);
              onSelect(key);
            }}
            style={{
              borderColor: isSelected ? mode.color : "rgba(63, 63, 70, 0.4)",
              boxShadow: isSelected ? `0 0 14px ${mode.glow}` : "none",
              color: isSelected ? mode.color : "#71717a",
            }}
            className="touch-manipulation cursor-pointer select-none rounded-lg border bg-zinc-950/90 py-2.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm transition-all duration-150 active:translate-y-0.5 active:scale-95"
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
