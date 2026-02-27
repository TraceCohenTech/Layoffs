import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bot, Zap } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { parseDate, formatNumber } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
import type { LayoffEntry } from '../types';

interface AIInsightsProps {
  data: LayoffEntry[];
}

export function AIInsights({ data }: AIInsightsProps) {
  const [ref, inView] = useInView();

  const aiData = useMemo(() => data.filter(d => d.aiRelated), [data]);

  const byYear = useMemo(() => {
    const map = new Map<number, { year: number; aiLaidOff: number; aiEvents: number }>();
    for (const d of aiData) {
      const date = parseDate(d.date);
      if (isNaN(date.getTime())) continue;
      const year = date.getFullYear();
      if (!map.has(year)) map.set(year, { year, aiLaidOff: 0, aiEvents: 0 });
      const entry = map.get(year)!;
      entry.aiEvents++;
      if (d.laidOff) entry.aiLaidOff += d.laidOff;
    }
    return Array.from(map.values()).sort((a, b) => a.year - b.year);
  }, [aiData]);

  const topAI = useMemo(() => {
    return aiData
      .filter(d => d.laidOff && d.laidOff > 0)
      .sort((a, b) => (b.laidOff ?? 0) - (a.laidOff ?? 0))
      .slice(0, 10);
  }, [aiData]);

  if (aiData.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-cyan-200 p-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-1">
        <Bot className="w-5 h-5 text-cyan-500" />
        <h2 className="text-lg font-semibold text-slate-900">AI-Attributed Layoffs</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6">Layoffs explicitly tied to AI adoption, automation, or AI-driven restructuring</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3">AI-Driven Layoffs by Year</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byYear} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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
                  formatter={(value: number) => [value.toLocaleString(), 'AI Laid Off']}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                />
                <Bar dataKey="aiLaidOff" fill="#06b6d4" fillOpacity={0.85} radius={[4, 4, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3">Largest AI-Attributed Layoffs</h3>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
            {topAI.map((d, i) => (
              <motion.div
                key={`${d.company}-${d.date}-${i}`}
                initial={{ opacity: 0, x: 10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-cyan-300 transition-colors"
              >
                <div className="flex-shrink-0 w-10 text-right">
                  <span className="text-xs font-bold text-cyan-600 tabular-nums">
                    {formatNumber(d.laidOff ?? 0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{d.company}</span>
                    <span className="text-xs text-slate-400">{d.date}</span>
                  </div>
                  {d.division && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span className="text-xs text-slate-500 truncate">{d.division}</span>
                    </div>
                  )}
                </div>
                <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-cyan-50 text-cyan-600 border border-cyan-200 flex-shrink-0 font-medium">
                  AI
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
