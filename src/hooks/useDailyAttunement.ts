import { useCallback, useEffect, useRef, useState } from "react";
import type { AlchemicalModeId } from "../alchemicalModes";
import { playTempleGong, triggerHaptic } from "../lib/feedback";

const STORAGE_KEY = "alchemical_talisman_v1";

type StoredState = {
  lastDate: string;
  streak: number;
  lockedMode?: AlchemicalModeId;
};

export function useDailyAttunement(activeKey: AlchemicalModeId) {
  const [streakDay, setStreakDay] = useState(1);
  const [isLockedToday, setIsLockedToday] = useState(false);
  const [lockedMode, setLockedMode] = useState<AlchemicalModeId | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeKeyRef = useRef(activeKey);
  const streakRef = useRef(streakDay);

  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  useEffect(() => {
    streakRef.current = streakDay;
  }, [streakDay]);

  useEffect(() => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    const todayStr = new Date().toISOString().split("T")[0];

    if (!rawData) return;

    try {
      const { lastDate, streak, lockedMode: savedMode } = JSON.parse(
        rawData,
      ) as StoredState;

      if (lastDate === todayStr) {
        setIsLockedToday(true);
        setStreakDay(streak);
        setChargeProgress(100);
        if (savedMode) setLockedMode(savedMode);
      } else {
        const last = new Date(lastDate);
        const now = new Date(todayStr);
        const diffDays = Math.round(
          (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays === 1) {
          setStreakDay(streak >= 7 ? 0 : streak);
        } else {
          setStreakDay(0);
        }
        setIsLockedToday(false);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const finalizeAttunement = useCallback(() => {
    setIsHolding(false);
    setIsLockedToday(true);
    setChargeProgress(100);

    const newStreak =
      streakRef.current >= 7 ? 1 : streakRef.current + 1;
    setStreakDay(newStreak);
    setLockedMode(activeKeyRef.current);

    playTempleGong("complete");
    triggerHaptic([60, 40, 90]);

    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastDate: todayStr,
        streak: newStreak,
        lockedMode: activeKeyRef.current,
      }),
    );
  }, []);

  const startCharging = useCallback(() => {
    // Fire the deep temple gong instantly on touch
    playTempleGong("strike");
    triggerHaptic(30);

    if (isLockedToday) return;

    setIsHolding(true);
    let progress = 0;

    clearHold();
    holdIntervalRef.current = setInterval(() => {
      progress += 4;
      setChargeProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearHold();
        finalizeAttunement();
      }
    }, 50);
  }, [finalizeAttunement, isLockedToday]);

  const cancelCharging = useCallback(() => {
    if (isLockedToday) return;
    setIsHolding(false);
    clearHold();
    setChargeProgress(0);
  }, [isLockedToday]);

  useEffect(() => () => clearHold(), []);

  return {
    streakDay,
    isLockedToday,
    lockedMode,
    isHolding,
    chargeProgress,
    startCharging,
    cancelCharging,
  };
}
