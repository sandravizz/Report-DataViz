import { ResponsiveContainer } from "recharts";
import type { Pair } from "../data/pairs";

type ChartDisplayProps = {
  pairs: Pair[];
  activeIndex: number;
};

export function ChartDisplay({ pairs, activeIndex }: ChartDisplayProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[280px]">
      {pairs.map(({ chart, product }, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-500 ease-[ease]"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
            {product}
          </div>
          <ResponsiveContainer width="100%" height={252}>
            {chart}
          </ResponsiveContainer>
        </div>
      ))}

      <div className="absolute inset-0 pointer-events-none outline outline-1 outline-white/7" />
    </div>
  );
}
