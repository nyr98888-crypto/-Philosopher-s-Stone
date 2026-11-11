import type { AlchemicalMode } from "../alchemicalModes";

type Props = {
  data: AlchemicalMode;
};

export function AntidoteCard({ data }: Props) {
  return (
    <div className="flex h-[140px] w-full flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/85 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex flex-1 items-center justify-center px-2 text-center">
        <p className="font-serif text-base italic leading-relaxed tracking-wide text-zinc-100 sm:text-[17px]">
          &ldquo;{data.quote}&rdquo;
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2.5 text-[11px] tracking-wider">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
          {data.author}
        </span>
        <span className="font-serif text-[11px] italic text-zinc-500">
          {data.source}
        </span>
      </div>
    </div>
  );
}
