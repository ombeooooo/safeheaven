import { motion } from "framer-motion";
import { Shield, TrendingUp, Award } from "lucide-react";

interface StatisticsProps {
  totalBlocksPrevented: number;
  longestStreak: number;
  currentStreak: number;
}

const Statistics = ({ totalBlocksPrevented, longestStreak, currentStreak }: StatisticsProps) => {
  const stats = [
    {
      icon: Shield,
      label: "Blocks Prevented",
      value: totalBlocksPrevented,
      color: "text-foreground",
    },
    {
      icon: Award,
      label: "Best Streak",
      value: longestStreak,
      suffix: longestStreak === 1 ? " day" : " days",
      color: "text-foreground",
    },
    {
      icon: TrendingUp,
      label: "Current Streak",
      value: currentStreak,
      suffix: currentStreak === 1 ? " day" : " days",
      color: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex flex-col items-center py-6 px-4 bg-secondary/50 backdrop-blur-sm rounded-2xl"
          style={{
            boxShadow: "0 2px 12px -4px hsl(var(--foreground) / 0.06)",
          }}
        >
          <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center mb-3">
            <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
          </div>
          <motion.div
            className="text-2xl font-semibold mb-1"
            key={stat.value}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {stat.value}
            {stat.suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.suffix}</span>}
          </motion.div>
          <div className="text-xs text-muted-foreground text-center">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default Statistics;
