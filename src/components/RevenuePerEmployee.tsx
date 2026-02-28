import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { formatCurrency } from '../utils/calculations';
import { SECTOR_COLORS } from '../data/financials';
import type { CompanyFinancials } from '../types';

interface RevenuePerEmployeeProps {
  data: CompanyFinancials[];
}

export function RevenuePerEmployee({ data }: RevenuePerEmployeeProps) {
  const [ref, inView] = useInView();

  const maxVal = data.length > 0 ? data[0].revenuePerEmployee : 1;

  // Find NVIDIA and Amazon for the insight
  const nvidia = data.find(d => d.company === 'NVIDIA');
  const amazon = data.find(d => d.company === 'Amazon');
  const multiplier = nvidia && amazon && amazon.revenuePerEmployee > 0
    ? Math.round(nvidia.revenuePerEmployee / amazon.revenuePerEmployee)
    : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Revenue per Employee</h2>
      <p className="text-sm text-slate-500 mb-6">How much revenue each employee generates annually</p>

      <div className="space-y-2">
        {data.map((d, i) => {
          const width = Math.max((d.revenuePerEmployee / maxVal) * 100, 3);
          const color = SECTOR_COLORS[d.sector] ?? '#64748b';
          const isNvidia = d.company === 'NVIDIA';

          return (
            <motion.div
              key={d.company}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.04 }}
              className={`group py-1.5 px-2 rounded-lg transition-colors ${isNvidia ? 'bg-emerald-50/60' : 'hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-2 text-xs mb-0.5">
                <span className="text-slate-400 font-bold tabular-nums w-5 text-right">#{i + 1}</span>
                <span className={`font-medium w-32 truncate ${isNvidia ? 'text-emerald-700' : 'text-slate-800'}`}>{d.company}</span>
                <span
                  className="px-1.5 py-0 text-[9px] rounded-full font-medium border"
                  style={{ color, borderColor: color + '40', backgroundColor: color + '10' }}
                >
                  {d.sector}
                </span>
                <span className="ml-auto text-slate-700 font-semibold tabular-nums">
                  {formatCurrency(d.revenuePerEmployee)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${width}%` } : {}}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {multiplier && (
        <div className="chart-insight">
          <strong>NVIDIA</strong> generates {formatCurrency(nvidia!.revenuePerEmployee)} per employee — {multiplier}x Amazon's {formatCurrency(amazon!.revenuePerEmployee)}
        </div>
      )}
    </motion.div>
  );
}
