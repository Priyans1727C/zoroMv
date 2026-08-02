import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import { Home, Compass, Heart, User, Settings, Play, Sparkles } from "lucide-react";
import { PosterSkeleton } from "./Skeleton";



const NAV_MAIN = [
  { key: "home", label: "Home", icon: Home, path: "/" },
  { key: "explore", label: "Explore", icon: Compass, path: "/explore" },
  { key: "favourites", label: "Favourites", icon: Heart, path: "/favourites" },
  { key: "community", label: "Community", icon: Compass, path: "/community" },
  { key: "myList", label: "MyList", icon: Heart, path: "/my-list" },
];

const NAV_ACCOUNT = [
  { key: "profile", label: "Profile", icon: User, path: "/profile" },
  { key: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

const CONTINUE_WATCHING = [
  { title: "Chernobyl", sub: "Episode 3", progress: 64 },
  { title: "Snowpiercer", sub: "Episode 7", progress: 32 },
  { title: "The Platform", sub: "55min 12sec", progress: 78 },
  { title: "Dark Matter", sub: "Episode 1", progress: 12 },
];

export default function Sidebar() {
  const location = useLocation();

  const activeKey = useMemo(() => {
    const allItems = [...NAV_MAIN, ...NAV_ACCOUNT];
    return allItems.find((item) => item.path === location.pathname)?.key ?? "home";
  }, [location.pathname]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-[260px] shrink-0 flex-col rounded-3xl p-6 lg:flex"
    >
      <Link to="/" className="flex items-center gap-2 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-primary">Zoro</span>
          <span>Mv</span>
        </h1>
      </Link>

      <nav className="mt-10 flex flex-col gap-1">
        {NAV_MAIN.map((item) => (
          <NavButton key={item.key} item={item} isActive={item.key === activeKey} />
        ))}
      </nav>

      <div className="mx-2 my-6 h-px bg-border" />

      <nav className="flex flex-col gap-1">
        {NAV_ACCOUNT.map((item) => (
          <NavButton key={item.key} item={item} isActive={item.key === activeKey} />
        ))}
      </nav>

      <div className="mt-8 flex min-h-0 flex-1 flex-col">
        <p className="px-2 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Continue Watching
        </p>
        <div className="scroll-hide mt-4 flex flex-col gap-3 overflow-y-auto pr-1">
          {CONTINUE_WATCHING.map((item, i) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="group flex items-center gap-3 rounded-2xl bg-surface-2/40 p-2 text-left transition-colors hover:bg-surface-2"
            >
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                <PosterSkeleton className="h-full w-full rounded-lg" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20">
                  <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/5 text-foreground/80 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Play className="h-3 w-3 fill-current" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

function NavButton({ item, isActive }) {
  const Icon = item.icon;
  return (
    <Link to={item.path}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium"
      >
        {isActive && (
          <motion.span
            layoutId="navActive"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="absolute inset-0 rounded-2xl bg-primary/10 ring-1 ring-primary/30"
          />
        )}
        <Icon className={`relative h-5 w-5 ${isActive ? "text-primary" : "text-foreground/70"}`} />
        <span className={`relative ${isActive ? "text-primary" : "text-foreground/80"}`}>
          {item.label}
        </span>
      </motion.div>
    </Link>
  );
}

export { NAV_MAIN, NAV_ACCOUNT };
