import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
import { SECTOR_COLORS } from '../data/financials';
import type { CompanyHistory } from '../types';

interface HistoricalHeadcountProps {
  data: CompanyHistory[];
}

const INSIGHTS: Record<string, string> = {
  'NVIDIA': 'NVIDIA quadrupled headcount from 10K to 42K in under a decade — fueled by the AI boom',
  'Meta': 'Meta surged to 86K in 2022, then shed 22% in the "Year of Efficiency" before stabilizing',
  'Alphabet': 'Google nearly tripled headcount from 72K to 190K, then froze hiring post-2022 layoffs',
  'Amazon': 'Amazon\'s pandemic hiring spree peaked at 1.6M — then came the largest tech layoff in history',
  'Anthropic': 'Anthropic grew 24x in 4 years — from 50 employees to 1,200 as AI safety scaled up',
  'OpenAI': 'OpenAI expanded 17x since 2020, from 200 to 3,400 as ChatGPT transformed the company',
  'Intel': 'Intel\'s workforce peaked at 131K in 2022, then shed 36K+ jobs amid its worst financial crisis since 1986',
  'Microsoft': 'Microsoft grew 100% from 2016 to 2022, then held steady at 228K through the efficiency era',
};

export function HistoricalHeadcount({ data }: HistoricalHeadcountProps) {
  const [ref, inView] = useInView();
  const [selectedCompany, setSelectedCompany] = useState(data[0]?.company ?? '');

  const selected = data.find(d => d.company === selectedCompany);
  if (!selected) return null;

  const chartData = selected.headcount.map(h => ({
    year: h.year.toString(),
    count: h.count,
    yoy: h.yoyChangePercent ?? 0,
  }));

  const color = SECTOR_COLORS[selected.sector] ?? '#2563eb';
  const insight = INSIGHTS[selected.company] ?? `${selected.company} headcount trend over time`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Historical Headcount</h2>
      <p className="text-sm text-slate-500 mb-4">Multi-year employee count with year-over-year growth</p>

      {/* Company selector tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {data.map(d => (
          <button
            key={d.company}
            onClick={() => setSelectedCompany(d.company)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              selectedCompany === d.company
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {d.company}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCompany}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Chart */}
          <div className="h-[340px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                  tickLine={false}
                  axisLine={{ stroke: AXIS_LINE_STROKE }}
                />
                <YAxis
                  yAxisId="count"
                  tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => formatNumber(v)}
                />
                <YAxis
                  yAxisId="yoy"
                  orientation="right"
                  tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                  formatter={(value: number, name: string) => {
                    if (name === 'count') return [value.toLocaleString(), 'Employees'];
                    return [`${value}%`, 'YoY Change'];
                  }}
                />
                <Bar
                  yAxisId="count"
                  dataKey="count"
                  fill={color}
                  fillOpacity={0.8}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200}
                />
                <Line
                  yAxisId="yoy"
                  dataKey="yoy"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ fill: '#f59e0b', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  animationDuration={1500}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Year</th>
                  <th className="text-right py-2 px-3 text-slate-500 font-medium">Headcount</th>
                  <th className="text-right py-2 px-3 text-slate-500 font-medium">YoY %</th>
                </tr>
              </thead>
              <tbody>
                {selected.headcount.map(h => (
                  <tr key={h.year} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-1.5 px-3 text-slate-800 font-medium tabular-nums">{h.year}</td>
                    <td className="py-1.5 px-3 text-right text-slate-700 tabular-nums">{h.count.toLocaleString()}</td>
                    <td className="py-1.5 px-3 text-right tabular-nums">
                      {h.yoyChangePercent !== undefined ? (
                        <span className={h.yoyChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {h.yoyChangePercent >= 0 ? '+' : ''}{h.yoyChangePercent}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="chart-insight">{insight}</div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
