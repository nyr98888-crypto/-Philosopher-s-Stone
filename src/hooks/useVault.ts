import { useCallback, useMemo, useState } from "react";
import vault from "../data/vault.json";
import type { Quote } from "../types";

function pickRandom(quotes: Quote[], excludeId?: string): Quote {
  if (quotes.length === 0) {
    return {
      id: "empty",
      author: "—",
      source: "—",
      quote: "The vault is empty.",
      modern_sanity_check: "Fill the stone before you consult it.",
    };
  }

  if (quotes.length === 1) return quotes[0];

  let next = quotes[Math.floor(Math.random() * quotes.length)];
  let guard = 0;
  while (next.id === excludeId && guard < 12) {
    next = quotes[Math.floor(Math.random() * quotes.length)];
    guard += 1;
  }
  return next;
}

export function useVault() {
  const quotes = useMemo(() => vault as Quote[], []);
  const [current, setCurrent] = useState<Quote>(() => pickRandom(quotes));
  const [tick, setTick] = useState(0);

  const nextQuote = useCallback(() => {
    setCurrent((prev) => pickRandom(quotes, prev.id));
    setTick((t) => t + 1);
  }, [quotes]);

  return { current, nextQuote, tick, total: quotes.length };
}
