import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import type { LayoffEntry } from '../types';

interface TopCompaniesProps {
  data: LayoffEntry[];
}

export function TopCompanies({ data }: TopCompaniesProps) {
  const [ref, inView] = useInView();

  const chartData = data.map(d => ({
    name: d.company,
    laidOff: d.laidOff ?? 0,
    date: d.date,
    industry: d.industry,
    division: d.division,
    aiRelated: d.aiRelated,
  }));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass rounded-xl border border-slate-200/60 p-6"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Largest Layoffs</h2>
      <p className="text-sm text-slate-500 mb-4">Top 15 single layoff events by headcount</p>

      <div className="space-y-1 max-h-[440px] overflow-y-auto pr-1">
        {chartData.map((d, i) => {
          const maxVal = chartData[0]?.laidOff || 1;
          const width = Math.max((d.laidOff / maxVal) * 100, 4);
          return (
            <motion.div
              key={`${d.name}-${d.date}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.04 }}
              className="group py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs mb-0.5">
                <span className="text-slate-400 font-bold tabular-nums w-5 text-right">#{i + 1}</span>
                <span className="text-slate-800 font-medium w-24 truncate">{d.name}</span>
                {d.aiRelated && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0 text-[9px] rounded-full bg-violet-50 text-violet-600 border border-violet-200 font-medium">
                    AI
                  </span>
                )}
                <span className="text-slate-400 text-[10px]">{d.date}</span>
                <span className="ml-auto text-slate-700 font-semibold tabular-nums">{d.laidOff.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${width}%` } : {}}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
