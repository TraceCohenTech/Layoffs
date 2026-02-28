import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { formatCurrency } from '../utils/calculations';
import { SECTOR_COLORS } from '../data/financials';
import type { EfficiencyMetric } from '../types';

interface EfficiencyMetricsProps {
  data: EfficiencyMetric[];
}

export function EfficiencyMetrics({ data }: EfficiencyMetricsProps) {
  const [ref, inView] = useInView();

  // Revenue per Employee: sorted desc (NVIDIA first)
  const byRevPerEmp = [...data]
    .sort((a, b) => b.revenuePerEmployee - a.revenuePerEmployee)
    .slice(0, 10);

  // Jobs per $1B Revenue: sorted desc (Amazon/UPS first — volume hirers)
  const byJobsPerBillion = [...data]
    .sort((a, b) => b.jobsPerBillionRevenue - a.jobsPerBillionRevenue)
    .slice(0, 10);

  const maxRevPerEmp = byRevPerEmp[0]?.revenuePerEmployee ?? 1;
  const maxJobsPerBillion = byJobsPerBillion[0]?.jobsPerBillionRevenue ?? 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6 mb-8"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Efficiency vs Volume</h2>
      <p className="text-sm text-slate-500 mb-6">Two sides of the hiring equation — who generates more per head vs who employs more per dollar</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Revenue per Employee */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Revenue per Employee
          </h3>
          <div className="space-y-1.5">
            {byRevPerEmp.map((d, i) => {
              const width = Math.max((d.revenuePerEmployee / maxRevPerEmp) * 100, 4);
              const color = SECTOR_COLORS[d.sector] ?? '#64748b';
              return (
                <div key={d.company} className="group">
                  <div className="flex items-center gap-2 text-xs mb-0.5">
                    <span className="text-slate-800 font-medium w-28 truncate">{d.company}</span>
                    <span className="ml-auto text-slate-600 font-semibold tabular-nums">
                      {formatCurrency(d.revenuePerEmployee)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${width}%` } : {}}
                      transition={{ delay: 0.2 + i * 0.03, duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Jobs per $1B Revenue */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Jobs per $1B Revenue
          </h3>
          <div className="space-y-1.5">
            {byJobsPerBillion.map((d, i) => {
              const width = Math.max((d.jobsPerBillionRevenue / maxJobsPerBillion) * 100, 4);
              const color = SECTOR_COLORS[d.sector] ?? '#64748b';
              return (
                <div key={d.company} className="group">
                  <div className="flex items-center gap-2 text-xs mb-0.5">
                    <span className="text-slate-800 font-medium w-28 truncate">{d.company}</span>
                    <span className="ml-auto text-slate-600 font-semibold tabular-nums">
                      {d.jobsPerBillionRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${width}%` } : {}}
                      transition={{ delay: 0.2 + i * 0.03, duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="chart-insight">
        High-efficiency companies like <strong>NVIDIA</strong> generate massive revenue per head, while volume employers like <strong>Amazon</strong> and <strong>UPS</strong> sustain far more jobs per dollar of revenue
      </div>
    </motion.div>
  );
}
