import { motion } from "framer-motion";
import { Shield, ShieldOff } from "lucide-react";

interface BlockToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const BlockToggle = ({ enabled, onToggle }: BlockToggleProps) => {
  return (
    <motion.button
      onClick={() => onToggle(!enabled)}
      className="flex flex-col items-center gap-4 focus:outline-none group"
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: enabled
              ? [
                  "0 0 0 0 hsl(var(--foreground) / 0)",
                  "0 0 0 12px hsl(var(--foreground) / 0.05)",
                  "0 0 0 0 hsl(var(--foreground) / 0)",
                ]
              : "0 0 0 0 hsl(var(--foreground) / 0)",
          }}
          transition={{
            duration: 2,
            repeat: enabled ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
        
        {/* Main shield container */}
        <motion.div
          className={`relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-500 ${
            enabled
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
          animate={{
            scale: enabled ? 1 : 0.95,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            boxShadow: enabled
              ? "0 8px 32px -8px hsl(var(--foreground) / 0.3)"
              : "0 4px 16px -4px hsl(var(--foreground) / 0.1)",
          }}
        >
          <motion.div
            animate={{ rotate: enabled ? 0 : -10 }}
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

      {/* Status text */}
      <motion.div
        className="text-center"
        initial={false}
        animate={{ opacity: 1 }}
      >
        <motion.span
          key={enabled ? "active" : "off"}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground tracking-wide font-medium"
        >
          {enabled ? "Protection Active" : "Tap to Enable"}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

export default BlockToggle;
