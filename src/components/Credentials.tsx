import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CREDENTIALS } from "../data/site";

const LEAD =
  "Our credentials power the confidence behind our work, ensuring".split(" ");
const HILITE = ["trust", "at", "every", "level."];
const STAGGER = 0.05;
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

type Variant = "stars" | "scallop" | "shield";
const VARIANTS: Variant[] = ["stars", "scallop", "shield"];

/** 14 small stars on a ring (just inside the outer circle). */
function StarsRing({ r = 41 }: { r?: number }) {
  const n = 14;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + r * Math.cos(a);
        const y = 50 + r * Math.sin(a);
        return (
          <polygon
            key={i}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}
            points="0,-2 0.6,-0.6 2,-0.6 0.85,0.4 1.25,2 0,1 -1.25,2 -0.85,0.4 -2,-0.6 -0.6,-0.6"
            fill="currentColor"
          />
        );
      })}
    </>
  );
}

/** Build a gently scalloped circle as a polygon path. */
function scallopPath() {
  const n = 32; // total points; 16 bumps
  const rOuter = 47;
  const rInner = 44;
  const pts = Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = 50 + r * Math.cos(a);
    const y = 50 + r * Math.sin(a);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return pts.join(" ") + " Z";
}

function BadgeArt({ variant }: { variant: Variant }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 h-full w-full text-teal"
      fill="none"
      aria-hidden
    >
      {variant === "stars" && (
        <>
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <circle
            cx="50"
            cy="50"
            r="33"
            stroke="currentColor"
            strokeWidth="0.55"
            strokeDasharray="1 1.5"
          />
          <StarsRing />
        </>
      )}
      {variant === "scallop" && (
        <>
          <path
            d={scallopPath()}
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="currentColor"
            strokeWidth="0.6"
          />
        </>
      )}
      {variant === "shield" && (
        <>
          <path
            d="M50 6 L88 18 L88 50 Q88 78 50 94 Q12 78 12 50 L12 18 Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <polygon
            points="50,16 51.7,21.4 57.4,21.4 52.8,24.7 54.5,30.1 50,26.8 45.5,30.1 47.2,24.7 42.6,21.4 48.3,21.4"
            fill="currentColor"
          />
        </>
      )}
    </svg>
  );
}

// Per-badge variant uses `custom` for the per-tile delay; single trigger on the
// row reliably fires all six on mobile.
const badgeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.06, ease: EASE },
  }),
};

function Badge({
  name,
  variant,
  index,
}: {
  name: string;
  variant: Variant;
  index: number;
}) {
  return (
    <motion.div
      variants={badgeVariant}
      custom={index}
      className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
    >
      <BadgeArt variant={variant} />
      <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-[10px] leading-[1.15] font-extrabold tracking-wide uppercase text-teal sm:text-[11px] lg:text-[12px]">
        {name}
      </div>
    </motion.div>
  );
}

export default function Credentials() {
  return (
    <section id="credentials" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-5">
        {/* Animated headline — single parent trigger, every word fires reliably */}
        <motion.h2
          className="text-center font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.18] font-normal tracking-tight text-ink"
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

            <span className="relative inline-block">
              <motion.span
                aria-hidden
                className="absolute -inset-x-2 inset-y-0.5 -z-0 origin-left -skew-x-6 -rotate-[1deg] bg-green sm:-inset-x-4 sm:-inset-y-1 sm:-rotate-[1.5deg]"
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

        {/* Badge row — single parent trigger; each badge gets its delay via `custom` */}
        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:mt-20 sm:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {CREDENTIALS.map((cred, i) => (
            <Badge
              key={cred}
              name={cred}
              variant={VARIANTS[i % VARIANTS.length]}
              index={i}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
