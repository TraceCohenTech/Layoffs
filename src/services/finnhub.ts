import { companyTickers } from '../data/tickers';

const CACHE_KEY = 'stock_impact_v2';

export interface StockImpactResult {
  symbol: string;
  companyName: string;
  layoffDate: string;
  laidOff: number;
  priceBefore: number;
  priceDay: number;
  priceAfter: number;
  changeDayOf: number;
  changeDayAfter: number;
}

function parseDateMMDDYYYY(dateStr: string): Date {
  const parts = dateStr.split('/');
  return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
}

function toUnix(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchDayPrices(
  symbol: string,
  layoffDate: Date
): Promise<{ priceBefore: number; priceDay: number; priceAfter: number } | null> {
  const from = new Date(layoffDate);
  from.setDate(from.getDate() - 7);
  const to = new Date(layoffDate);
  to.setDate(to.getDate() + 5);

  try {
    const res = await fetch(`/api/finnhub?symbol=${encodeURIComponent(symbol)}&from=${toUnix(from)}&to=${toUnix(to)}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.timestamps || data.timestamps.length < 3) return null;

    const timestamps: number[] = data.timestamps;
    const closes: number[] = data.closes;

    const layoffUnix = toUnix(layoffDate);
    let dayIdx = timestamps.findIndex(ts => ts >= layoffUnix);
    if (dayIdx === -1) dayIdx = timestamps.length - 1;
    if (dayIdx === 0) dayIdx = 1;

    const priceBefore = closes[dayIdx - 1];
    const priceDay = closes[dayIdx];
    const priceAfter = dayIdx + 1 < closes.length ? closes[dayIdx + 1] : closes[dayIdx];

    if (priceBefore == null || priceDay == null || isNaN(priceBefore) || isNaN(priceDay)) return null;

    return { priceBefore, priceDay, priceAfter };
  } catch {
    return null;
  }
}

export async function fetchStockImpacts(
  layoffEvents: { company: string; date: string; laidOff: number | null }[]
): Promise<StockImpactResult[]> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as StockImpactResult[];
      if (parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }

  const eligible = layoffEvents.filter(
    e => companyTickers[e.company] && e.laidOff && e.laidOff > 500
  );

  const byCompany = new Map<string, { company: string; date: string; laidOff: number }>();
  for (const e of eligible) {
    const existing = byCompany.get(e.company);
    if (!existing || (e.laidOff ?? 0) > existing.laidOff) {
      byCompany.set(e.company, { company: e.company, date: e.date, laidOff: e.laidOff! });
    }
  }

  const top = Array.from(byCompany.values())
    .sort((a, b) => b.laidOff - a.laidOff)
    .slice(0, 15);

  const results: StockImpactResult[] = [];

  for (const event of top) {
    const symbol = companyTickers[event.company];
    const layoffDate = parseDateMMDDYYYY(event.date);
    const prices = await fetchDayPrices(symbol, layoffDate);

    if (prices) {
      const changeDayOf = ((prices.priceDay - prices.priceBefore) / prices.priceBefore) * 100;
      const changeDayAfter = ((prices.priceAfter - prices.priceBefore) / prices.priceBefore) * 100;

      results.push({
        symbol,
        companyName: event.company,
        layoffDate: event.date,
        laidOff: event.laidOff,
        priceBefore: Math.round(prices.priceBefore * 100) / 100,
        priceDay: Math.round(prices.priceDay * 100) / 100,
        priceAfter: Math.round(prices.priceAfter * 100) / 100,
        changeDayOf: Math.round(changeDayOf * 100) / 100,
        changeDayAfter: Math.round(changeDayAfter * 100) / 100,
      });
    }

    await delay(300);
  }

  results.sort((a, b) => a.changeDayOf - b.changeDayOf);

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(results));
  } catch { /* ignore */ }

  return results;
}
