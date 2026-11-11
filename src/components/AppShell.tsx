import { useEffect, useState } from "react";
import {
  ALCHEMICAL_MODES,
  DEFAULT_MODE,
  type AlchemicalModeId,
} from "../alchemicalModes";
import { AntidoteCard } from "./AntidoteCard";
import { CompanionButton } from "./CompanionButton";
import { ModeSelector } from "./ModeSelector";
import { RuneArc } from "./RuneArc";
import { Talisman } from "./Talisman";
import { useDailyAttunement } from "../hooks/useDailyAttunement";

export function AppShell() {
  const [activeKey, setActiveKey] = useState<AlchemicalModeId>(DEFAULT_MODE);
  const {
    streakDay,
    isLockedToday,
    lockedMode,
    isHolding,
    chargeProgress,
    startCharging,
    cancelCharging,
  } = useDailyAttunement(activeKey);

  useEffect(() => {
    if (lockedMode) setActiveKey(lockedMode);
  }, [lockedMode]);

  const modeData = ALCHEMICAL_MODES[activeKey];

  const selectMode = (key: AlchemicalModeId) => {
    setActiveKey(key);
  };

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-[420px] select-none flex-col items-center justify-between overflow-hidden px-4 py-3 text-white">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      </div>

      <div className="z-20 flex w-full shrink-0 items-center justify-between pt-1">
        <div className="w-16" />
        <h1 className="font-serif text-[11px] uppercase tracking-[0.38em] text-zinc-400">
          Philosopher&apos;s Stone
        </h1>
        <CompanionButton />
      </div>

      <RuneArc mode={modeData} streakDay={streakDay} />

      <Talisman
        mode={modeData}
        isLockedToday={isLockedToday}
        isHolding={isHolding}
        chargeProgress={chargeProgress}
        onStartCharge={startCharging}
        onCancelCharge={cancelCharging}
      />

      <div className="z-20 mb-6 flex w-full max-w-[340px] shrink-0 flex-col items-center gap-4">
        <AntidoteCard data={modeData} />
        <ModeSelector currentMode={activeKey} onSelect={selectMode} />
      </div>
    </div>
  );
}
