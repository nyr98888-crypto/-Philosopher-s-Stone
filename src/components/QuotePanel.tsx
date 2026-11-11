import type { Quote } from "../types";

type Props = {
  quote: Quote;
  tick: number;
};

export function QuotePanel({ quote, tick }: Props) {
  return (
    <div
      key={`${quote.id}-${tick}`}
      className="quote-enter z-10 w-full max-w-sm pb-4 text-center"
      aria-live="polite"
    >
      <p className="mb-3 font-serif text-lg italic leading-snug text-zinc-200">
        &ldquo;{quote.quote}&rdquo;
      </p>
      <p className="mb-6 font-sans text-xs leading-relaxed text-zinc-400">
        {quote.modern_sanity_check}
      </p>
      <div className="flex justify-between border-t border-zinc-800/60 pt-3 text-[10px] uppercase tracking-wider text-zinc-500">
        <span>{quote.author}</span>
        <span>{quote.source}</span>
      </div>
    </div>
  );
}
