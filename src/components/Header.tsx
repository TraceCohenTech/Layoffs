import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

interface HeaderProps {
  totalLaidOff: number;
  totalCompanies: number;
  dateRange: string;
}

export function Header({ totalLaidOff, totalCompanies, dateRange }: HeaderProps) {
  const animatedTotal = useCountUp({ end: totalLaidOff, duration: 2500 });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8 pt-8 pb-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
        Layoffs Tracker
      </p>

      <div className="flex items-baseline gap-4 flex-wrap">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 tabular-nums"
        >
          {animatedTotal.toLocaleString()}
        </motion.p>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl font-medium text-slate-400"
        >
          workers laid off
        </motion.span>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-sm text-slate-500 mt-3"
      >
        Across {totalCompanies.toLocaleString()} events{dateRange ? ` | ${dateRange}` : ''} | Tech & adjacent industries
      </motion.p>
    </motion.div>
  );
}
