import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { parseDate } from '../utils/calculations';
import type { LayoffEntry } from '../types';

type SortKey = 'company' | 'laidOff' | 'date' | 'percentage' | 'industry' | 'country' | 'stage' | 'raisedMM';
type SortDir = 'asc' | 'desc';

interface DataTableProps {
  data: LayoffEntry[];
}

const PAGE_SIZE = 50;

export function DataTable({ data }: DataTableProps) {
  const [ref, inView] = useInView();
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'company':
          cmp = a.company.localeCompare(b.company);
          break;
        case 'laidOff':
          cmp = (a.laidOff ?? 0) - (b.laidOff ?? 0);
          break;
        case 'date':
          cmp = parseDate(a.date).getTime() - parseDate(b.date).getTime();
          break;
        case 'percentage':
          cmp = (a.percentage ?? 0) - (b.percentage ?? 0);
          break;
        case 'industry':
          cmp = a.industry.localeCompare(b.industry);
          break;
        case 'country':
          cmp = a.country.localeCompare(b.country);
          break;
        case 'stage':
          cmp = a.stage.localeCompare(b.stage);
          break;
        case 'raisedMM':
          cmp = (a.raisedMM ?? 0) - (b.raisedMM ?? 0);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  }

  function SortIcon({ field }: { field: SortKey }) {
    if (sortKey !== field) return <ChevronDown className="w-3 h-3 text-slate-400" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-600" />
      : <ChevronDown className="w-3 h-3 text-blue-600" />;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl border border-slate-200/60 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Full Dataset</h2>
          <p className="text-sm text-slate-500">{data.length.toLocaleString()} layoff events</p>
        </div>
        <div className="text-sm text-slate-500">
          Page {page + 1} of {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {([
                ['company', 'Company'],
                ['laidOff', '# Laid Off'],
                ['date', 'Date'],
                ['percentage', '%'],
                ['industry', 'Industry'],
                ['stage', 'Stage'],
                ['raisedMM', '$ Raised'],
                ['country', 'Country'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="text-left text-xs text-slate-500 font-medium py-3 px-2 cursor-pointer hover:text-slate-800 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon field={key} />
                  </div>
                </th>
              ))}
              <th className="text-left text-xs text-slate-500 font-medium py-3 px-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr
                key={`${row.company}-${row.date}-${i}`}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-2.5 px-2 font-medium text-slate-800 whitespace-nowrap">{row.company}</td>
                <td className="py-2.5 px-2 text-slate-700 tabular-nums">
                  {row.laidOff !== null ? row.laidOff.toLocaleString() : '-'}
                </td>
                <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap">{row.date}</td>
                <td className="py-2.5 px-2 text-slate-500 tabular-nums">
                  {row.percentage !== null ? `${row.percentage}%` : '-'}
                </td>
                <td className="py-2.5 px-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {row.industry}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-slate-500 text-xs">{row.stage}</td>
                <td className="py-2.5 px-2 text-slate-500 tabular-nums">
                  {row.raisedMM !== null ? `$${row.raisedMM.toLocaleString()}M` : '-'}
                </td>
                <td className="py-2.5 px-2 text-slate-500 text-xs whitespace-nowrap">{row.country}</td>
                <td className="py-2.5 px-2">
                  {row.source && row.source.startsWith('http') ? (
                    <a
                      href={row.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs">{row.source || '-'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) {
              pageNum = i;
            } else if (page < 3) {
              pageNum = i;
            } else if (page > totalPages - 4) {
              pageNum = totalPages - 7 + i;
            } else {
              pageNum = page - 3 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                  page === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
