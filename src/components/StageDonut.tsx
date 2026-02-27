import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useInView } from '../hooks/useInView';
import { TOOLTIP_STYLE } from '../utils/chartTheme';
import type { StageData } from '../types';

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16', '#6366f1', '#a855f7', '#ef4444', '#22c55e'];

interface StageDonutProps {
  data: StageData[];
}

export function StageDonut({ data }: StageDonutProps) {
  const [ref, inView] = useInView();

  const threshold = data.reduce((s, d) => s + d.count, 0) * 0.02;
  const significant = data.filter(d => d.count >= threshold);
  const other = data.filter(d => d.count < threshold);
  const chartData = other.length > 0
    ? [...significant, { stage: 'Other', count: other.reduce((s, d) => s + d.count, 0), totalLaidOff: other.reduce((s, d) => s + d.totalLaidOff, 0) }]
    : significant;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass rounded-xl border border-slate-200/80 p-6"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">By Funding Stage</h2>
      <p className="text-sm text-slate-500 mb-6">Layoff events by company stage</p>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={105}
              dataKey="count"
              nameKey="stage"
              paddingAngle={2}
              animationDuration={1200}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value: number) => [`${value} events`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {chartData.map((d, i) => (
          <div key={d.stage} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-slate-600">{d.stage}</span>
            <span className="text-slate-400">({d.count})</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
