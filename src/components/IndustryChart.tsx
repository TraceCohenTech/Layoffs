import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
import type { IndustryData, LayoffEntry } from '../types';

interface IndustryChartProps {
  data: IndustryData[];
  totalLaidOff: number;
  companies?: LayoffEntry[];
}

interface CompanyIndustryData {
  company: string;
  totalLaidOff: number;
}

export function IndustryChart({ data, totalLaidOff, companies }: IndustryChartProps) {
  const [ref, inView] = useInView();
  const [drillIndustry, setDrillIndustry] = useState<string | null>(null);

  const topPct = data.length > 0 && totalLaidOff > 0
    ? Math.round((data[0].totalLaidOff / totalLaidOff) * 100)
    : 0;

  // Compute drill-down data for selected industry
  const drillData: CompanyIndustryData[] = (() => {
    if (!drillIndustry || !companies) return [];
    const map = new Map<string, number>();
    for (const c of companies) {
      if (c.industry === drillIndustry && c.laidOff) {
        map.set(c.company, (map.get(c.company) ?? 0) + c.laidOff);
      }
    }
    return Array.from(map.entries())
      .map(([company, totalLaidOff]) => ({ company, totalLaidOff }))
      .sort((a, b) => b.totalLaidOff - a.totalLaidOff)
      .slice(0, 12);
  })();

  const handleBarClick = (entry: IndustryData) => {
    if (companies) setDrillIndustry(entry.industry);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6"
    >
      <AnimatePresence mode="wait">
        {drillIndustry && drillData.length > 0 ? (
          <motion.div
            key="drill"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => setDrillIndustry(null)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Industries
              </button>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">{drillIndustry}</h2>
            <p className="text-sm text-slate-500 mb-6">Top companies by layoffs in this sector</p>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drillData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
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
                    dataKey="company"
                    tick={{ fill: '#334155', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value: number) => [value.toLocaleString(), 'Laid Off']}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                  />
                  <Bar dataKey="totalLaidOff" radius={[0, 6, 6, 0]} animationDuration={800}>
                    {drillData.map((_, index) => (
                      <Cell
                        key={index}
                        fill="#059669"
                        fillOpacity={1 - (index / drillData.length) * 0.6}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Top Industries</h2>
            <p className="text-sm text-slate-500 mb-6">
              By total employees laid off
              {companies && <span className="text-slate-400"> — click a bar to drill down</span>}
            </p>

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
                    dataKey="industry"
                    tick={{ fill: '#334155', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value: number) => [value.toLocaleString(), 'Laid Off']}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                  />
                  <Bar
                    dataKey="totalLaidOff"
                    radius={[0, 6, 6, 0]}
                    animationDuration={1200}
                    cursor={companies ? 'pointer' : undefined}
                    onClick={(_: unknown, index: number) => {
                      if (data[index]) handleBarClick(data[index]);
                    }}
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={index}
                        fill="#2563eb"
                        fillOpacity={1 - (index / data.length) * 0.7}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {data.length > 0 && topPct > 0 && (
              <div className="chart-insight">
                <strong>{data[0].industry}</strong> alone accounts for {topPct}% of all layoffs
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
