import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import { NAV_LINKS, CONTACT_HREF } from "../data/site";

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";

  const [active, setActive] = useState<string>("#home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy runs only on the home route (the sections don't exist elsewhere).
  useEffect(() => {
    if (!isHome) {
      setActive("");
      return;
    }
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
  }, [isHome, pathname]);

  // Close mobile menu whenever the URL changes (link tap navigates away).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  // Lock body scroll while menu is open + close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Section links: on home, use plain anchor hash for the smooth in-page scroll.
  // On any other route, use "/#anchor" so React Router navigates to home and
  // Home's useEffect scrolls to the target after mount.
  const sectionTarget = (hashRef: string) => (isHome ? hashRef : `/${hashRef}`);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
      >
        <nav className="relative flex min-h-[72px] w-full max-w-6xl items-center justify-center px-2 sm:px-4">
          {/* Logo — fades out on scroll (desktop only) */}
          <Link
            to="/"
            className={`absolute left-2 top-1/2 flex -translate-y-1/2 items-center transition-all duration-500 sm:left-4 ${
              scrolled
                ? "lg:pointer-events-none lg:-translate-x-4 lg:opacity-0"
                : "opacity-100"
            }`}
          >
            <img
              src="/fintagic-logo.png"
              alt="Fintagic"
              className="h-16 w-auto sm:h-20"
            />
          </Link>

          {/* Center pill nav — desktop only, persists on scroll */}
          <div
            className={`hidden items-center gap-1 rounded-full border border-teal/10 bg-white p-1.5 transition-shadow duration-300 lg:flex ${
              scrolled
                ? "shadow-[0_10px_34px_rgba(1,20,24,0.12)]"
                : "shadow-[0_6px_20px_rgba(1,20,24,0.06)]"
            }`}
          >
            {NAV_LINKS.map((link) => {
              const isActive = isHome && active === link.href;
              return (
                <Link
                  key={link.href}
                  to={sectionTarget(link.href)}
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
                </Link>
              );
            })}
          </div>

          {/* Right actions — mobile hamburger + Contact button.
              On desktop the button fades out on scroll to match the logo. */}
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 sm:right-4 sm:gap-3">
            {/* Contact Us — visible everywhere; fades on desktop scroll. */}
            <Link
              to={CONTACT_HREF}
              className={`rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(0,223,127,0.35)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,223,127,0.45)] active:translate-y-0 ${
                scrolled
                  ? "lg:pointer-events-none lg:translate-x-4 lg:opacity-0"
                  : "opacity-100"
              }`}
            >
              Contact Us
            </Link>

            {/* Mobile hamburger — hidden at lg+. Sits on the far right so
                the thumb hits it where users expect the menu affordance. */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full bg-ink text-green shadow-[0_6px_18px_rgba(1,20,24,0.2)] transition-transform duration-200 hover:scale-105 active:scale-95 lg:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] lg:hidden"
          >
            {/* Dimmed backdrop — tap to close */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            />

            {/* Sliding panel */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="absolute inset-x-0 top-0 flex max-h-[95vh] flex-col overflow-y-auto rounded-b-[32px] bg-paper p-5 shadow-[0_20px_60px_rgba(1,20,24,0.35)] sm:p-6"
            >
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center"
                >
                  <img
                    src="/fintagic-logo.png"
                    alt="Fintagic"
                    className="h-12 w-auto"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-full bg-ink text-green transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <ul className="mt-8 flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => {
                  const isActive = isHome && active === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.08 + i * 0.05,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={sectionTarget(link.href)}
                        className={`flex items-center justify-between rounded-2xl border border-teal/10 bg-white px-5 py-4 font-display text-xl font-semibold transition-colors duration-200 hover:border-green ${
                          isActive ? "text-green" : "text-ink"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span aria-hidden className="text-teal/40">→</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + NAV_LINKS.length * 0.05,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6"
              >
                <Link
                  to={CONTACT_HREF}
                  className="block rounded-full bg-green px-6 py-4 text-center font-display text-lg font-bold text-ink shadow-[0_10px_30px_rgba(0,223,127,0.35)]"
                >
                  Contact Us →
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
