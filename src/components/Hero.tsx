import { useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Variant = "green" | "ink";

/** One face of the rolling box: a two-line headline with a skewed highlight. */
function Headline({
  line1,
  line2,
  variant,
}: {
  line1: string;
  line2: string;
  variant: Variant;
}) {
  const highlightBg = variant === "green" ? "bg-green" : "bg-ink";
  const highlightText = variant === "green" ? "text-ink" : "text-green";

  return (
    <h2 className="text-center font-display text-[clamp(3rem,11vw,7rem)] leading-[1.08] font-medium tracking-tight text-ink">
      <span className="block">{line1}</span>
      <span className="relative mt-2 inline-block">
        <span
          aria-hidden
          className={`absolute -inset-x-6 -inset-y-1 -z-0 -skew-x-6 -rotate-[1.5deg] ${highlightBg}`}
        />
        <span className={`relative z-10 px-2 ${highlightText}`}>{line2}</span>
      </span>
    </h2>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const halfZ = "calc(var(--face) / 2)";

  useGSAP(
    () => {
      // Entrance
      gsap.from(".hero-box", {
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.7,
        ease: "power3.out",
      });

      // Scroll-driven box roll: pinned, scrubbed, eased.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=135%",
          pin: ".hero-scene",
          scrub: 1,
          anticipatePin: 1,
          // Stop mid-roll and it settles to the next/previous state
          // based on the direction you were scrolling.
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.25, max: 0.6 },
            ease: "power1.inOut",
            delay: 0.04,
            directional: true,
          },
        },
      });

      tl.to(
        ".hero-box",
        { rotationX: 90, duration: 0.85, ease: "power1.inOut" },
        0,
      )
        .to(".hero-front-inner", { filter: "blur(6px)", duration: 0.42 }, 0)
        .to(
          ".hero-next-inner",
          { filter: "blur(0px)", duration: 0.4 },
          0.42,
        )
        // brief settle once the roll completes
        .to({}, { duration: 0.15 });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" className="relative">
      <div
        className="hero-scene flex h-screen items-center justify-center overflow-hidden px-5"
        style={
          {
            perspective: "1300px",
            "--face": "clamp(270px, 30vh, 360px)",
          } as CSSProperties
        }
      >
        <div
          className="hero-box relative w-full max-w-6xl"
          style={{
            height: "var(--face)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Face 1 — front */}
          <div
            className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]"
            style={{ transform: `translateZ(${halfZ})` }}
          >
            <div className="hero-front-inner">
              <Headline line1="Your Stack" line2="Is Modern." variant="green" />
            </div>
          </div>

          {/* Face 2 — sits above, rolls down into view */}
          <div
            className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]"
            style={{ transform: `rotateX(-90deg) translateZ(${halfZ})` }}
          >
            <div
              className="hero-next-inner"
              style={{ filter: "blur(6px)" }}
            >
              <Headline
                line1="Your Books"
                line2="Should Be Too."
                variant="ink"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
