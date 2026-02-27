import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import type { LayoffEntry } from '../types';

const COLORS = ['#f43f5e', '#f97316', '#f59e0b', '#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16', '#6366f1', '#a855f7', '#ef4444', '#22c55e', '#0ea5e9'];

interface TopCompaniesProps {
  data: LayoffEntry[];
}

export function TopCompanies({ data }: TopCompaniesProps) {
  const [ref, inView] = useInView();

  const chartData = data.map(d => ({
    name: d.company,
    laidOff: d.laidOff ?? 0,
    date: d.date,
    industry: d.industry,
  }));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass rounded-xl border border-slate-700/50 p-6"
    >
      <h2 className="text-lg font-semibold text-slate-100 mb-1">Largest Layoffs</h2>
      <p className="text-sm text-slate-400 mb-6">Top 15 single layoff events by headcount</p>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={90}
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
            <Bar dataKey="laidOff" radius={[0, 4, 4, 0]} animationDuration={1200}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
