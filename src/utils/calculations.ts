import type { LayoffEntry, MonthlyData, IndustryData, CountryData, StageData, YearData, HeatmapCell, KPIData, FilterState } from '../types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
  }
  return new Date(dateStr);
}

export function filterData(data: LayoffEntry[], filters: FilterState): LayoffEntry[] {
  return data.filter(d => {
    const date = parseDate(d.date);
    const year = date.getFullYear();
    if (year < filters.yearRange[0] || year > filters.yearRange[1]) return false;
    if (filters.industry && d.industry !== filters.industry) return false;
    if (filters.country && d.country !== filters.country) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!d.company.toLowerCase().includes(s) &&
          !d.locationHQ.toLowerCase().includes(s) &&
          !d.industry.toLowerCase().includes(s)) return false;
    }
    return true;
  });
}

export function calculateKPIs(data: LayoffEntry[]): KPIData {
  const withCount = data.filter(d => d.laidOff !== null && d.laidOff > 0);
  const totalLaidOff = withCount.reduce((sum, d) => sum + (d.laidOff ?? 0), 0);
  const totalCompanies = data.length;
  const averageSize = withCount.length > 0 ? Math.round(totalLaidOff / withCount.length) : 0;

  let largestLayoff = 0;
  let largestCompany = '';
  for (const d of withCount) {
    if ((d.laidOff ?? 0) > largestLayoff) {
      largestLayoff = d.laidOff ?? 0;
      largestCompany = d.company;
    }
  }

  // Top industry
  const industryCounts: Record<string, number> = {};
  for (const d of data) {
    if (d.industry && d.industry !== 'Other') {
      industryCounts[d.industry] = (industryCounts[d.industry] || 0) + 1;
    }
  }
  let topIndustry = '';
  let topIndustryCount = 0;
  for (const [ind, count] of Object.entries(industryCounts)) {
    if (count > topIndustryCount) {
      topIndustryCount = count;
      topIndustry = ind;
    }
  }

  const dates = data.map(d => parseDate(d.date)).filter(d => !isNaN(d.getTime()));
  const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
  const dateRange = sorted.length > 0
    ? `${MONTH_NAMES[sorted[0].getMonth()]} ${sorted[0].getFullYear()} - ${MONTH_NAMES[sorted[sorted.length - 1].getMonth()]} ${sorted[sorted.length - 1].getFullYear()}`
    : '';

  return { totalLaidOff, totalCompanies, averageSize, largestLayoff, largestCompany, topIndustry, topIndustryCount, dateRange };
}

export function getMonthlyData(data: LayoffEntry[]): MonthlyData[] {
  const map = new Map<string, MonthlyData>();

  for (const d of data) {
    const date = parseDate(d.date);
    if (isNaN(date.getTime())) continue;
    const year = date.getFullYear();
    const monthNum = date.getMonth();
    const key = `${year}-${String(monthNum).padStart(2, '0')}`;

    if (!map.has(key)) {
      map.set(key, {
        month: `${MONTH_NAMES[monthNum]} ${year}`,
        year,
        monthNum,
        count: 0,
        totalLaidOff: 0,
        companies: 0,
      });
    }
    const entry = map.get(key)!;
    entry.companies++;
    if (d.laidOff !== null) {
      entry.count++;
      entry.totalLaidOff += d.laidOff;
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.monthNum - b.monthNum;
  });
}

export function getIndustryData(data: LayoffEntry[]): IndustryData[] {
  const map = new Map<string, IndustryData>();

  for (const d of data) {
    if (!d.industry) continue;
    if (!map.has(d.industry)) {
      map.set(d.industry, { industry: d.industry, totalLaidOff: 0, companies: 0 });
    }
    const entry = map.get(d.industry)!;
    entry.companies++;
    if (d.laidOff !== null) entry.totalLaidOff += d.laidOff;
  }

  return Array.from(map.values())
    .sort((a, b) => b.totalLaidOff - a.totalLaidOff)
    .slice(0, 12);
}

