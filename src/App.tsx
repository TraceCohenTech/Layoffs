import { useState, useMemo } from 'react';
import { layoffsData, allCountries, yearRange } from './data/layoffs';
import { enrichData, headlines } from './data/enrichments';
import { filterData, calculateKPIs, getMonthlyData, getIndustryData, getCountryData, getStageData, getYearData, getHeatmapData, getTopCompanies } from './utils/calculations';
import type { FilterState } from './types';

import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { HeadlinesTicker } from './components/HeadlinesTicker';
import { FilterBar } from './components/FilterBar';
import { TimelineChart } from './components/TimelineChart';
import { IndustryChart } from './components/IndustryChart';
import { StageDonut } from './components/StageDonut';
import { CountryChart } from './components/CountryChart';
import { TopCompanies } from './components/TopCompanies';
import { YearComparison } from './components/YearComparison';
import { MonthlyHeatmap } from './components/MonthlyHeatmap';
import { AIInsights } from './components/AIInsights';

// Enrich base data with divisions, AI tags, and additional companies
const enrichedData = enrichData(layoffsData);
const enrichedIndustries = Array.from(new Set(enrichedData.map(d => d.industry))).filter(Boolean).sort();
const enrichedCountries = Array.from(new Set([...allCountries, ...enrichedData.map(d => d.country)])).filter(Boolean).sort();

function App() {
  const [filters, setFilters] = useState<FilterState>({
    yearRange: [2022, yearRange[1]],
    industry: '',
    country: '',
    search: '',
  });

  const filteredData = useMemo(() => filterData(enrichedData, filters), [filters]);
  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const monthlyData = useMemo(() => getMonthlyData(filteredData), [filteredData]);
  const industryData = useMemo(() => getIndustryData(filteredData), [filteredData]);
  const countryData = useMemo(() => getCountryData(filteredData), [filteredData]);
  const stageData = useMemo(() => getStageData(filteredData), [filteredData]);
  const yearData = useMemo(() => getYearData(filteredData), [filteredData]);
  const heatmapData = useMemo(() => getHeatmapData(filteredData), [filteredData]);
  const topCompanies = useMemo(() => getTopCompanies(filteredData), [filteredData]);

  // AI-related stats
  const aiStats = useMemo(() => {
    const aiEntries = filteredData.filter(d => d.aiRelated);
    const aiLaidOff = aiEntries.reduce((s, d) => s + (d.laidOff ?? 0), 0);
    return {
      count: aiEntries.length,
      totalLaidOff: aiLaidOff,
      percentage: filteredData.length > 0 ? Math.round((aiEntries.length / filteredData.length) * 100) : 0,
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
        {/* Header */}
        <Header totalLaidOff={kpis.totalLaidOff} totalCompanies={kpis.totalCompanies} />

        {/* Headlines Ticker */}
        <HeadlinesTicker headlines={headlines} />

        {/* KPI Cards */}
        <KPICards kpis={kpis} aiStats={aiStats} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          industries={enrichedIndustries}
          countries={enrichedCountries}
          yearMin={yearRange[0]}
          yearMax={yearRange[1]}
        />

        {/* Timeline */}
        <TimelineChart data={monthlyData} />

        {/* AI Insights */}
        <AIInsights data={filteredData} />

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

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 mb-2">
            Built by <span className="text-slate-800 font-medium">Trace Cohen</span>
          </p>
          <p className="text-xs text-slate-400">
            Data sourced from layoffs.fyi + additional research. {enrichedData.length.toLocaleString()} layoff events tracked.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
