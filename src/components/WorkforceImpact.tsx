import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import type { WorkforceImpactEntry } from '../utils/calculations';

interface WorkforceImpactProps {
  data: WorkforceImpactEntry[];
}

export function WorkforceImpact({ data }: WorkforceImpactProps) {
  const [ref, inView] = useInView();
  const maxPct = data[0]?.pctOfWorkforce || 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Workforce Impact</h2>
      <p className="text-sm text-slate-500 mb-4">Cumulative layoffs as percentage of total workforce</p>

      <div className="space-y-1">
        {data.map((d, i) => {
          const width = Math.max((d.pctOfWorkforce / maxPct) * 100, 4);
          const opacity = 1 - (i / data.length) * 0.65;

          return (
            <motion.div
              key={d.company}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.04 }}
              className="group py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs mb-0.5">
                <span className="text-slate-400 font-bold tabular-nums w-5 text-right">#{i + 1}</span>
                <span className="text-slate-800 font-medium w-28 truncate">{d.company}</span>
                <span className="text-rose-600 font-semibold tabular-nums">{d.pctOfWorkforce}%</span>
                <span className="text-slate-400 text-[10px]">of ~{formatNumber(d.estEmployees)}</span>
                <span className="ml-auto text-slate-700 font-semibold tabular-nums">{formatNumber(d.totalLaidOff)} cut</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${width}%` } : {}}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: `rgba(225, 29, 72, ${opacity})` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {data.length > 0 && (
        <div className="chart-insight">
          <strong>{data[0].company}</strong> has cut {data[0].pctOfWorkforce}% of its workforce — {formatNumber(data[0].totalLaidOff)} employees from ~{formatNumber(data[0].estEmployees)}
        </div>
      )}
    </motion.div>
  );
}
