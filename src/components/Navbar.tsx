import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NAV_LINKS, CONTACT_HREF } from "../data/site";

export default function Navbar() {
  const [active, setActive] = useState<string>("#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
    >
      <nav className="relative flex min-h-[72px] w-full max-w-6xl items-center justify-center px-2 sm:px-4">
        {/* Logo — fades out on scroll (desktop) */}
        <a
          href="#home"
          className={`absolute left-2 top-1/2 flex -translate-y-1/2 items-center transition-all duration-500 sm:left-4 ${
            scrolled
              ? "md:pointer-events-none md:-translate-x-4 md:opacity-0"
              : "opacity-100"
          }`}
        >
          <img
            src="/fintagic-logo.png"
            alt="Fintagic"
            className="h-16 w-auto sm:h-20"
          />
        </a>

        {/* Center pill nav — always centered, persists on scroll */}
        <div
          className={`hidden items-center gap-1 rounded-full border border-teal/10 bg-white p-1.5 transition-shadow duration-300 md:flex ${
            scrolled
              ? "shadow-[0_10px_34px_rgba(1,20,24,0.12)]"
              : "shadow-[0_6px_20px_rgba(1,20,24,0.06)]"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-teal"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? "text-green" : "text-teal/80 hover:text-teal"
                  }`}
                >
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Right actions — fade out on scroll (desktop) */}
        <div
          className={`absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 transition-all duration-500 sm:right-4 sm:gap-3 ${
            scrolled
              ? "md:pointer-events-none md:translate-x-4 md:opacity-0"
              : "opacity-100"
          }`}
        >
          <a
            href={CONTACT_HREF}
            className="rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(0,223,127,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,223,127,0.45)] active:translate-y-0"
          >
            Contact Us
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
