import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { STATS } from "../data/site";
import type { Stat } from "../data/site";
import Reveal from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

// Single parent trigger fires once; each tile inherits the "show" state and
// reads its stagger delay from `custom={i}`. Avoids per-tile IntersectionObservers,
// which were missing for some tiles on mobile.
const tileVariant: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.07, ease: EASE },
  }),
};

// Bento sizing + colour per stat. Mobile flows naturally (2-col, every tile 1×1);
// only the desktop (lg) bento uses explicit grid placement.
const LAYOUT = [
  // STATS[0] — Desktop: col 2, rows 1-2 tall (feature tile).
  { span: "lg:col-start-2 lg:row-start-1 lg:row-span-2", bg: "#D9B8FF" },
  // STATS[1] — Desktop: cols 3-4 row 1 (wide top).
  {
    span: "lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-1",
    bg: "#B9F08A",
  },
  // STATS[2] — Desktop: col 4 row 2.
  { span: "lg:col-start-4 lg:row-start-2 lg:row-span-1", bg: "#C9F5DD" },
  // STATS[3] — Desktop: col 3, rows 2-3 (tall).
  { span: "lg:col-start-3 lg:row-start-2 lg:row-span-2", bg: "#7BE8D8" },
  // STATS[4] — Desktop: col 4 row 3.
  { span: "lg:col-start-4 lg:row-start-3 lg:row-span-1", bg: "#D9B8FF" },
  // STATS[5] — Desktop: col 2 row 3.
  { span: "lg:col-start-2 lg:row-start-3 lg:row-span-1", bg: "#B9F08A" },
  // STATS[6] — Desktop: col 1, rows 2-3 (tall; top of col 1 stays empty).
  { span: "lg:col-start-1 lg:row-start-2 lg:row-span-2", bg: "#7BE8D8" },
];

function format(s: Stat) {
  const n =
    s.decimals != null ? s.value.toFixed(s.decimals) : s.value.toLocaleString();
  return `${s.prefix ?? ""}${n}${s.suffix ?? ""}`;
}

export default function Stats() {
  return (
    <section className="bg-ink py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[1330px] px-5">
        <div className="text-center">
          <Reveal>
            <h2 className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.05] font-bold tracking-tight">
              Work that moves{" "}
              <span className="text-green">the numbers.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-[clamp(1.05rem,1.5vw,1.375rem)] leading-relaxed text-mint/55">
              No vanity metrics. These are the numbers our clients actually feel
              at the end of a quarter.
            </p>
          </Reveal>
        </div>

        <motion.div
          className="mt-16 grid grid-cols-2 gap-px auto-rows-[170px] lg:auto-rows-auto lg:grid-cols-[19fr_29fr_19fr_29fr] lg:grid-rows-[170px_170px_200px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-70px" }}
        >
          {STATS.map((s, i) => {
            const { span, bg } = LAYOUT[i % LAYOUT.length];
            const fromTop = i % 2 === 0;
            const transformOrigin = fromTop ? "top left" : "bottom left";
            return (
              <motion.div
                key={i}
                variants={tileVariant}
                custom={i}
                style={{ background: bg, transformOrigin }}
                className={`flex flex-col justify-end overflow-hidden rounded-2xl p-5 lg:p-7 ${span}`}
              >
                <span className="font-display text-[clamp(2.25rem,5vw,55px)] font-bold tracking-tight text-ink">
                  {format(s)}
                </span>
                <span className="mt-3 max-w-[42ch] text-[clamp(0.72rem,2.2vw,0.95rem)] leading-snug font-medium text-ink/70">
                  {s.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
