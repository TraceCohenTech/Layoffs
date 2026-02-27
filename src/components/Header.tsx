import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

interface HeaderProps {
  totalLaidOff: number;
  totalCompanies: number;
}

export function Header({ totalLaidOff, totalCompanies }: HeaderProps) {
  const animatedTotal = useCountUp({ end: totalLaidOff, duration: 2500 });
  const animatedCompanies = useCountUp({ end: totalCompanies, duration: 2000, delay: 300 });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl mb-8 p-8 lg:p-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-white/80 to-rose-500/5 animate-gradient-x" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_50%)]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="p-3 bg-blue-500/10 rounded-xl border border-blue-400/20"
          >
            <TrendingDown className="w-8 h-8 text-blue-600" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Layoffs Tracker
            </h1>
            <p className="text-slate-500 text-sm md:text-base mt-1">
              Tech industry workforce reductions since 2022
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 mt-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total Laid Off</p>
            <p className="text-2xl md:text-4xl font-bold text-rose-500 tabular-nums">
              {animatedTotal.toLocaleString()}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Companies Affected</p>
            <p className="text-2xl md:text-4xl font-bold text-blue-600 tabular-nums">
              {animatedCompanies.toLocaleString()}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
