type SoundType = "click" | "hum" | "seal";

type BowlModeKey = "SPARK" | "COSMOS" | "VOID" | "MIRROR" | "DEPTH";

let globalAudioCtx: AudioContext | null = null;

const BOWL_FREQUENCIES: Record<BowlModeKey, number> = {
  SPARK: 293.66,
  COSMOS: 349.23,
  VOID: 392.0,
  MIRROR: 440.0,
  DEPTH: 523.25,
};

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!globalAudioCtx) {
    globalAudioCtx = new AudioContextClass();
  }
  if (globalAudioCtx.state === "suspended") {
    void globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

export function playTibetanBowl(modeKey: BowlModeKey | string = "SPARK") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const key = modeKey.toUpperCase() as BowlModeKey;
    const baseFreq = BOWL_FREQUENCIES[key] || 392.0;

    const harmonics = [
      { ratio: 1.0, gain: 0.35, decay: 1.8 },
      { ratio: 2.76, gain: 0.15, decay: 1.4 },
      { ratio: 5.4, gain: 0.05, decay: 0.9 },
    ];

    harmonics.forEach(({ ratio, gain: vol, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * ratio, now);
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(vol, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    console.error("Audio playback error:", err);
  }
}

export function playTempleGong(type: "strike" | "complete" = "strike") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === "strike") {
      const gongHarmonics = [
        { freq: 110.0, gain: 0.45, decay: 2.8 },
        { freq: 220.0, gain: 0.2, decay: 2.2 },
        { freq: 332.0, gain: 0.12, decay: 1.5 },
      ];

      gongHarmonics.forEach(({ freq, gain: vol, decay }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(vol, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + decay);
      });
      return;
    }

    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const t = now + idx * 0.06;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.linearRampToValueAtTime(0.25, t + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 2.0);
    });
  } catch (err) {
    console.error("Audio playback error:", err);
  }
}

export function playSound(type: SoundType = "click") {
  try {
    if (type === "click") {
      playTibetanBowl("SPARK");
      return;
    }
    if (type === "hum") {
      playTempleGong("strike");
      return;
    }
    if (type === "seal") {
      playTempleGong("complete");
    }
  } catch (err) {
    console.error("Audio playback error:", err);
  }
}

export function triggerHaptic(pattern: number | number[]) {
  if (typeof window !== "undefined" && window.navigator?.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch {
      // ignore
    }
  }
}
