import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import type { MonthlyData } from '../types';

interface TimelineChartProps {
  data: MonthlyData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-700/50 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-100 mb-1">Monthly Layoff Volume</h2>
      <p className="text-sm text-slate-400 mb-6">Total employees laid off per month (2020-2026)</p>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={Math.max(0, Math.floor(data.length / 12))}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '13px',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Laid Off']}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area
              type="monotone"
              dataKey="totalLaidOff"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#areaGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
