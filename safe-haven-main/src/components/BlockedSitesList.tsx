import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlockedSitesListProps {
  sites: string[];
  onAdd: (site: string) => void;
  onRemove: (site: string) => void;
}

const BlockedSitesList = ({ sites, onAdd, onRemove }: BlockedSitesListProps) => {
  const [newSite, setNewSite] = useState("");

  const handleAdd = () => {
    if (newSite.trim()) {
      onAdd(newSite.trim().toLowerCase());
      setNewSite("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        className="flex gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add website..."
          className="flex-1 h-12 bg-secondary border-0 rounded-xl placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-shadow"
        />
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAdd}
            size="icon"
            className="h-12 w-12 rounded-xl bg-foreground hover:bg-foreground/90 text-background"
          >
            <Plus className="w-5 h-5" strokeWidth={1.5} />
          </Button>
        </motion.div>
      </motion.div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sites.map((site, index) => (
            <motion.div
              key={site}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
                layout: { type: "spring", stiffness: 500, damping: 30 },
              }}
              className="flex items-center justify-between py-3.5 px-4 bg-secondary/80 backdrop-blur-sm rounded-xl group hover:bg-secondary transition-colors"
              style={{
                boxShadow: "0 2px 8px -2px hsl(var(--foreground) / 0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">{site}</span>
              </div>
              <motion.button
                onClick={() => onRemove(site)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-background rounded-lg"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {sites.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <p className="text-muted-foreground text-sm">No sites blocked yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Add websites to block above</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlockedSitesList;
