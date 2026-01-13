import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface KeywordBlockerProps {
  keywords: string[];
  onAdd: (keyword: string) => void;
  onRemove: (keyword: string) => void;
}

const KeywordBlocker = ({ keywords, onAdd, onRemove }: KeywordBlockerProps) => {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAdd = () => {
    if (newKeyword.trim()) {
      onAdd(newKeyword.trim().toLowerCase());
      setNewKeyword("");
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
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add keyword..."
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

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {keywords.map((keyword, index) => (
            <motion.div
              key={keyword}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.2,
                delay: index * 0.03,
                layout: { type: "spring", stiffness: 500, damping: 30 },
              }}
              className="flex items-center gap-2 py-2 px-4 bg-secondary/80 backdrop-blur-sm rounded-full group hover:bg-secondary transition-colors"
              style={{
                boxShadow: "0 2px 8px -2px hsl(var(--foreground) / 0.05)",
              }}
            >
              <Hash className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
              <span className="text-sm font-medium">{keyword}</span>
              <motion.button
                onClick={() => onRemove(keyword)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {keywords.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Hash className="w-7 h-7 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <p className="text-muted-foreground text-sm">No keywords blocked yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Add keywords to filter above</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default KeywordBlocker;
