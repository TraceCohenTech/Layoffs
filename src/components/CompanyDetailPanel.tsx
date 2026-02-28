import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { formatCurrency } from '../utils/calculations';
import type { CompanyFinancials, CompanyHistory } from '../types';

interface CompanyDetailPanelProps {
  company: string;
  financials?: CompanyFinancials;
  history?: CompanyHistory;
}

export function CompanyDetailPanel({ company, financials, history }: CompanyDetailPanelProps) {
  const sparkData = history?.headcount.map(h => ({ count: h.count })) ?? [];
  const latestYear = history?.headcount[history.headcount.length - 1];
  const firstYear = history?.headcount[0];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="px-3 pb-3 pt-1">
        <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Column 1: Company info */}
          <div>
            <p className="text-xs text-slate-500 mb-1">Company</p>
            <p className="text-sm font-semibold text-slate-900">{company}</p>
            {financials && (
              <>
                <p className="text-xs text-slate-500 mt-2 mb-0.5">Sector</p>
                <p className="text-xs font-medium text-slate-700">{financials.sector}</p>
                <p className="text-xs text-slate-500 mt-2 mb-0.5">Employees</p>
                <p className="text-xs font-medium text-slate-700">{financials.employeeCount.toLocaleString()}</p>
              </>
            )}
          </div>

          {/* Column 2: Sparkline headcount */}
          <div>
            <p className="text-xs text-slate-500 mb-1">Headcount Trend</p>
            {sparkData.length > 1 ? (
              <>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Line
                        dataKey="count"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={800}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {firstYear?.year}–{latestYear?.year}: {firstYear?.count.toLocaleString()} → {latestYear?.count.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400">No historical data</p>
            )}
          </div>

          {/* Column 3: Revenue stats */}
          <div>
            {financials ? (
              <>
                <p className="text-xs text-slate-500 mb-1">Revenue</p>
                <p className="text-sm font-semibold text-slate-900">
                  ${(financials.revenueMillions / 1000).toFixed(1)}B
                </p>
                <p className="text-xs text-slate-500 mt-2 mb-0.5">Per Employee</p>
                <p className="text-sm font-semibold text-emerald-600">
                  {formatCurrency(financials.revenuePerEmployee)}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400">No financial data available</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
