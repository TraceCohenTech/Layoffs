import { motion } from 'framer-motion';
import { Users, Building2, TrendingDown, AlertTriangle, Factory, Bot } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import type { KPIData } from '../types';

interface KPICardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  detail?: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

function KPICard({ label, value, suffix, prefix, detail, icon, color, delay }: KPICardProps) {
  const [ref, inView] = useInView();
  const animated = useCountUp({ end: value, duration: 2000, delay: delay * 100, enabled: inView });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -3 }}
      className="glass rounded-xl border border-slate-200/80 p-5 hover:border-slate-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums">
        {prefix}{formatNumber(animated)}{suffix}
      </p>
      {detail && <p className="text-xs text-slate-500 mt-1.5">{detail}</p>}
    </motion.div>
  );
}

interface KPICardsProps {
  kpis: KPIData;
  aiStats: { count: number; totalLaidOff: number; percentage: number };
}

export function KPICards({ kpis, aiStats }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <KPICard
        label="Total Laid Off"
        value={kpis.totalLaidOff}
        icon={<Users className="w-4 h-4 text-rose-500" />}
        color="bg-rose-50"
        detail="Workers affected"
        delay={0}
      />
      <KPICard
        label="Companies"
        value={kpis.totalCompanies}
        icon={<Building2 className="w-4 h-4 text-blue-500" />}
        color="bg-blue-50"
        detail="Layoff events"
        delay={1}
      />
      <KPICard
        label="Average Size"
        value={kpis.averageSize}
        icon={<TrendingDown className="w-4 h-4 text-amber-500" />}
        color="bg-amber-50"
        detail="Per layoff event"
        delay={2}
      />
      <KPICard
        label="Largest Single"
        value={kpis.largestLayoff}
        icon={<AlertTriangle className="w-4 h-4 text-orange-500" />}
        color="bg-orange-50"
        detail={kpis.largestCompany}
        delay={3}
      />
      <KPICard
        label="Top Industry"
        value={kpis.topIndustryCount}
        suffix=" events"
        icon={<Factory className="w-4 h-4 text-emerald-500" />}
        color="bg-emerald-50"
        detail={kpis.topIndustry}
        delay={4}
      />
      <KPICard
        label="AI-Attributed"
        value={aiStats.count}
        suffix=" events"
        icon={<Bot className="w-4 h-4 text-cyan-500" />}
        color="bg-cyan-50"
        detail={`${aiStats.percentage}% of all layoffs`}
        delay={5}
      />
    </div>
  );
}
