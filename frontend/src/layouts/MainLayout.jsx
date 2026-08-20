import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { motion } from "framer-motion";
import TopBar from "./components/Topbar";
import MobileNav from "./components/MobileNav";
import Sidebar from "./components/Sidebar";


export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [catOpen, setCatOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[160px]" />
      </div>

      <div className="mx-auto flex max-w-[1600px] gap-6 p-3 sm:p-4 lg:p-6">
        <Sidebar />
        <MobileNav
          open={menuOpen}
          onToggle={() => setMenuOpen((v) => !v)}
          onClose={() => setMenuOpen(false)}
        />


        <main className="relative flex min-w-0 flex-1 flex-col gap-5 sm:gap-6 pt-16 lg:pt-0">
          {/* Sticky desktop header. Small screens use the Dynamic Island navbar. */}
          <TopBar
            category={category}
            setCategory={setCategory}
            catOpen={catOpen}
            setCatOpen={setCatOpen}
          />

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-0 flex-1"
          >
            <Outlet />
          </motion.div>

          <footer className="border-t border-border pb-2  text-xs text-muted-foreground">
            <p>
              © 2026 ZoroMv — A movie & series streaming experience created by
              <span className="font-medium text-foreground"> Priyanshu Singh</span>.
              This web app is currently under development.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
