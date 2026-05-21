import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  title: ReactNode;
  sub?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ title, sub, align = "left" }: Props) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.05] font-extrabold tracking-tight text-ink">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg leading-relaxed text-teal/75">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
