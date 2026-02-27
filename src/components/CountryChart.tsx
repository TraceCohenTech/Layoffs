import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
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
      className="glass rounded-xl border border-slate-200/80 p-6"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Top Countries</h2>
      <p className="text-sm text-slate-500 mb-6">By total employees laid off</p>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
              tickLine={false}
              axisLine={{ stroke: AXIS_LINE_STROKE }}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <YAxis
              type="category"
              dataKey="country"
              tick={{ fill: '#334155', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value: number) => [value.toLocaleString(), 'Laid Off']}
              labelStyle={TOOLTIP_LABEL_STYLE}
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
