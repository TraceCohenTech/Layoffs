import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
import type { MonthlyData } from '../types';

const PHASES = [
  {
    id: 'correction',
    label: 'The Correction',
    yearStart: 2022,
    yearEnd: 2023,
    color: '#f43f5e',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-600',
    description: 'Post-pandemic over-hiring reversal. Companies that doubled headcount during COVID aggressively right-sized.',
  },
  {
    id: 'transition',
    label: 'The Transition',
    yearStart: 2024,
    yearEnd: 2024,
    color: '#f59e0b',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    description: 'Layoffs moderated but rationale shifted from "we over-hired" to "we need to invest differently."',
  },
  {
    id: 'ai',
    label: 'The AI Restructuring',
    yearStart: 2025,
    yearEnd: 2026,
    color: '#06b6d4',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-600',
    description: 'Companies explicitly replace headcount with AI. Budgets move from people to infrastructure.',
  },
];

interface TimelineChartProps {
  data: MonthlyData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const [ref, inView] = useInView();

  const phaseBounds = useMemo(() => {
    return PHASES.map(phase => {
      const startIdx = data.findIndex(d => d.year >= phase.yearStart);
      let endIdx = data.length - 1;
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].year <= phase.yearEnd) { endIdx = i; break; }
      }
      const phaseData = data.filter(d => d.year >= phase.yearStart && d.year <= phase.yearEnd);
      const totalLaidOff = phaseData.reduce((s, d) => s + d.totalLaidOff, 0);
      const totalCompanies = phaseData.reduce((s, d) => s + d.companies, 0);
      return {
        ...phase,
        startMonth: startIdx >= 0 ? data[startIdx].month : null,
        endMonth: endIdx >= 0 ? data[endIdx].month : null,
        totalLaidOff,
        totalCompanies,
      };
    }).filter(p => p.startMonth && p.endMonth);
  }, [data]);

  const boundaryMonths = useMemo(() => {
    const boundaries: Array<{ month: string }> = [];
    const jan2024 = data.find(d => d.year === 2024 && d.monthNum === 0);
    if (jan2024) boundaries.push({ month: jan2024.month });
    const jan2025 = data.find(d => d.year === 2025 && d.monthNum === 0);
    if (jan2025) boundaries.push({ month: jan2025.month });
    return boundaries;
  }, [data]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/80 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Monthly Layoff Volume</h2>
      <p className="text-sm text-slate-500 mb-4">Total employees laid off per month with market phase annotations</p>

      {/* Phase legend cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {phaseBounds.map((phase, i) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`${phase.bg} border ${phase.border} rounded-lg p-3`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: phase.color, opacity: 0.8 }} />
              <span className={`text-xs font-bold ${phase.text}`}>{phase.label}</span>
              <span className="text-[11px] text-slate-400 ml-auto">
                {phase.yearStart}{phase.yearEnd !== phase.yearStart ? `–${phase.yearEnd}` : ''}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">{phase.description}</p>
            <div className="flex gap-3 text-[11px]">
              <span className="text-slate-700 font-semibold">{formatNumber(phase.totalLaidOff)} laid off</span>
              <span className="text-slate-400">{phase.totalCompanies.toLocaleString()} events</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {phaseBounds.map(phase => (
              <ReferenceArea
                key={phase.id}
                x1={phase.startMonth!}
                x2={phase.endMonth!}
                fill={phase.color}
                fillOpacity={0.06}
                stroke={phase.color}
                strokeOpacity={0.15}
                strokeDasharray="4 4"
              />
            ))}

            {boundaryMonths.map((b, i) => (
              <ReferenceLine
                key={i}
                x={b.month}
                stroke="#94a3b8"
                strokeDasharray="6 4"
                strokeWidth={1}
              />
            ))}

            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: AXIS_TICK_FILL, fontSize: AXIS_FONT_SIZE }}
              tickLine={false}
              axisLine={{ stroke: AXIS_LINE_STROKE }}
              interval={Math.max(0, Math.floor(data.length / 12))}
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
            <Area
              type="monotone"
              dataKey="totalLaidOff"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
