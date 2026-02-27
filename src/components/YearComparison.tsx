import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import type { YearData } from '../types';

const YEAR_COLORS: Record<number, string> = {
  2020: '#f43f5e',
  2021: '#f59e0b',
  2022: '#f97316',
  2023: '#3b82f6',
  2024: '#10b981',
  2025: '#06b6d4',
  2026: '#8b5cf6',
};

interface YearComparisonProps {
  data: YearData[];
}

export function YearComparison({ data }: YearComparisonProps) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-700/50 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-100 mb-1">Year-over-Year Comparison</h2>
      <p className="text-sm text-slate-400 mb-6">Total layoffs and companies affected by year</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Laid off chart */}
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3">Total Employees Laid Off</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
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
                <Bar dataKey="totalLaidOff" radius={[4, 4, 0, 0]} animationDuration={1200}>
                  {data.map((d) => (
                    <Cell key={d.year} fill={YEAR_COLORS[d.year] || '#3b82f6'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Companies chart */}
        <div>
          <h3 className="text-sm font-medium text-slate-300 mb-3">Companies with Layoffs</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Companies']}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="companies" radius={[4, 4, 0, 0]} animationDuration={1200}>
                  {data.map((d) => (
                    <Cell key={d.year} fill={YEAR_COLORS[d.year] || '#06b6d4'} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
