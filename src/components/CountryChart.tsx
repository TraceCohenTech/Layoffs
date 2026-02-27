import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
import type { CountryData } from '../types';

interface CountryChartProps {
  data: CountryData[];
  totalLaidOff: number;
}

export function CountryChart({ data, totalLaidOff }: CountryChartProps) {
  const [ref, inView] = useInView();

  const topPct = data.length > 0 && totalLaidOff > 0
    ? Math.round((data[0].totalLaidOff / totalLaidOff) * 100)
    : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6"
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
            <Bar dataKey="totalLaidOff" radius={[0, 6, 6, 0]} animationDuration={1200}>
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill="#0891b2"
                  fillOpacity={1 - (index / data.length) * 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.length > 0 && topPct > 0 && (
        <div className="chart-insight">
          <strong>{data[0].country}</strong> alone accounts for {topPct}% of all layoffs
        </div>
      )}
    </motion.div>
  );
}
