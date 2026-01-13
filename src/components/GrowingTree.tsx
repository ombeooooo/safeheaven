import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface GrowingTreeProps {
  days: number;
  maxDays?: number;
}

const GrowingTree = ({ days, maxDays = 30 }: GrowingTreeProps) => {
  const progress = Math.min(days / maxDays, 1);

  const getTreeStage = () => {
    if (progress < 0.1) return "seed";
    if (progress < 0.3) return "sprout";
    if (progress < 0.6) return "sapling";
    if (progress < 0.9) return "young";
    return "full";
  };

  const stage = getTreeStage();

  const getNextMilestone = () => {
    if (days < 3) return { target: 3, label: "Sprout" };
    if (days < 9) return { target: 9, label: "Sapling" };
    if (days < 18) return { target: 18, label: "Young Tree" };
    if (days < 27) return { target: 27, label: "Full Growth" };
    return { target: 30, label: "Mastery" };
  };

  const milestone = getNextMilestone();
  const daysToNext = milestone.target - days;

  // Leaf positions for full tree
  const leaves = [
    { x: 32, y: 42, size: 4, delay: 0 },
    { x: 38, y: 35, size: 3, delay: 0.1 },
    { x: 45, y: 28, size: 4, delay: 0.2 },
    { x: 55, y: 28, size: 3, delay: 0.3 },
    { x: 62, y: 35, size: 4, delay: 0.4 },
    { x: 68, y: 42, size: 3, delay: 0.5 },
    { x: 50, y: 22, size: 5, delay: 0.6 },
    { x: 42, y: 40, size: 3, delay: 0.7 },
    { x: 58, y: 40, size: 3, delay: 0.8 },
    { x: 35, y: 48, size: 3, delay: 0.9 },
    { x: 65, y: 48, size: 3, delay: 1 },
    { x: 48, y: 32, size: 4, delay: 1.1 },
    { x: 52, y: 32, size: 4, delay: 1.2 },
  ];

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Tree Container */}
      <div className="relative w-48 h-48 flex items-end justify-center">
        {/* Tree SVG */}
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={stage === "full" ? { rotate: [0, 0.5, -0.5, 0] } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Ground */}
          <ellipse
            cx="50"
            cy="85"
            rx="20"
            ry="4"
            className="fill-secondary stroke-none"
          />

          {stage === "seed" && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <ellipse cx="50" cy="78" rx="8" ry="5" className="fill-secondary stroke-none" />
              <motion.ellipse
                cx="50"
                cy="75"
                rx="5"
                ry="4"
                className="fill-foreground"
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.g>
          )}

          {stage === "sprout" && (
            <g>
              <motion.path
                d="M50 80 L50 68"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.path
                d="M50 70 C45 65 45 60 50 58"
                className="fill-foreground/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              />
              <motion.path
                d="M50 70 C55 65 55 60 50 58"
                className="fill-foreground/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
            </g>
          )}

          {stage === "sapling" && (
            <g>
              <path d="M50 82 L50 50" strokeWidth="2" />
              <path d="M50 60 Q38 55 42 45" className="stroke-foreground" />
              <path d="M50 60 Q62 55 58 45" className="stroke-foreground" />
              <path d="M50 52 Q44 48 47 40" className="stroke-foreground" />
              <path d="M50 52 Q56 48 53 40" className="stroke-foreground" />
              {/* Small leaves */}
              <circle cx="42" cy="44" r="4" className="fill-foreground/10 stroke-none" />
              <circle cx="58" cy="44" r="4" className="fill-foreground/10 stroke-none" />
              <circle cx="50" cy="38" r="5" className="fill-foreground/10 stroke-none" />
            </g>
          )}

          {stage === "young" && (
            <g>
              <path d="M48 82 Q48 60 50 45 Q52 60 52 82" className="fill-foreground/20 stroke-foreground" strokeWidth="1" />
              <path d="M50 65 Q32 58 36 45" className="stroke-foreground" />
              <path d="M50 65 Q68 58 64 45" className="stroke-foreground" />
              <path d="M50 55 Q38 50 42 38" className="stroke-foreground" />
              <path d="M50 55 Q62 50 58 38" className="stroke-foreground" />
              <path d="M50 48 Q45 44 48 35" className="stroke-foreground" />
              <path d="M50 48 Q55 44 52 35" className="stroke-foreground" />
              {/* Leaf clusters */}
              <circle cx="36" cy="44" r="6" className="fill-foreground/8 stroke-foreground/20" />
              <circle cx="64" cy="44" r="6" className="fill-foreground/8 stroke-foreground/20" />
              <circle cx="42" cy="36" r="5" className="fill-foreground/8 stroke-foreground/20" />
              <circle cx="58" cy="36" r="5" className="fill-foreground/8 stroke-foreground/20" />
              <circle cx="50" cy="32" r="7" className="fill-foreground/8 stroke-foreground/20" />
            </g>
          )}

          {stage === "full" && (
            <g>
              {/* Trunk with organic shape */}
              <path
                d="M46 82 Q44 70 46 55 Q48 45 50 40 Q52 45 54 55 Q56 70 54 82 Z"
                className="fill-foreground/15 stroke-foreground"
                strokeWidth="1"
              />

              {/* Main branches */}
              <path d="M50 65 Q28 58 30 42" className="stroke-foreground" strokeWidth="1.5" />
              <path d="M50 65 Q72 58 70 42" className="stroke-foreground" strokeWidth="1.5" />
              <path d="M50 55 Q35 48 38 35" className="stroke-foreground" />
              <path d="M50 55 Q65 48 62 35" className="stroke-foreground" />
              <path d="M50 48 Q42 42 45 28" className="stroke-foreground" />
              <path d="M50 48 Q58 42 55 28" className="stroke-foreground" />

              {/* Foliage base circles */}
              <circle cx="30" cy="40" r="10" className="fill-foreground/5 stroke-foreground/10" />
              <circle cx="70" cy="40" r="10" className="fill-foreground/5 stroke-foreground/10" />
              <circle cx="38" cy="32" r="8" className="fill-foreground/5 stroke-foreground/10" />
              <circle cx="62" cy="32" r="8" className="fill-foreground/5 stroke-foreground/10" />
              <circle cx="50" cy="24" r="12" className="fill-foreground/5 stroke-foreground/10" />

              {/* Animated leaves */}
              {leaves.map((leaf, i) => (
                <motion.circle
                  key={i}
                  cx={leaf.x}
                  cy={leaf.y}
                  r={leaf.size}
                  className="fill-foreground"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: [0, -1, 0],
                  }}
                  transition={{
                    scale: { delay: leaf.delay, duration: 0.3 },
                    opacity: { delay: leaf.delay, duration: 0.3 },
                    y: { delay: leaf.delay + 1, duration: 3, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
              ))}
            </g>
          )}
        </motion.svg>
      </div>

      {/* Days Counter with Streak Flame */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <motion.span
            className="text-4xl font-semibold tracking-tight"
            key={days}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {days}
          </motion.span>
          {days >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Flame className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
            </motion.div>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {days === 1 ? "day" : "days"} of focus
        </div>
      </div>

      {/* Enhanced Milestone Card */}
      <motion.div
        className="w-52 py-4 px-6 bg-secondary/50 backdrop-blur-sm rounded-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          boxShadow: "0 4px 16px -4px hsl(var(--foreground) / 0.08)",
        }}
      >
        {daysToNext > 0 ? (
          <>
            <div className="text-center mb-3">
              <div className="text-2xl font-semibold">{daysToNext}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {daysToNext === 1 ? "day" : "days"} to {milestone.label}
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(var(--foreground) / 0.6), hsl(var(--foreground)))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <motion.div
              className="text-xl font-semibold mb-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Full Growth Achieved
            </motion.div>
            <div className="text-xs text-muted-foreground">Keep going strong!</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GrowingTree;
