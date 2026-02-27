import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { formatNumber } from '../utils/calculations';
import type { HeatmapCell } from '../types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthlyHeatmapProps {
  data: HeatmapCell[];
}

function getColor(value: number, max: number): string {
  if (value === 0) return 'rgba(241, 245, 249, 0.8)';
  const intensity = Math.min(value / max, 1);
  if (intensity < 0.2) return 'rgba(59, 130, 246, 0.15)';
  if (intensity < 0.4) return 'rgba(59, 130, 246, 0.3)';
  if (intensity < 0.6) return 'rgba(249, 115, 22, 0.35)';
  if (intensity < 0.8) return 'rgba(249, 115, 22, 0.55)';
  return 'rgba(244, 63, 94, 0.65)';
}

function getTextColor(value: number, max: number): string {
  if (value === 0) return '';
  const intensity = Math.min(value / max, 1);
  if (intensity < 0.4) return 'text-slate-700';
  return 'text-white';
}

export function MonthlyHeatmap({ data }: MonthlyHeatmapProps) {
  const [ref, inView] = useInView();

  const years = Array.from(new Set(data.map(d => d.year))).sort();
  const max = Math.max(...data.map(d => d.value), 1);

  const lookup = new Map<string, HeatmapCell>();
  for (const d of data) {
    lookup.set(`${d.year}-${d.month}`, d);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/80 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Monthly Heatmap</h2>
      <p className="text-sm text-slate-500 mb-6">Layoff intensity by month and year</p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-3 w-12" />
              {MONTH_NAMES.map(m => (
                <th key={m} className="text-center text-xs text-slate-500 font-medium pb-2 px-1">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((year, yi) => (
              <motion.tr
                key={year}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: yi * 0.05 }}
              >
                <td className="text-xs text-slate-600 font-medium pr-3 py-0.5">{year}</td>
                {Array.from({ length: 12 }, (_, m) => {
                  const cell = lookup.get(`${year}-${m}`);
                  const value = cell?.value ?? 0;
                  return (
                    <td key={m} className="px-0.5 py-0.5">
                      <div
                        className="w-full aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium min-w-[28px] min-h-[28px] cursor-default transition-transform hover:scale-110"
                        style={{ backgroundColor: getColor(value, max) }}
                        title={`${MONTH_NAMES[m]} ${year}: ${value.toLocaleString()} laid off`}
                      >
                        {value > 0 ? (
                          <span className={getTextColor(value, max)}>{formatNumber(value)}</span>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
        <span>Less</span>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map(i => (
          <div
            key={i}
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: getColor(max * i, max) }}
          />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}
