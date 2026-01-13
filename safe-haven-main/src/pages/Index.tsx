import { useState } from "react";
import { motion } from "framer-motion";
import BlockToggle from "@/components/BlockToggle";
import BlockedSitesList from "@/components/BlockedSitesList";
import KeywordBlocker from "@/components/KeywordBlocker";
import GrowingTree from "@/components/GrowingTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [enabled, setEnabled] = useState(true);
  const [days] = useState(12);
  const [blockedSites, setBlockedSites] = useState<string[]>([
    "example-adult-site.com",
    "blocked-content.net",
  ]);
  const [blockedKeywords, setBlockedKeywords] = useState<string[]>([
    "adult",
    "xxx",
    "nsfw",
  ]);

  const handleAddSite = (site: string) => {
    if (!blockedSites.includes(site)) {
      setBlockedSites([...blockedSites, site]);
    }
  };

  const handleRemoveSite = (site: string) => {
    setBlockedSites(blockedSites.filter((s) => s !== site));
  };

  const handleAddKeyword = (keyword: string) => {
    if (!blockedKeywords.includes(keyword)) {
      setBlockedKeywords([...blockedKeywords, keyword]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setBlockedKeywords(blockedKeywords.filter((k) => k !== keyword));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        className="py-8 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Shield
        </h1>
        <p className="text-center text-sm text-muted-foreground mt-1">
          Stay focused, stay protected
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        {/* Dashboard Card */}
        <motion.section
          className="w-full max-w-2xl py-10 px-6 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "linear-gradient(180deg, hsl(var(--secondary) / 0.5), hsl(var(--background)))",
            boxShadow: "0 4px 24px -8px hsl(var(--foreground) / 0.08)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            {/* Toggle */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BlockToggle enabled={enabled} onToggle={setEnabled} />
            </motion.div>

            {/* Divider */}
            <div className="hidden md:block w-px h-48 bg-border/50" />
            <div className="md:hidden w-20 h-px bg-border/50" />

            {/* Growing Tree */}
            <div className="flex-shrink-0">
              <GrowingTree days={days} maxDays={30} />
            </div>
          </div>
        </motion.section>

        {/* Divider */}
        <motion.div
          className="w-12 h-px bg-border my-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        {/* Tabs Section */}
        <motion.section
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="sites" className="w-full">
            <TabsList className="w-full bg-secondary/80 backdrop-blur-sm rounded-2xl p-1.5 h-auto mb-8">
              <TabsTrigger
                value="sites"
                className="flex-1 rounded-xl py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Blocked Sites
              </TabsTrigger>
              <TabsTrigger
                value="keywords"
                className="flex-1 rounded-xl py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Keywords
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sites" className="mt-0">
              <BlockedSitesList
                sites={blockedSites}
                onAdd={handleAddSite}
                onRemove={handleRemoveSite}
              />
            </TabsContent>

            <TabsContent value="keywords" className="mt-0">
              <KeywordBlocker
                keywords={blockedKeywords}
                onAdd={handleAddKeyword}
                onRemove={handleRemoveKeyword}
              />
            </TabsContent>
          </Tabs>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        className="py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-xs text-muted-foreground">
          Protecting your focus, one day at a time
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
