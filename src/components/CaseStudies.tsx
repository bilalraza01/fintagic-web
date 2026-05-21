import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CASE_STUDIES } from "../data/site";

export default function CaseStudies() {
  const [[page, dir], setPage] = useState<[number, number]>([0, 0]);
  const idx = ((page % CASE_STUDIES.length) + CASE_STUDIES.length) %
    CASE_STUDIES.length;
  const c = CASE_STUDIES[idx];

  const paginate = (d: number) => setPage([page + d, d]);

  return (
    <section id="work" className="bg-ink py-24 text-white sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] font-extrabold tracking-tight">
              What the work{" "}
              <span className="text-green">actually</span> looks like.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <CarouselButton dir="prev" onClick={() => paginate(-1)} />
            <CarouselButton dir="next" onClick={() => paginate(1)} />
          </div>
        </div>

        <div className="relative mt-12 min-h-[340px] overflow-hidden sm:min-h-[300px]">
          <AnimatePresence custom={dir} mode="wait">
            <motion.article
              key={page}
              custom={dir}
              initial={{ opacity: 0, x: dir >= 0 ? 90 : -90 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir >= 0 ? -90 : 90 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-14"
            >
              <div className="flex flex-col justify-between gap-6">
                <span className="font-display text-6xl font-extrabold text-green sm:text-8xl">
                  {c.metric}
                </span>
                <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-mint/70 uppercase">
                  {c.vertical}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-display text-3xl font-extrabold sm:text-4xl">
                  {c.title}
                </h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-mint/60">
                  {c.body}
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2.5">
          {CASE_STUDIES.map((_, i) => (
            <button
              key={i}
              aria-label={`Case study ${i + 1}`}
              onClick={() => setPage([i, i > idx ? 1 : -1])}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 34 : 8,
                background: i === idx ? "#00df7f" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={dir === "prev" ? "Previous" : "Next"}
      onClick={onClick}
      className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-all duration-200 hover:border-green hover:bg-green hover:text-ink"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: dir === "prev" ? "rotate(180deg)" : "none" }}
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
