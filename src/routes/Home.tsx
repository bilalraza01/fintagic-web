import { useEffect } from "react";
import { useLocation } from "react-router";
import Hero from "../components/Hero";
import Capabilities from "../components/Capabilities";
import WhyUs from "../components/WhyUs";
import Clients from "../components/Clients";
import Stats from "../components/Stats";
import Verticals from "../components/Verticals";
import CaseStudies from "../components/CaseStudies";
import Credentials from "../components/Credentials";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  const { hash, pathname } = useLocation();

  // Route + hash aware scroll:
  //  - Landing on "/" with no hash → start at the top.
  //  - Landing on "/#foo" (e.g. from Contact → Nav "Capabilities") → scroll to
  //    the target section after paint so GSAP ScrollTrigger has set itself up.
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const scrollTo = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      // Two rAFs let ScrollTrigger and layout settle before we try to scroll.
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(scrollTo);
        (raf1 as unknown as { inner: number }).inner = raf2;
      });
      return () => cancelAnimationFrame(raf1);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <Hero />
      <Capabilities />
      <WhyUs />
      <Clients />
      <Stats />
      <Verticals />
      <CaseStudies />
      <Credentials />
      <FinalCTA />
    </>
  );
}
