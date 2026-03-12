import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, ChevronDown, ChevronUp, Activity, ShieldCheck } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import type { StockImpactResult } from '../services/finnhub';

interface StockImpactProps {
  data: StockImpactResult[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

function formatPct(val: number): string {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

function formatPrice(val: number): string {
  return `$${val.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('/');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[0], 10) - 1]} ${parseInt(parts[1], 10)}, ${parts[2]}`;
}

function SummaryCard({
  label,
  value,
  suffix,
  icon: Icon,
  iconColor,
  positive,
  delay: d,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: typeof Activity;
  iconColor: string;
  positive: boolean;
  delay: number;
}) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: d * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass rounded-xl border border-slate-200/60 p-5 transition-all duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}12` }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
      </div>
      <p className={`text-2xl md:text-3xl font-bold tabular-nums ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {value}{suffix && <span className="text-lg font-semibold ml-0.5">{suffix}</span>}
      </p>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-xl border border-slate-200/60 p-5 animate-pulse">
      <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
      <div className="h-8 w-20 bg-slate-200 rounded mb-3" />
      <div className="h-3 w-32 bg-slate-200 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="glass rounded-xl border border-slate-200/60 p-6 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-64 bg-slate-200 rounded mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function SparklineChart({ data, positive }: { data: { date: string; close: number }[]; positive: boolean }) {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line
            type="monotone"
            dataKey="close"
            stroke={positive ? '#059669' : '#e11d48'}
            strokeWidth={1.5}
            dot={false}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ImpactRow({ item, index }: { item: StockImpactResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const is30Positive = item.change30Days >= 0;
  const is7Positive = item.change7Days >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left hover:bg-slate-50/80 transition-colors rounded-lg"
      >
        <div className="grid grid-cols-12 gap-2 items-center px-4 py-3">
          {/* Company + Ticker */}
          <div className="col-span-3 md:col-span-3">
            <p className="text-sm font-semibold text-slate-900 truncate">{item.companyName}</p>
            <p className="text-xs text-slate-500 font-mono">{item.symbol}</p>
          </div>

          {/* Layoff Date + Count */}
          <div className="col-span-3 md:col-span-2">
            <p className="text-xs text-slate-600">{formatDate(item.layoffDate)}</p>
            <p className="text-xs text-slate-500">{item.laidOff.toLocaleString()} laid off</p>
          </div>

          {/* Price on Day */}
          <div className="col-span-2 md:col-span-2 text-right">
            <p className="text-sm font-medium text-slate-800 tabular-nums">{formatPrice(item.priceOnDay)}</p>
          </div>

          {/* 7-Day Change */}
          <div className="col-span-2 md:col-span-2 text-right">
            <span className={`inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${is7Positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {is7Positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPct(item.change7Days)}
            </span>
          </div>

          {/* 30-Day Change */}
          <div className="col-span-1 md:col-span-2 text-right">
            <span className={`inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${is30Positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {is30Positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPct(item.change30Days)}
            </span>
          </div>

          {/* Expand */}
          <div className="col-span-1 flex justify-end">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2 font-medium">
                  Price movement: 5 days before to 30 days after layoff
                </p>
                <SparklineChart data={item.dailyPrices} positive={is30Positive} />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>{item.dailyPrices.length > 0 ? item.dailyPrices[0].date : ''}</span>
                  <span>{item.dailyPrices.length > 0 ? item.dailyPrices[item.dailyPrices.length - 1].date : ''}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function StockImpact({ data, loading, error, onRetry }: StockImpactProps) {
  const [ref, inView] = useInView();

  if (loading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonTable />
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl border border-slate-200/60 p-8 mb-8 text-center"
      >
        <p className="text-slate-600 font-medium mb-3">
          {error ? 'Unable to load stock impact data' : 'No stock impact data available'}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </motion.div>
    );
  }

  // Summary stats
  const avg7Day = data.reduce((sum, d) => sum + d.change7Days, 0) / data.length;
  const avg30Day = data.reduce((sum, d) => sum + d.change30Days, 0) / data.length;
  const recoveredCount = data.filter(d => d.change30Days > 0).length;

  return (
    <div className="mb-8">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          label="Average 7-Day Impact"
          value={formatPct(avg7Day)}
          icon={TrendingDown}
          iconColor={avg7Day >= 0 ? '#059669' : '#e11d48'}
          positive={avg7Day >= 0}
          delay={0}
        />
        <SummaryCard
          label="Average 30-Day Impact"
          value={formatPct(avg30Day)}
          icon={BarChart3}
          iconColor={avg30Day >= 0 ? '#059669' : '#e11d48'}
          positive={avg30Day >= 0}
          delay={1}
        />
        <SummaryCard
          label="Recovered in 30 Days"
          value={`${recoveredCount}`}
          suffix={` / ${data.length}`}
          icon={ShieldCheck}
          iconColor="#059669"
          positive={recoveredCount > data.length / 2}
          delay={2}
        />
      </div>

      {/* Impact Table */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glass rounded-xl border border-slate-200/60 overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-slate-200/60 bg-slate-50/50">
          <div className="col-span-3 md:col-span-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</span>
          </div>
          <div className="col-span-3 md:col-span-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Layoff</span>
          </div>
          <div className="col-span-2 md:col-span-2 text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</span>
          </div>
          <div className="col-span-2 md:col-span-2 text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">7-Day</span>
          </div>
          <div className="col-span-1 md:col-span-2 text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">30-Day</span>
          </div>
          <div className="col-span-1" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {data.map((item, i) => (
            <ImpactRow key={item.symbol} item={item} index={i} />
          ))}
        </div>

        {/* Insight callout */}
        <div className="chart-insight mx-4 mb-4 mt-4">
          <strong>Insight:</strong> Stock reactions to layoff announcements vary widely. Some companies see rebounds as investors view cost-cutting as a path to profitability, while others continue declining.
        </div>
      </motion.div>
    </div>
  );
}
