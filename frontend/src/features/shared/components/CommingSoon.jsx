import { Link } from "react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";

export default function ComingSoonPage({ title, icon: Icon, description }) {
  const SafeIcon = Icon ?? Sparkles;
  const safeTitle = title ?? "Coming Soon";
  const safeDescription = description ?? "This section is under construction.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center"
    >
      <div className="glass-panel max-w-lg rounded-3xl p-10">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/15">
          <SafeIcon className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-3">{safeTitle}</h2>
        <p className="text-xl font-semibold text-foreground mb-2">Coming Soon</p>
        <p className="text-muted-foreground mb-8">{safeDescription}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
