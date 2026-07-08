import { Outlet } from "react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Shared shell: scroll-progress bar, nav, page content, footer.
 * Route-specific content is rendered via <Outlet/> — one place to change the
 * chrome that surrounds every route.
 */
export default function RootLayout() {
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
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
