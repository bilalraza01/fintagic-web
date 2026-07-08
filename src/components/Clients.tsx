import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { TOOLS } from "../data/site";

const LEAD =
  "The company we keep inspires us to push boundaries and reimagine".split(" ");
const HILITE = ["what's", "possible."];
const STAGGER = 0.06;
const EASE = [0.22, 1, 0.36, 1] as const;

// Per-word variant — the `show` transition reads its delay from the `custom`
// prop on each motion.span, so every word fires with its own staggered delay
// off a single parent trigger (instead of per-word IntersectionObservers,
// which can miss on small viewports).
const wordVariant: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: i * STAGGER, ease: EASE },
  }),
};

const bgVariant: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: {
      duration: 0.5,
      delay: LEAD.length * STAGGER,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

export default function Clients() {
  const row = [...TOOLS, ...TOOLS];

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-5">
        <motion.h2
          className="text-center font-display text-[clamp(2.5rem,7vw,85px)] leading-[1.25] font-normal tracking-tight text-ink"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <span className="flex flex-wrap justify-center gap-x-[0.26em]">
            {LEAD.map((w, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                variants={wordVariant}
                custom={idx}
              >
                {w}
              </motion.span>
            ))}

            {/* highlighted phrase */}
            <span className="relative inline-block">
              <motion.span
                aria-hidden
                className="absolute -inset-x-4 -inset-y-1 -z-0 origin-left -skew-x-6 -rotate-[1.5deg] bg-green"
                variants={bgVariant}
              />
              <span className="relative z-10 flex flex-wrap gap-x-[0.26em] px-2">
                {HILITE.map((w, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-block"
                    variants={wordVariant}
                    custom={LEAD.length + 1 + idx}
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
          </span>
        </motion.h2>
      </div>

      {/* Tool stack ribbon */}
      <div className="group relative mt-16 overflow-hidden sm:mt-24">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-paper to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-paper to-transparent sm:w-32" />

        <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
          {row.map((tool, i) => (
            <div
              key={i}
              className="group/logo flex h-20 min-w-[200px] shrink-0 items-center justify-center rounded-2xl bg-white px-8 shadow-[0_10px_30px_rgba(1,20,24,0.06)]"
            >
              <img
                src={`/tools/${tool.slug}.svg`}
                alt={tool.name}
                className="h-9 w-auto max-w-[150px] object-contain opacity-45 grayscale transition duration-300 group-hover/logo:scale-105 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