export function getCountryData(data: LayoffEntry[]): CountryData[] {
  const map = new Map<string, CountryData>();

  for (const d of data) {
    if (!d.country) continue;
    if (!map.has(d.country)) {
      map.set(d.country, { country: d.country, totalLaidOff: 0, companies: 0 });
    }
    const entry = map.get(d.country)!;
    entry.companies++;
    if (d.laidOff !== null) entry.totalLaidOff += d.laidOff;
  }

  return Array.from(map.values())
    .sort((a, b) => b.totalLaidOff - a.totalLaidOff)
    .slice(0, 12);
}

export function getStageData(data: LayoffEntry[]): StageData[] {
  const map = new Map<string, StageData>();

  for (const d of data) {
    const stage = d.stage || 'Unknown';
    if (!map.has(stage)) {
      map.set(stage, { stage, count: 0, totalLaidOff: 0 });
    }
    const entry = map.get(stage)!;
    entry.count++;
    if (d.laidOff !== null) entry.totalLaidOff += d.laidOff;
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function getYearData(data: LayoffEntry[]): YearData[] {
  const map = new Map<number, YearData>();

  for (const d of data) {
    const date = parseDate(d.date);
    if (isNaN(date.getTime())) continue;
    const year = date.getFullYear();

    if (!map.has(year)) {
      map.set(year, { year, totalLaidOff: 0, companies: 0 });
    }
    const entry = map.get(year)!;
    entry.companies++;
    if (d.laidOff !== null) entry.totalLaidOff += d.laidOff;
  }

  return Array.from(map.values()).sort((a, b) => a.year - b.year);
}

export function getHeatmapData(data: LayoffEntry[]): HeatmapCell[] {
  const map = new Map<string, HeatmapCell>();

  for (const d of data) {
    const date = parseDate(d.date);
    if (isNaN(date.getTime())) continue;
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!map.has(key)) {
      map.set(key, { month, monthName: MONTH_NAMES[month], year, value: 0 });
    }
    const entry = map.get(key)!;
    entry.value += d.laidOff ?? 0;
  }

  return Array.from(map.values());
}

export function getTopCompanies(data: LayoffEntry[], limit = 15): LayoffEntry[] {
  return [...data]
    .filter(d => d.laidOff !== null && d.laidOff > 0)
    .sort((a, b) => (b.laidOff ?? 0) - (a.laidOff ?? 0))
    .slice(0, limit);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/** Calculate YoY trends for KPI cards */
export function calculateTrends(data: LayoffEntry[]): {
  totalLaidOffChange: number | null;
  companiesChange: number | null;
  avgSizeChange: number | null;
} {
  const byYear = new Map<number, { total: number; count: number; withCount: number }>();
  for (const d of data) {
    const date = parseDate(d.date);
    if (isNaN(date.getTime())) continue;
    const year = date.getFullYear();
    if (!byYear.has(year)) byYear.set(year, { total: 0, count: 0, withCount: 0 });
    const entry = byYear.get(year)!;
    entry.count++;
    if (d.laidOff !== null && d.laidOff > 0) {
      entry.total += d.laidOff;
      entry.withCount++;
    }
  }

  const years = Array.from(byYear.keys()).sort();
  if (years.length < 2) return { totalLaidOffChange: null, companiesChange: null, avgSizeChange: null };

  const curr = byYear.get(years[years.length - 1])!;
  const prev = byYear.get(years[years.length - 2])!;

  const pct = (a: number, b: number) => b > 0 ? Math.round(((a - b) / b) * 100) : null;

  return {
    totalLaidOffChange: pct(curr.total, prev.total),
    companiesChange: pct(curr.count, prev.count),
    avgSizeChange: pct(
      curr.withCount > 0 ? Math.round(curr.total / curr.withCount) : 0,
      prev.withCount > 0 ? Math.round(prev.total / prev.withCount) : 0,
    ),
  };
}

/** Get sparkline data: last 12 months of total laid off */
export function getSparklineData(data: LayoffEntry[]): number[] {
  const monthly = getMonthlyData(data);
  return monthly.slice(-12).map(m => m.totalLaidOff);
}

/** Find the peak month from monthly data */
export function getPeakMonth(data: MonthlyData[]): MonthlyData | null {
  if (data.length === 0) return null;
  return data.reduce((peak, d) => d.totalLaidOff > peak.totalLaidOff ? d : peak, data[0]);
}
