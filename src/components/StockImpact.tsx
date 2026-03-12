import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, Activity, ShieldCheck } from 'lucide-react';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: d * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass rounded-xl border border-slate-200/60 p-4 transition-all duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}12` }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
      </div>
      <p className={`text-xl md:text-2xl font-bold tabular-nums ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {value}{suffix && <span className="text-lg font-semibold ml-0.5">{suffix}</span>}
      </p>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-xl border border-slate-200/60 p-5 animate-pulse">
      <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
      <div className="h-8 w-20 bg-slate-200 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="glass rounded-xl border border-slate-200/60 p-6 animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ChangeTag({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {formatPct(value)}
    </span>
  );
}

export function StockImpact({ data, loading, error, onRetry }: StockImpactProps) {

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
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
        className="glass rounded-xl border border-slate-200/60 p-6 text-center"
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

  const avgDayOf = data.reduce((s, d) => s + d.changeDayOf, 0) / data.length;
  const avgDayAfter = data.reduce((s, d) => s + d.changeDayAfter, 0) / data.length;
  const droppedCount = data.filter(d => d.changeDayOf < 0).length;

  return (
    <div>
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <SummaryCard
          label="Avg Day-Of Change"
          value={formatPct(avgDayOf)}
          icon={Activity}
          iconColor={avgDayOf >= 0 ? '#059669' : '#e11d48'}
          positive={avgDayOf >= 0}
          delay={0}
        />
        <SummaryCard
          label="Avg Next-Day Change"
          value={formatPct(avgDayAfter)}
          icon={BarChart3}
          iconColor={avgDayAfter >= 0 ? '#059669' : '#e11d48'}
          positive={avgDayAfter >= 0}
          delay={1}
        />
        <SummaryCard
          label="Dropped on News"
          value={`${droppedCount}`}
          suffix={` / ${data.length}`}
          icon={ShieldCheck}
          iconColor="#e11d48"
          positive={droppedCount < data.length / 2}
          delay={2}
        />
      </div>

      {/* Impact Table */}
      <div className="glass rounded-xl border border-slate-200/60 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 items-center px-3 py-2 border-b border-slate-200/60 bg-slate-50/50">
          <div className="col-span-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</span>
          </div>
          <div className="col-span-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Layoff Event</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prior Close</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day Of</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Day</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {data.map((item, i) => (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="grid grid-cols-12 gap-2 items-center px-3 py-2 hover:bg-slate-50/80 transition-colors"
            >
              <div className="col-span-3">
                <p className="text-sm font-semibold text-slate-900 truncate">{item.companyName}</p>
                <p className="text-xs text-slate-500 font-mono">{item.symbol}</p>
              </div>
              <div className="col-span-3">
                <p className="text-xs text-slate-600">{formatDate(item.layoffDate)}</p>
                <p className="text-xs text-slate-500">{item.laidOff.toLocaleString()} laid off</p>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-sm font-medium text-slate-800 tabular-nums">{formatPrice(item.priceBefore)}</p>
              </div>
              <div className="col-span-2 text-right">
                <ChangeTag value={item.changeDayOf} />
              </div>
              <div className="col-span-2 text-right">
                <ChangeTag value={item.changeDayAfter} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="chart-insight mx-3 mb-3 mt-3">
          <strong>Insight:</strong> Markets often react positively to layoffs at large companies, viewing cost-cutting as a path to profitability. The day-after change captures the full market digestion of the news.
        </div>
      </div>
    </div>
  );
}
