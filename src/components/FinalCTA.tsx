import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { CONTACT_HREF } from "../data/site";

const LEAD = ["Ready", "For"];
const HILITE = ["Clean", "Books?"];
const STAGGER = 0.07;
const EASE = [0.22, 1, 0.36, 1] as const;

const word = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ────────── Confetti field (DOM-based, framer-motion springs) ──────────

const COLORS = [
  "#00DF7F",
  "#37D366",
  "#7BE8D8",
  "#C77DFF",
  "#7C2BC4",
  "#043D45",
];

type Shape = "square" | "triangle" | "star" | "circle" | "pentagon";
const SHAPES: Shape[] = ["square", "triangle", "star", "circle", "pentagon"];

const REPULSE_RADIUS = 130;
const REPULSE_STRENGTH = 1.0;

type Spec = {
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  shape: Shape;
  filled: boolean;
};

function ShapeSvg({
  shape,
  color,
  size,
  filled,
}: {
  shape: Shape;
  color: string;
  size: number;
  filled: boolean;
}) {
  const stroke = color;
  const fill = filled ? color : "none";
  const sw = filled ? 0 : 1.6;
  switch (shape) {
    case "square":
      return (
        <svg width={size} height={size} viewBox="0 0 10 10">
          <rect
            x={sw / 2}
            y={sw / 2}
            width={10 - sw}
            height={10 - sw}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );
    case "triangle":
      return (
        <svg width={size} height={size} viewBox="0 0 10 10">
          <polygon
            points="5,1 9,9 1,9"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 10 10">
          <polygon
            points="5,1 6,4 9,4 6.5,6 7.5,9 5,7.4 2.5,9 3.5,6 1,4 4,4"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 10 10">
          <circle
            cx="5"
            cy="5"
            r={4 - sw / 2}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );
    case "pentagon":
      return (
        <svg width={size} height={size} viewBox="0 0 10 10">
          <polygon
            points="5,1 9,4 7.5,9 2.5,9 1,4"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function Particle({
  spec,
  cursorX,
  cursorY,
}: {
  spec: Spec;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}) {
  // Push away from the cursor, falling off linearly with distance.
  const dx = useTransform([cursorX, cursorY], (vals: number[]) => {
    const [cx, cy] = vals;
    const ox = spec.x - cx;
    const oy = spec.y - cy;
    const d = Math.hypot(ox, oy);
    if (d === 0 || d > REPULSE_RADIUS) return 0;
    const force = (1 - d / REPULSE_RADIUS) * REPULSE_RADIUS * REPULSE_STRENGTH;
    return (ox / d) * force;
  });
  const dy = useTransform([cursorX, cursorY], (vals: number[]) => {
    const [cx, cy] = vals;
    const ox = spec.x - cx;
    const oy = spec.y - cy;
    const d = Math.hypot(ox, oy);
    if (d === 0 || d > REPULSE_RADIUS) return 0;
    const force = (1 - d / REPULSE_RADIUS) * REPULSE_RADIUS * REPULSE_STRENGTH;
    return (oy / d) * force;
  });

  const spring = { stiffness: 220, damping: 18, mass: 0.6 };
  const sx = useSpring(dx, spring);
  const sy = useSpring(dy, spring);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: spec.x - spec.size / 2,
        top: spec.y - spec.size / 2,
        width: spec.size,
        height: spec.size,
        rotate: spec.rotation,
        x: sx,
        y: sy,
        willChange: "transform",
      }}
    >
      <ShapeSvg
        shape={spec.shape}
        color={spec.color}
        size={spec.size}
        filled={spec.filled}
      />
    </motion.div>
  );
}

function ConfettiField() {
  const ref = useRef<HTMLDivElement>(null);
  // Start far off-screen so no force is applied on mount.
  const cursorX = useMotionValue(-9999);
  const cursorY = useMotionValue(-9999);
  const [specs, setSpecs] = useState<Spec[]>([]);

  // Generate particle layout on mount and on resize.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const generate = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const count = Math.min(
        220,
        Math.max(120, Math.floor((width * height) / 4200)),
      );
      const arr: Spec[] = Array.from({ length: count }).map(() => ({
        x: rand(6, width - 6),
        y: rand(6, height - 6),
        size: rand(8, 16),
        rotation: rand(0, 360),
        color: pick(COLORS),
        shape: pick(SHAPES),
        filled: Math.random() > 0.4,
      }));
      setSpecs(arr);
    };
    generate();

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(generate);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Track pointer position relative to the field.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    };
    const onLeave = () => {
      cursorX.set(-9999);
      cursorY.set(-9999);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
    };
  }, [cursorX, cursorY]);

  return (
    <div ref={ref} className="relative h-full w-full touch-none overflow-hidden">
      {specs.map((spec, i) => (
        <Particle key={i} spec={spec} cursorX={cursorX} cursorY={cursorY} />
      ))}
    </div>
  );
}

// ────────── FinalCTA section ──────────

export default function FinalCTA() {
  const [off, setOff] = useState({ x: 0, y: 0, r: 0 });

  const dodge = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    // Bias upward so it doesn't drift down into the confetti band.
    setOff({
      x: rand(-220, 220),
      y: rand(-90, 30),
      r: rand(-7, 7),
    });
  };

  return (
    <section
      id="contact"
      className="relative isolate flex min-h-screen flex-col overflow-hidden bg-paper pt-28 pb-0 sm:pt-40"
    >
      {/* Headline + buttons — own area, sits ABOVE the confetti band */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
        <h2 className="font-display text-[clamp(2.75rem,9vw,7rem)] leading-[1.05] font-bold tracking-tight text-ink">
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
                  duration: 0.55,
                  delay: i * STAGGER,
                  ease: EASE,
                }}
              >
                {w}
              </motion.span>
            ))}
          </span>

          <span className="relative mt-2 inline-block">
            <motion.span
              aria-hidden
              className="absolute -inset-x-4 -inset-y-1 -z-0 origin-left -skew-x-6 -rotate-[1.5deg] bg-ink"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.55,
                delay: LEAD.length * STAGGER,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
            <span className="relative z-10 flex flex-wrap justify-center gap-x-[0.26em] px-2 text-green">
              {HILITE.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={word}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.55,
                    delay: (LEAD.length + 1 + i) * STAGGER,
                    ease: EASE,
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </span>
        </h2>

        <div className="relative mt-14 flex items-center justify-center gap-10 sm:mt-20 sm:gap-14">
          <motion.a
            href={CONTACT_HREF}
            whileHover={{ y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative inline-block cursor-pointer px-8 py-3 font-display text-2xl font-bold tracking-tight sm:text-3xl"
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-0 -skew-x-6 -rotate-[1.5deg] bg-green"
            />
            <span className="relative z-10 text-ink">Yes</span>
          </motion.a>

          <motion.a
            href={CONTACT_HREF}
            onPointerEnter={dodge}
            onTouchStart={(e) => {
              e.preventDefault();
              dodge();
            }}
            onClick={(e) => {
              e.preventDefault();
              dodge();
            }}
            animate={{ x: off.x, y: off.y, rotate: off.r }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative inline-block cursor-pointer px-8 py-3 font-display text-2xl font-bold tracking-tight select-none sm:text-3xl"
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-0 -skew-x-6 -rotate-[1.5deg] bg-[#7C2BC4]"
            />
            <span className="relative z-10 text-white">No</span>
          </motion.a>
        </div>
      </div>

      {/* Confetti band — below the buttons, no overlap */}
      <div className="relative z-0 h-[34vh] min-h-[260px] w-full">
        <ConfettiField />
      </div>
    </section>
  );
}
