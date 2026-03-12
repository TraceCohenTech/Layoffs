import { motion } from 'framer-motion';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, Activity, Briefcase, Users } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
import type { FredDataPoint } from '../services/fred';

interface MacroIndicatorsProps {
  data: FredDataPoint[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

function formatDate(ym: string): string {
  const [year, month] = ym.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

function getYearAgoChange(data: FredDataPoint[], key: keyof FredDataPoint): { current: number; change: number } | null {
  if (data.length < 2) return null;
  const latest = data[data.length - 1];
  const currentVal = latest[key] as number;

  // Find value from ~12 months ago
  const targetIdx = Math.max(0, data.length - 13);
  const yearAgoVal = data[targetIdx][key] as number;

  if (yearAgoVal === 0) return { current: currentVal, change: 0 };
  const change = ((currentVal - yearAgoVal) / yearAgoVal) * 100;
  return { current: currentVal, change: Math.round(change * 10) / 10 };
}

function KPICard({
  label,
  value,
  suffix,
  change,
  icon: Icon,
  iconColor,
  delay,
}: {
  label: string;
  value: string;
  suffix?: string;
  change: number | null;
  icon: typeof Activity;
  iconColor: string;
  delay: number;
}) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass rounded-xl border border-slate-200/60 p-5 transition-all duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}12` }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums">
        {value}{suffix && <span className="text-lg font-semibold text-slate-500 ml-0.5">{suffix}</span>}
      </p>
      {change !== null && (
        <div className="flex items-center gap-1 mt-2">
          {change > 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
          ) : change < 0 ? (
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          ) : null}
          <span className={`text-xs font-semibold ${
            change > 0 ? 'text-rose-600' : change < 0 ? 'text-emerald-600' : 'text-slate-500'
          }`}>
            {change > 0 ? '+' : ''}{change}% vs 1 year ago
          </span>
        </div>
      )}
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

function SkeletonChart() {
  return (
    <div className="glass rounded-xl border border-slate-200/60 p-6 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-64 bg-slate-200 rounded mb-6" />
      <div className="h-[340px] bg-slate-100 rounded-lg" />
    </div>
  );
}

export function MacroIndicators({ data, loading, error, onRetry }: MacroIndicatorsProps) {
  const [ref, inView] = useInView();

  if (loading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonChart />
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
        <p className="text-slate-600 font-medium mb-3">Unable to load macro data</p>
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

  const unemployment = getYearAgoChange(data, 'unemploymentRate');
  const claims = getYearAgoChange(data, 'joblessClaims');
  const openings = getYearAgoChange(data, 'jobOpenings');

  return (
    <div className="mb-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard
          label="Unemployment Rate"
          value={unemployment ? `${unemployment.current.toFixed(1)}` : '--'}
          suffix="%"
          change={unemployment?.change ?? null}
          icon={Users}
          iconColor="#2563eb"
          delay={0}
        />
        <KPICard
          label="Weekly Jobless Claims"
          value={claims ? `${Math.round(claims.current / 1000)}K` : '--'}
          change={claims?.change ?? null}
          icon={Activity}
          iconColor="#dc2626"
          delay={1}
        />
        <KPICard
          label="Job Openings"
          value={openings ? `${(openings.current / 1000).toFixed(1)}M` : '--'}
          change={openings?.change ?? null}
          icon={Briefcase}
          iconColor="#059669"
          delay={2}
        />
      </div>

      {/* Dual-axis chart */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glass rounded-xl border border-slate-200/60 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Labor Market Trends</h3>
        <p className="text-sm text-slate-500 mb-4">Unemployment Rate vs Job Openings since 2020</p>

        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="unemploymentFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                tickLine={false}
                axisLine={{ stroke: AXIS_LINE_STROKE }}
                tickFormatter={(val: string) => {
                  const [y, m] = val.split('-');
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return `${months[parseInt(m, 10) - 1]} '${y.slice(2)}`;
                }}
                interval={Math.max(0, Math.floor(data.length / 8))}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#2563eb', fontSize: AXIS_FONT_SIZE }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
                domain={['auto', 'auto']}
                label={{
                  value: 'Unemployment %',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#2563eb', fontSize: 11, fontWeight: 600 },
                  offset: 10,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#059669', fontSize: AXIS_FONT_SIZE }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}M`}
                domain={['auto', 'auto']}
                label={{
                  value: 'Job Openings',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: '#059669', fontSize: 11, fontWeight: 600 },
                  offset: 10,
                }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                labelFormatter={(label: string) => formatDate(label)}
                formatter={(value: number, name: string) => {
                  if (name === 'Unemployment Rate') return [`${value.toFixed(1)}%`, name];
                  if (name === 'Job Openings') return [`${(value / 1000).toFixed(1)}M`, name];
                  return [value.toLocaleString(), name];
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: 12, fontWeight: 500, color: '#334155' }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="unemploymentRate"
                name="Unemployment Rate"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#unemploymentFill)"
                dot={false}
                animationDuration={1500}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="jobOpenings"
                name="Job Openings"
                stroke="#059669"
                strokeWidth={2.5}
                dot={false}
                animationDuration={1500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insight callout */}
        {data.length > 12 && (
          <div className="chart-insight">
            <strong>Insight:</strong> The labor market context helps explain layoff waves — rising unemployment and falling job openings often coincide with increased layoff activity.
          </div>
        )}
      </motion.div>
    </div>
  );
}
