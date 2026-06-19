import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { pairs } from "./data/pairs";
import { ITEM_H } from "./lib/scroll-animation";
import { ScrollColumn } from "./components/ScrollColumn";
import { ChartDisplay } from "./components/ChartDisplay";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [activeIndex, setActiveIndex] = useState(0);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIndex(Math.round(v * (pairs.length - 1)));
  });

  const centerOffset = vh / 2 - ITEM_H / 2;
  const listY = useTransform(
    scrollYProgress,
    [0, 1],
    [centerOffset, centerOffset - (pairs.length - 1) * ITEM_H]
  );

  return (
    <div
      ref={containerRef}
      className="bg-[#080808]"
      style={{ height: `${pairs.length * 120 + 200}vh` }}
    >
      <div className="fixed top-6 left-6 z-50 flex gap-4 font-mono text-[11px] tracking-[0.12em] text-white/30">
        <span>#SCROLL</span>
        <span>#TYPOGRAPHY</span>
        <span>#MOTION</span>
      </div>

      <div className="sticky top-0 h-screen overflow-hidden bg-[#080808]">
        <ScrollColumn
          items={pairs.map((p) => p.product)}
          activeIndex={activeIndex}
          y={listY}
          align="left"
        />

        <ChartDisplay pairs={pairs} activeIndex={activeIndex} />

        <ScrollColumn
          items={pairs.map((p) => p.brand)}
          activeIndex={activeIndex}
          y={listY}
          align="right"
        />

        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none z-10 bg-gradient-to-b from-[#080808] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-10 bg-gradient-to-t from-[#080808] to-transparent" />
      </div>
    </div>
  );
}
