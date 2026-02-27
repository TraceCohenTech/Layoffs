import { useState, useMemo } from 'react';
import { layoffsData, allCountries, yearRange } from './data/layoffs';
import { enrichData, headlines } from './data/enrichments';
import { filterData, calculateKPIs, getMonthlyData, getIndustryData, getCountryData, getStageData, getYearData, getHeatmapData, getTopCompanies, calculateTrends, getSparklineData, getWorkforceImpactData } from './utils/calculations';
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
import { SectionHeader } from './components/SectionHeader';
import { WorkforceImpact } from './components/WorkforceImpact';

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
  const trends = useMemo(() => calculateTrends(filteredData), [filteredData]);
  const sparkline = useMemo(() => getSparklineData(filteredData), [filteredData]);
  const workforceData = useMemo(() => getWorkforceImpactData(filteredData), [filteredData]);

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

  // Get the last data month for "Last updated"
  const lastUpdated = useMemo(() => {
    if (monthlyData.length === 0) return '';
    const last = monthlyData[monthlyData.length - 1];
    return last.month;
  }, [monthlyData]);

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
        {/* Header */}
        <Header totalLaidOff={kpis.totalLaidOff} totalCompanies={kpis.totalCompanies} dateRange={kpis.dateRange} />

        {/* Headlines Ticker */}
        <HeadlinesTicker headlines={headlines} />

        {/* KPI Cards — 4 primary + 2 secondary */}
        <KPICards kpis={kpis} aiStats={aiStats} trends={trends} sparkline={sparkline} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          industries={enrichedIndustries}
          countries={enrichedCountries}
          yearMin={yearRange[0]}
          yearMax={yearRange[1]}
        />

        {/* The Timeline */}
        <SectionHeader title="The Timeline" subtitle="How layoffs evolved from correction to AI restructuring" />
        <TimelineChart data={monthlyData} />

        {/* The AI Factor */}
        <SectionHeader title="The AI Factor" subtitle="Layoffs explicitly driven by AI adoption and automation" />
        <AIInsights data={filteredData} />

        {/* Where It's Happening */}
        <SectionHeader title="Where It's Happening" subtitle="Industries, geographies, and companies most affected" />
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <IndustryChart data={industryData} totalLaidOff={kpis.totalLaidOff} />
          <StageDonut data={stageData} />
        </section>

        <WorkforceImpact data={workforceData} />

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <CountryChart data={countryData} totalLaidOff={kpis.totalLaidOff} />
          <TopCompanies data={topCompanies} />
        </section>

        {/* Year over Year */}
        <SectionHeader title="Year over Year" subtitle="Annual trends and seasonal patterns" />
        <YearComparison data={yearData} />

        {/* Monthly Heatmap */}
        <MonthlyHeatmap data={heatmapData} />

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-slate-500">
                Built by <span className="text-slate-800 font-medium">Trace Cohen</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Data sourced from layoffs.fyi + additional research. {enrichedData.length.toLocaleString()} layoff events tracked.
              </p>
            </div>
            {lastUpdated && (
              <p className="text-xs text-slate-400">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
