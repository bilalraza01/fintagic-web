import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VALUES } from "../data/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Diagonal = "A" | "B";

// Tile layout (2 columns × 2 rows):
//   col 1: 0 (top-left)    2 (bottom-left)
//   col 2: 1 (top-right)   3 (bottom-right)
// Diagonal A = TL + BR (0,3).  Diagonal B = TR + BL (1,2).
const COLUMNS = [
  [0, 2],
  [1, 3],
];

const TILE_COLOR = [
  { bg: "#85E16B", title: "#14613F", body: "#2F7E57" }, // Specialist  (TL · light green)
  { bg: "#0E9E6C", title: "#83E16B", body: "#CFF3DD" }, // Accurate    (TR · dark green)
  { bg: "#7A0FB5", title: "#C98CF0", body: "#E3C7F7" }, // Fast        (BL · dark purple)
  { bg: "#C77DFF", title: "#52137F", body: "#6A2A9C" }, // Proactive   (BR · light purple)
];

// Index matches VALUES order: Specialist, Accurate, Fast, Proactive.
const TILE_ART = [
  "/why/innovative-bulb.svg", // Specialist
  "/why/dynamic-world.svg", // Accurate
  "/why/meticulous-watch.svg", // Fast
  "/why/versatile-cubes.svg", // Proactive
];

type Sizes = { exp: number; col: number; gap: number; desktop: boolean };

function readSizes(): Sizes {
  if (typeof window === "undefined")
    return { exp: 498, col: 136, gap: 16, desktop: true };
  const w = window.innerWidth;
  if (w >= 1024) return { exp: 498, col: 136, gap: 16, desktop: true }; // desktop
  if (w >= 640) return { exp: 430, col: 110, gap: 12, desktop: false }; // tablet
  return { exp: 330, col: 86, gap: 8, desktop: false }; // mobile
}

function useSizes() {
  const [s, setS] = useState<Sizes>(readSizes);
  useEffect(() => {
    const on = () => setS(readSizes());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return s;
}

function Tile({
  index,
  expanded,
  expandedH,
  collapsedH,
  onActivate,
}: {
  index: number;
  expanded: boolean;
  expandedH: number;
  collapsedH: number;
  onActivate: () => void;
}) {
  const v = VALUES[index];
  const c = TILE_COLOR[index];
  return (
    <motion.div
      onMouseEnter={onActivate}
      onClick={onActivate}
      animate={{ height: expanded ? expandedH : collapsedH }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: c.bg }}
      className="relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] lg:rounded-[26px]"
    >
      <div className="relative z-10 p-5 sm:p-7">
        <div
          className="font-display text-[clamp(1.9rem,6vw,50px)] font-bold tracking-tight"
          style={{ color: c.title }}
        >
          {v.title}
        </div>
        <motion.p
          animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : -6 }}
          transition={{ duration: 0.35, delay: expanded ? 0.15 : 0 }}
          className="mt-2 max-w-[24ch] text-[clamp(0.78rem,3vw,1.125rem)] leading-snug font-medium sm:mt-3"
          style={{ color: c.body }}
        >
          {v.body}
        </motion.p>
      </div>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex ${
          index === 2 ? "justify-end" : "justify-center"
        }`}
      >
        <motion.img
          src={TILE_ART[index]}
          alt=""
          animate={{
            opacity: expanded ? 1 : 0,
            scale: expanded ? 1 : 0.86,
            y: expanded ? 0 : 30,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-h-[170px] w-auto max-w-full object-contain drop-shadow-[0_12px_22px_rgba(1,20,24,0.3)] sm:max-h-[220px] lg:max-h-[300px]"
        />
      </div>
    </motion.div>
  );
}

export default function WhyUs() {
  const root = useRef<HTMLElement>(null);
  const [diag, setDiag] = useState<Diagonal>("A");
  const { exp, col, gap, desktop } = useSizes();
  const columnH = exp + col + gap;

  useGSAP(
    () => {
      if (!desktop) return;
      gsap.fromTo(
        ".why-panel",
        { "--inx": "10vw", "--rad": "93px" },
        {
          "--inx": "0vw",
          "--rad": "0px",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        },
      );
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [desktop], revertOnUpdate: true },
  );

  const isExpanded = (i: number) =>
    diag === "A" ? i === 0 || i === 3 : i === 1 || i === 2;
  const activate = (i: number) => setDiag(i === 0 || i === 3 ? "A" : "B");

  return (
    <section id="why" ref={root} className="relative bg-paper">
      <div className="why-scene relative overflow-hidden lg:h-[906px]">
        <div
          className="why-panel relative bg-ink text-white lg:absolute lg:inset-0"
          style={
            desktop
              ? ({
                  "--inx": "10vw",
                  "--iny": "44px",
                  "--rad": "93px",
                  clipPath:
                    "inset(var(--iny) var(--inx) var(--iny) var(--inx) round var(--rad))",
                } as CSSProperties)
              : undefined
          }
        >
          <div className="mx-auto flex h-full w-full max-w-[1330px] flex-col items-center gap-10 px-5 py-16 lg:w-[80%] lg:flex-row lg:gap-16 lg:px-[30px] lg:py-32">
            {/* Copy */}
            <div className="w-full lg:w-1/2">
              <h2 className="font-display text-[clamp(2.5rem,9vw,75px)] leading-[1.04] font-semibold tracking-tight">
                Not your average
                <br />
                <span className="text-green">accounting firm.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mint/55">
                Most firms treat ecommerce like a side quest. For us it&rsquo;s
                the only quest: specialist, accurate, fast, and always a step
                ahead.
              </p>
            </div>

            {/* Diagonal bento — under the copy on tablet/mobile, beside it on desktop */}
            <div
              className="flex w-full lg:w-1/2"
              style={{ height: columnH, gap }}
            >
              {COLUMNS.map((column, ci) => (
                <div
                  key={ci}
                  className="flex flex-1 flex-col"
                  style={{ gap }}
                >
                  {column.map((idx) => (
                    <Tile
                      key={idx}
                      index={idx}
                      expanded={isExpanded(idx)}
                      expandedH={exp}
                      collapsedH={col}
                      onActivate={() => activate(idx)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
