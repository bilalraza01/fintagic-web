import { motion } from "framer-motion";
import { VERTICALS } from "../data/site";
import SectionHeading from "./SectionHeading";

const R = 39; // orbit radius in %

export default function Verticals() {
  return (
    <section className="relative overflow-hidden bg-mint py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <SectionHeading
            title={
              <>
                Built for every <span className="text-green">DTC</span>{" "}
                vertical.
              </>
            }
            sub="The chart of accounts, margin model, and tax footprint look different for skincare than for supplements. We already know the difference, so there's no ramp-up."
          />

          {/* Radial hex diagram */}
          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            {/* connecting lines */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              {VERTICALS.map((_, i) => {
                const a = (-90 + i * (360 / VERTICALS.length)) * (Math.PI / 180);
                const x = 50 + R * Math.cos(a);
                const y = 50 + R * Math.sin(a);
                return (
                  <motion.line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke="#043d45"
                    strokeOpacity="0.18"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.07 }}
                  />
                );
              })}
            </svg>

            {/* center node */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative grid h-28 w-28 place-items-center sm:h-32 sm:w-32">
                <motion.svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <polygon
                    points="50,4 90,27 90,73 50,96 10,73 10,27"
                    fill="#043d45"
                  />
                </motion.svg>
                <span className="relative font-display text-xl font-extrabold text-green sm:text-2xl">
                  DTC
                </span>
              </div>
            </motion.div>

            {/* orbiting verticals */}
            {VERTICALS.map((v, i) => {
              const a = (-90 + i * (360 / VERTICALS.length)) * (Math.PI / 180);
              const x = 50 + R * Math.cos(a);
              const y = 50 + R * Math.sin(a);
              return (
                <motion.div
                  key={v}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 17,
                    delay: 0.4 + i * 0.08,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 3 + (i % 4),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="group flex w-max cursor-default items-center gap-1.5 rounded-full border border-teal/15 bg-paper px-3 py-2 shadow-[0_6px_18px_rgba(1,20,24,0.06)] transition-colors duration-300 hover:border-green hover:bg-teal"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 100 100"
                      className="text-green"
                    >
                      <polygon
                        points="50,6 88,28 88,72 50,94 12,72 12,28"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-xs font-bold whitespace-nowrap text-teal transition-colors duration-300 group-hover:text-white sm:text-sm">
                      {v}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
