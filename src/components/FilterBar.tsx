import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import type { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  industries: string[];
  countries: string[];
  yearMin: number;
  yearMax: number;
}

export function FilterBar({ filters, onFilterChange, industries, countries, yearMin, yearMax }: FilterBarProps) {
  const years = Array.from({ length: yearMax - yearMin + 1 }, (_, i) => yearMin + i);

  const hasActiveFilters = filters.industry || filters.country || filters.search ||
    filters.yearRange[0] !== yearMin || filters.yearRange[1] !== yearMax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-xl border border-slate-200/60 p-4 mb-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-slate-700">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange({ yearRange: [yearMin, yearMax], industry: '', country: '', search: '' })}
            className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Year from */}
        <select
          value={filters.yearRange[0]}
          onChange={(e) => onFilterChange({ ...filters, yearRange: [parseInt(e.target.value), filters.yearRange[1]] })}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-blue-400 transition-colors"
        >
          {years.map(y => <option key={y} value={y}>From {y}</option>)}
        </select>

        {/* Year to */}
        <select
          value={filters.yearRange[1]}
          onChange={(e) => onFilterChange({ ...filters, yearRange: [filters.yearRange[0], parseInt(e.target.value)] })}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-blue-400 transition-colors"
        >
          {years.map(y => <option key={y} value={y}>To {y}</option>)}
        </select>

        {/* Industry */}
        <select
          value={filters.industry}
          onChange={(e) => onFilterChange({ ...filters, industry: e.target.value })}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-blue-400 transition-colors"
        >
          <option value="">All Industries</option>
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>

        {/* Country */}
        <select
          value={filters.country}
          onChange={(e) => onFilterChange({ ...filters, country: e.target.value })}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:border-blue-400 transition-colors"
        >
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </motion.div>
  );
}
