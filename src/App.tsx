import { useState, useMemo } from 'react';
import { layoffsData, allIndustries, allCountries, yearRange } from './data/layoffs';
import { filterData, calculateKPIs, getMonthlyData, getIndustryData, getCountryData, getStageData, getYearData, getHeatmapData, getTopCompanies } from './utils/calculations';
import type { FilterState } from './types';

import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { FilterBar } from './components/FilterBar';
import { TimelineChart } from './components/TimelineChart';
import { IndustryChart } from './components/IndustryChart';
import { StageDonut } from './components/StageDonut';
import { CountryChart } from './components/CountryChart';
import { TopCompanies } from './components/TopCompanies';
import { YearComparison } from './components/YearComparison';
import { MonthlyHeatmap } from './components/MonthlyHeatmap';
import { DataTable } from './components/DataTable';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    yearRange: [yearRange[0], yearRange[1]],
    industry: '',
    country: '',
    search: '',
  });

  const filteredData = useMemo(() => filterData(layoffsData, filters), [filters]);
  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const monthlyData = useMemo(() => getMonthlyData(filteredData), [filteredData]);
  const industryData = useMemo(() => getIndustryData(filteredData), [filteredData]);
  const countryData = useMemo(() => getCountryData(filteredData), [filteredData]);
  const stageData = useMemo(() => getStageData(filteredData), [filteredData]);
  const yearData = useMemo(() => getYearData(filteredData), [filteredData]);
  const heatmapData = useMemo(() => getHeatmapData(filteredData), [filteredData]);
  const topCompanies = useMemo(() => getTopCompanies(filteredData), [filteredData]);

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
        {/* Header */}
        <Header totalLaidOff={kpis.totalLaidOff} totalCompanies={kpis.totalCompanies} />

        {/* KPI Cards */}
        <KPICards kpis={kpis} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          industries={allIndustries}
          countries={allCountries}
          yearMin={yearRange[0]}
          yearMax={yearRange[1]}
        />

        {/* Timeline */}
        <TimelineChart data={monthlyData} />

        {/* Industry + Stage row */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <IndustryChart data={industryData} />
          <StageDonut data={stageData} />
        </section>

        {/* Geography + Top Companies row */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <CountryChart data={countryData} />
          <TopCompanies data={topCompanies} />
        </section>

        {/* Year-over-Year */}
        <YearComparison data={yearData} />

        {/* Monthly Heatmap */}
        <MonthlyHeatmap data={heatmapData} />

        {/* Data Table */}
        <section className="mb-8">
          <DataTable data={filteredData} />
        </section>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400 mb-2">
            Built by <span className="text-slate-200 font-medium">Trace Cohen</span>
          </p>
          <p className="text-xs text-slate-500">
            Data sourced from layoffs.fyi. {layoffsData.length.toLocaleString()} layoff events tracked.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
