import { motion } from "framer-motion";
import { Shield, ShieldOff, Pause, Play } from "lucide-react";

interface BlockToggleProps {
  enabled: boolean;
  isPaused: boolean;
  onToggle: (enabled: boolean) => void;
  onPause: (paused: boolean) => void;
}

const BlockToggle = ({ enabled, isPaused, onToggle, onPause }: BlockToggleProps) => {
  const handlePauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPause(!isPaused);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={() => onToggle(!enabled)}
        className="flex flex-col items-center gap-4 focus:outline-none group"
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: enabled && !isPaused
                ? [
                    "0 0 0 0 hsl(var(--foreground) / 0)",
                    "0 0 0 12px hsl(var(--foreground) / 0.05)",
                    "0 0 0 0 hsl(var(--foreground) / 0)",
                  ]
                : "0 0 0 0 hsl(var(--foreground) / 0)",
            }}
            transition={{
              duration: 2,
              repeat: enabled && !isPaused ? Infinity : 0,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className={`relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-500 ${
              enabled && !isPaused
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
            animate={{
              scale: enabled && !isPaused ? 1 : 0.95,
              opacity: isPaused ? 0.6 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              boxShadow: enabled && !isPaused
                ? "0 8px 32px -8px hsl(var(--foreground) / 0.3)"
                : "0 4px 16px -4px hsl(var(--foreground) / 0.1)",
            }}
          >
            <motion.div
              animate={{ rotate: enabled && !isPaused ? 0 : -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {enabled ? (
                <Shield className="w-14 h-14" strokeWidth={1.5} />
              ) : (
                <ShieldOff className="w-14 h-14" strokeWidth={1.5} />
              )}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="text-center"
          initial={false}
          animate={{ opacity: 1 }}
        >
          <motion.span
            key={isPaused ? "paused" : enabled ? "active" : "off"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground tracking-wide font-medium"
          >
            {isPaused ? "Paused" : enabled ? "Protection Active" : "Tap to Enable"}
          </motion.span>
        </motion.div>
      </motion.button>

      {enabled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handlePauseClick}
          className="flex items-center gap-2 py-2 px-4 bg-secondary/80 hover:bg-secondary rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Pause</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default BlockToggle;
