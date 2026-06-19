import { motion, type MotionValue } from "motion/react";
import { getOpacity, getScale } from "../lib/scroll-animation";

type ScrollColumnProps = {
  items: string[];
  activeIndex: number;
  y: MotionValue<number>;
  align: "left" | "right";
};

export function ScrollColumn({ items, activeIndex, y, align }: ScrollColumnProps) {
  const isLeft = align === "left";

  return (
    <div className={`absolute inset-y-0 ${isLeft ? "left-0" : "right-0"} w-[44%] overflow-hidden`}>
      <motion.div
        style={{ y }}
        className={`absolute top-0 ${isLeft ? "left-8" : "right-8 text-right"}`}
      >
        {items.map((item, i) => {
          const dist = Math.abs(i - activeIndex);
          return (
            <div
              key={i}
              className={`h-20 flex items-center font-mono text-[1.45rem] font-normal tracking-[0.06em] whitespace-nowrap text-white transition-[opacity,transform] duration-[400ms] ease-[ease] ${
                isLeft ? "origin-left" : "origin-right justify-end"
              }`}
              style={{
                opacity: getOpacity(dist),
                transform: `scale(${getScale(dist)})`,
              }}
            >
              {item}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
