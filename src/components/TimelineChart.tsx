import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, ReferenceLine, ReferenceDot } from 'recharts';
import { useInView } from '../hooks/useInView';
import { formatNumber, getPeakMonth } from '../utils/calculations';
import { TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, GRID_STROKE, AXIS_TICK_FILL, AXIS_LINE_STROKE, AXIS_FONT_SIZE } from '../utils/chartTheme';
import type { MonthlyData } from '../types';

const PHASES = [
  {
    id: 'correction',
    label: 'The Correction',
    yearStart: 2022,
    yearEnd: 2023,
    color: '#dc2626',
    description: 'Post-pandemic over-hiring reversal',
  },
  {
    id: 'transition',
    label: 'The Transition',
    yearStart: 2024,
    yearEnd: 2024,
    color: '#d97706',
    description: 'Shift to strategic restructuring',
  },
  {
    id: 'ai',
    label: 'The AI Restructuring',
    yearStart: 2025,
    yearEnd: 2026,
    color: '#7c3aed',
    description: 'AI-driven headcount replacement',
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

  const peak = useMemo(() => getPeakMonth(data), [data]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Monthly Layoff Volume</h2>
      <p className="text-sm text-slate-500 mb-4">Total employees laid off per month with market phase annotations</p>

      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {phaseBounds.map(phase => (
              <ReferenceArea
                key={phase.id}
                x1={phase.startMonth!}
                x2={phase.endMonth!}
                fill={phase.color}
                fillOpacity={0.05}
                stroke={phase.color}
                strokeOpacity={0.12}
                strokeDasharray="4 4"
                label={{
                  value: phase.label,
                  position: 'insideTop',
                  fill: phase.color,
                  fontSize: 11,
                  fontWeight: 600,
                  opacity: 0.6,
                }}
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

            {peak && (
              <ReferenceDot
                x={peak.month}
                y={peak.totalLaidOff}
                r={5}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth={2}
              />
            )}

            <Area
              type="monotone"
              dataKey="totalLaidOff"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Compact phase legend strip */}
      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-100">
        {phaseBounds.map(phase => (
          <div key={phase.id} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: phase.color }} />
            <span className="font-semibold text-slate-700">{phase.label}</span>
            <span className="text-slate-400">
              {phase.yearStart}{phase.yearEnd !== phase.yearStart ? `–${phase.yearEnd}` : ''} · {formatNumber(phase.totalLaidOff)} laid off · {phase.totalCompanies.toLocaleString()} events
            </span>
          </div>
        ))}
      </div>

      {/* Chart insight callout */}
      {peak && (
        <div className="chart-insight">
          <strong>Peak:</strong> {formatNumber(peak.totalLaidOff)} laid off in {peak.month}
        </div>
      )}
    </motion.div>
  );
}
