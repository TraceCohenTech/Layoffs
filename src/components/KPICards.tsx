import { motion } from 'framer-motion';
import { Users, Building2, TrendingDown, AlertTriangle, Factory, Calendar } from 'lucide-react';
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
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-slate-100 tabular-nums">
        {prefix}{formatNumber(animated)}{suffix}
      </p>
      {detail && <p className="text-xs text-slate-500 mt-1">{detail}</p>}
    </motion.div>
  );
}

interface KPICardsProps {
  kpis: KPIData;
}

export function KPICards({ kpis }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <KPICard
        label="Total Laid Off"
        value={kpis.totalLaidOff}
        icon={<Users className="w-4 h-4 text-rose-400" />}
        color="bg-rose-500/10"
        detail="Workers affected"
        delay={0}
      />
      <KPICard
        label="Companies"
        value={kpis.totalCompanies}
        icon={<Building2 className="w-4 h-4 text-blue-400" />}
        color="bg-blue-500/10"
        detail="Layoff events"
        delay={1}
      />
      <KPICard
        label="Average Size"
        value={kpis.averageSize}
        icon={<TrendingDown className="w-4 h-4 text-amber-400" />}
        color="bg-amber-500/10"
        detail="Per layoff event"
        delay={2}
      />
      <KPICard
        label="Largest Single"
        value={kpis.largestLayoff}
        icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}
        color="bg-orange-500/10"
        detail={kpis.largestCompany}
        delay={3}
      />
      <KPICard
        label="Top Industry"
        value={kpis.topIndustryCount}
        suffix=" events"
        icon={<Factory className="w-4 h-4 text-emerald-400" />}
        color="bg-emerald-500/10"
        detail={kpis.topIndustry}
        delay={4}
      />
      <KPICard
        label="Date Range"
        value={0}
        icon={<Calendar className="w-4 h-4 text-cyan-400" />}
        color="bg-cyan-500/10"
        detail={kpis.dateRange}
        delay={5}
      />
    </div>
  );
}
