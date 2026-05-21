import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Capabilities from "./components/Capabilities";
import WhyUs from "./components/WhyUs";
import Clients from "./components/Clients";
import Stats from "./components/Stats";
import Verticals from "./components/Verticals";
import CaseStudies from "./components/CaseStudies";
import Credentials from "./components/Credentials";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-green"
      />
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <WhyUs />
        <Clients />
        <Stats />
        <Verticals />
        <CaseStudies />
        <Credentials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
