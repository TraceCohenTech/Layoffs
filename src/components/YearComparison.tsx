import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
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
      className="glass rounded-xl border border-slate-200/80 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Year-over-Year Comparison</h2>
      <p className="text-sm text-slate-500 mb-6">Total layoffs and companies affected by year</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Laid off chart */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3">Total Employees Laid Off</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                  tickLine={false}
                  axisLine={{ stroke: AXIS_LINE_STROKE }}
                />
                <YAxis
                  tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => formatNumber(v)}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number) => [value.toLocaleString(), 'Laid Off']}
                  labelStyle={TOOLTIP_LABEL_STYLE}
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
          <h3 className="text-sm font-medium text-slate-700 mb-3">Companies with Layoffs</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                  tickLine={false}
                  axisLine={{ stroke: AXIS_LINE_STROKE }}
                />
                <YAxis
                  tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number) => [value.toLocaleString(), 'Companies']}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                />
                <Bar dataKey="companies" radius={[4, 4, 0, 0]} animationDuration={1200}>
                  {data.map((d) => (
                    <Cell key={d.year} fill={YEAR_COLORS[d.year] || '#06b6d4'} fillOpacity={0.85} />
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
