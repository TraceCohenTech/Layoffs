import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import type { CountryData } from '../types';

const COLORS = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#f97316', '#f43f5e', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16', '#6366f1', '#a855f7'];

interface CountryChartProps {
  data: CountryData[];
}

export function CountryChart({ data }: CountryChartProps) {
  const [ref, inView] = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-700/50 p-6"
    >
      <h2 className="text-lg font-semibold text-slate-100 mb-1">Top Countries</h2>
      <p className="text-sm text-slate-400 mb-6">By total employees laid off</p>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
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
              dataKey="country"
              tick={{ fill: '#cbd5e1', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={110}
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
            <Bar dataKey="totalLaidOff" radius={[0, 4, 4, 0]} animationDuration={1200}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
