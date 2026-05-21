import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CAPABILITIES } from "../data/site";
import { ART } from "./CapabilityArt";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const R = 1300; // wheel radius (px)
const STEP = 18; // degrees between cards
const PIVOT = `calc(40vh + ${R}px)`; // wheel centre, below the viewport

/** Wrap an angle into (-period/2, period/2] so the wheel loops endlessly. */
function wrapAngle(v: number, period: number) {
  let a = ((v % period) + period) % period;
  if (a > period / 2) a -= period;
  return a;
}

const TILT = 10; // max degrees of 3D hover tilt

function onCardMove(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.transition = "transform 0.12s ease-out, box-shadow 0.2s ease-out";
  el.style.transform = `perspective(900px) rotateX(${-py * TILT * 2}deg) rotateY(${px * TILT * 2}deg) scale(1.04)`;
  el.style.boxShadow = "0 24px 46px rgba(1,20,24,0.16)";
}

function onCardLeave(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
  el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
  el.style.boxShadow = "0 14px 34px rgba(1,20,24,0.10)";
}

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const n = CAPABILITIES.length;
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const scope = root.current!;
      const cards = gsap.utils.toArray<HTMLElement>(".cap-card", scope);
      const period = n * STEP;
      let lastIdx = -1;

      const layout = (progress: number) => {
        const offset = progress * (n - 1) * STEP;
        cards.forEach((card, i) => {
          const a = wrapAngle(i * STEP - offset, period);
          const x = Math.abs(a);
          const scale = Math.max(0.8, 1 - x / 300);
          const opacity = x > 60 ? 0 : x > 50 ? 1 - (x - 50) / 10 : 1;
          card.style.transform = `translate(-50%, -50%) rotate(${a}deg) translateY(-${R}px) scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.zIndex = String(Math.round(300 - x));
        });
      };

      layout(0);

      ScrollTrigger.create({
        trigger: scope,
        start: "top top",
        end: "+=330%",
        pin: ".cap-scene",
        scrub: 1,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (n - 1),
          duration: { min: 0.15, max: 0.5 },
          ease: "power1.inOut",
          delay: 0.04,
        },
        onUpdate: (self) => {
          layout(self.progress);
          const idx = Math.min(
            n - 1,
            Math.max(0, Math.round(self.progress * (n - 1))),
          );
          if (idx !== lastIdx) {
            lastIdx = idx;
            setActive(idx);
          }
        },
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  const current = CAPABILITIES[active];

  return (
    <section id="capabilities" ref={root} className="relative bg-paper">
      <div className="cap-scene relative h-screen overflow-hidden">
        {/* Looping arc of cards — positioned per-frame by scroll */}
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.id}
            className="cap-card absolute top-[var(--pivot)] left-1/2 w-[320px] will-change-transform"
            style={
              {
                "--pivot": PIVOT,
                transformOrigin: "center",
              } as CSSProperties
            }
          >
            <div
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              className="cap-tilt overflow-hidden rounded-[28px] shadow-[0_14px_34px_rgba(1,20,24,0.10)] [transform-style:preserve-3d]"
            >
              <div
                className="flex h-[clamp(220px,15.5vw,300px)] items-center justify-center px-7 py-6"
                style={{ background: cap.color }}
              >
                <div className="flex h-full w-full items-center justify-center">
                  {ART[cap.id]}
                </div>
              </div>
              <div className="flex h-[clamp(108px,7.5vw,128px)] flex-col items-center justify-center bg-white px-4 text-center">
                <span className="font-display text-2xl font-extrabold text-ink sm:text-[27px]">
                  {cap.t1}
                </span>
                <span
                  className="font-display text-2xl font-extrabold sm:text-[27px]"
                  style={{ color: cap.color }}
                >
                  {cap.t2}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Subtext — changes with the centred card */}
        <div className="absolute inset-x-0 bottom-[7vh] z-[400] flex justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl text-center text-lg leading-relaxed text-teal/75"
            >
              {current.blurb}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
