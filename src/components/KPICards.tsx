import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
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
  trend?: number | null;
  sparkline?: number[];
  accentColor: string;
  delay: number;
  size?: 'primary' | 'secondary';
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="opacity-40">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendBadge({ value }: { value: number }) {
  const isPositive = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
      isPositive ? 'text-rose-600' : 'text-emerald-600'
    }`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{value}% YoY
    </span>
  );
}

function KPICard({ label, value, suffix, prefix, detail, trend, sparkline, accentColor, delay, size = 'primary' }: KPICardProps) {
  const [ref, inView] = useInView();
  const animated = useCountUp({ end: value, duration: 2000, delay: delay * 100, enabled: inView });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay * 0.08, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass rounded-xl border border-slate-200/60 p-5 transition-all duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
        {sparkline && sparkline.length > 1 && (
          <MiniSparkline data={sparkline} color={accentColor} />
        )}
      </div>
      <p className={`${size === 'primary' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-bold text-slate-900 tabular-nums`}>
        {prefix}{formatNumber(animated)}{suffix}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        {detail && <p className="text-xs text-slate-500">{detail}</p>}
        {trend != null && trend !== 0 && <TrendBadge value={trend} />}
      </div>
    </motion.div>
  );
}

interface KPICardsProps {
  kpis: KPIData;
  aiStats: { count: number; totalLaidOff: number; percentage: number };
  trends: { totalLaidOffChange: number | null; companiesChange: number | null; avgSizeChange: number | null };
  sparkline: number[];
}

export function KPICards({ kpis, aiStats, trends, sparkline }: KPICardsProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Primary 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Laid Off"
          value={kpis.totalLaidOff}
          accentColor="#dc2626"
          detail="Workers affected"
          trend={trends.totalLaidOffChange}
          sparkline={sparkline}
          delay={0}
        />
        <KPICard
          label="Companies"
          value={kpis.totalCompanies}
          accentColor="#2563eb"
          detail="Layoff events"
          trend={trends.companiesChange}
          delay={1}
        />
        <KPICard
          label="Average Size"
          value={kpis.averageSize}
          accentColor="#d97706"
          detail="Per layoff event"
          trend={trends.avgSizeChange}
          delay={2}
        />
        <KPICard
          label="AI-Attributed"
          value={aiStats.count}
          suffix=" events"
          accentColor="#7c3aed"
          detail={`${aiStats.percentage}% of all layoffs`}
          delay={3}
        />
      </div>
      {/* Secondary 2 cards */}
      <div className="grid grid-cols-2 gap-4">
        <KPICard
          label="Largest Single"
          value={kpis.largestLayoff}
          accentColor="#ea580c"
          detail={kpis.largestCompany}
          delay={4}
          size="secondary"
        />
        <KPICard
          label="Top Industry"
          value={kpis.topIndustryCount}
          suffix=" events"
          accentColor="#059669"
          detail={kpis.topIndustry}
          delay={5}
          size="secondary"
        />
      </div>
    </div>
  );
}
