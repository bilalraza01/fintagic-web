import { motion } from "framer-motion";
import { CREDENTIALS } from "../data/site";

const LEAD =
  "Our credentials power the confidence behind our work, ensuring".split(
    " ",
  );
const HILITE = ["trust", "at", "every", "level."];
const STAGGER = 0.05;
const EASE = [0.22, 1, 0.36, 1] as const;

const word = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
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
      initial={{ opacity: 0, scale: 0.82 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: EASE,
      }}
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
        {/* Animated headline — same pattern as the "company we keep" section */}
        <h2 className="text-center font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.18] font-normal tracking-tight text-ink">
          <span className="flex flex-wrap justify-center gap-x-[0.26em]">
            {LEAD.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={word}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: i * STAGGER,
                  ease: EASE,
                }}
              >
                {w}
              </motion.span>
            ))}

            <span className="relative inline-block">
              <motion.span
                aria-hidden
                className="absolute -inset-x-2 inset-y-0.5 -z-0 origin-left -skew-x-6 -rotate-[1deg] bg-green sm:-inset-x-4 sm:-inset-y-1 sm:-rotate-[1.5deg]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: LEAD.length * STAGGER,
                  ease: [0.65, 0, 0.35, 1],
                }}
              />
              <span className="relative z-10 flex flex-wrap gap-x-[0.26em] px-2">
                {HILITE.map((w, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-block"
                    variants={word}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      duration: 0.5,
                      delay: (LEAD.length + 1 + idx) * STAGGER,
                      ease: EASE,
                    }}
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
          </span>
        </h2>

        {/* Badge row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:mt-20 sm:gap-6">
          {CREDENTIALS.map((cred, i) => (
            <Badge
              key={cred}
              name={cred}
              variant={VARIANTS[i % VARIANTS.length]}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
