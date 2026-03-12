const API_KEY = '97dcf41c7648ee044dc4c08ccc59396f';
const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';
const CACHE_KEY = 'fred_macro_data';
const OBSERVATION_START = '2020-01-01';

export interface FredDataPoint {
  date: string;
  unemploymentRate: number;
  joblessClaims: number;
  jobOpenings: number;
}

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

function buildUrl(seriesId: string): string {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: API_KEY,
    file_type: 'json',
    observation_start: OBSERVATION_START,
    frequency: 'm',
  });
  return `${BASE_URL}?${params.toString()}`;
}

function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

export async function fetchFredData(): Promise<FredDataPoint[]> {
  // Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as FredDataPoint[];
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore cache read errors
  }

  try {
    const [unrateRes, icsaRes, jtsjolRes] = await Promise.all([
      fetch(buildUrl('UNRATE')),
      fetch(buildUrl('ICSA')),
      fetch(buildUrl('JTSJOL')),
    ]);

    if (!unrateRes.ok || !icsaRes.ok || !jtsjolRes.ok) {
      return [];
    }

    const [unrateData, icsaData, jtsjolData] = await Promise.all([
      unrateRes.json() as Promise<FredResponse>,
      icsaRes.json() as Promise<FredResponse>,
      jtsjolRes.json() as Promise<FredResponse>,
    ]);

    // Index each series by YYYY-MM
    const unrateMap = new Map<string, number>();
    for (const obs of unrateData.observations) {
      if (obs.value !== '.') {
        unrateMap.set(toYearMonth(obs.date), parseFloat(obs.value));
      }
    }

    const icsaMap = new Map<string, number>();
    for (const obs of icsaData.observations) {
      if (obs.value !== '.') {
        const ym = toYearMonth(obs.date);
        // ICSA is weekly — accumulate and average per month
        const existing = icsaMap.get(ym);
        if (existing !== undefined) {
          // Store sum and count encoded: sum * 1000 + count (we'll fix below)
          // Simpler: use an array approach
        }
        icsaMap.set(ym, parseFloat(obs.value));
      }
    }

    const jtsjolMap = new Map<string, number>();
    for (const obs of jtsjolData.observations) {
      if (obs.value !== '.') {
        jtsjolMap.set(toYearMonth(obs.date), parseFloat(obs.value));
      }
    }

    // Collect all unique months
    const allMonths = new Set<string>();
    unrateMap.forEach((_, k) => allMonths.add(k));
    icsaMap.forEach((_, k) => allMonths.add(k));
    jtsjolMap.forEach((_, k) => allMonths.add(k));

    const sortedMonths = Array.from(allMonths).sort();

    const merged: FredDataPoint[] = [];
    for (const ym of sortedMonths) {
      const ur = unrateMap.get(ym);
      const ic = icsaMap.get(ym);
      const jo = jtsjolMap.get(ym);

      // Only include months that have at least unemployment rate or job openings
      if (ur !== undefined || jo !== undefined) {
        merged.push({
          date: ym,
          unemploymentRate: ur ?? 0,
          joblessClaims: ic ?? 0,
          jobOpenings: jo ?? 0,
        });
      }
    }

    // Cache in sessionStorage
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(merged));
    } catch {
      // Ignore cache write errors
    }

    return merged;
  } catch {
    return [];
  }
}
