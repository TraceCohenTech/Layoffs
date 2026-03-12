import { companyTickers } from '../data/tickers';

const CACHE_KEY = 'finnhub_stock_impact';

export interface DailyPrice {
  date: string;
  close: number;
}

export interface StockImpactResult {
  symbol: string;
  companyName: string;
  layoffDate: string;
  laidOff: number;
  priceOnDay: number;
  price7Days: number;
  price30Days: number;
  change7Days: number;
  change30Days: number;
  dailyPrices: DailyPrice[];
}

interface FinnhubCandle {
  s: string; // status: "ok" or "no_data"
  c: number[]; // close prices
  h: number[]; // high prices
  l: number[]; // low prices
  o: number[]; // open prices
  t: number[]; // timestamps
  v: number[]; // volumes
}

function parseDateMMDDYYYY(dateStr: string): Date {
  // Format: "M/D/YYYY"
  const parts = dateStr.split('/');
  return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
}

function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

function formatDateISO(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toISOString().split('T')[0];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchStockCandle(
  symbol: string,
  layoffDate: Date
): Promise<{ dailyPrices: DailyPrice[]; priceOnDay: number; price7Days: number; price30Days: number } | null> {
  // 5 trading days before (~7 calendar days) to 30 trading days after (~45 calendar days)
  const fromDate = new Date(layoffDate);
  fromDate.setDate(fromDate.getDate() - 10);
  const toDate = new Date(layoffDate);
  toDate.setDate(toDate.getDate() + 45);

  const from = toUnixTimestamp(fromDate);
  const to = toUnixTimestamp(toDate);

  try {
    const res = await fetch(`/api/finnhub?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&resolution=D`);
    if (!res.ok) return null;

    const data = (await res.json()) as FinnhubCandle;
    if (data.s !== 'ok' || !data.c || data.c.length === 0) return null;

    const dailyPrices: DailyPrice[] = data.t.map((ts, i) => ({
      date: formatDateISO(ts),
      close: data.c[i],
    }));

    const layoffTs = toUnixTimestamp(layoffDate);

    // Find the closest trading day on or after the layoff date
    let dayIdx = data.t.findIndex(ts => ts >= layoffTs);
    if (dayIdx === -1) dayIdx = data.t.length - 1;

    const priceOnDay = data.c[dayIdx];

    // ~7 trading days after
    const idx7 = Math.min(dayIdx + 7, data.c.length - 1);
    const price7Days = data.c[idx7];

    // ~30 trading days after (or as far as we have)
    const idx30 = Math.min(dayIdx + 30, data.c.length - 1);
    const price30Days = data.c[idx30];

    return { dailyPrices, priceOnDay, price7Days, price30Days };
  } catch {
    return null;
  }
}

export async function fetchStockImpacts(
  layoffEvents: { company: string; date: string; laidOff: number | null }[]
): Promise<StockImpactResult[]> {
  // Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as StockImpactResult[];
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore
  }

  // Filter to events with known tickers and laidOff > 500
  const eligible = layoffEvents.filter(
    e => companyTickers[e.company] && e.laidOff && e.laidOff > 500
  );

  // Group by company and take the largest layoff event per company
  const byCompany = new Map<string, { company: string; date: string; laidOff: number }>();
  for (const e of eligible) {
    const existing = byCompany.get(e.company);
    if (!existing || (e.laidOff ?? 0) > existing.laidOff) {
      byCompany.set(e.company, { company: e.company, date: e.date, laidOff: e.laidOff! });
    }
  }

  // Sort by laidOff descending and take top 15
  const top = Array.from(byCompany.values())
    .sort((a, b) => b.laidOff - a.laidOff)
    .slice(0, 15);

  const results: StockImpactResult[] = [];

  for (const event of top) {
    const symbol = companyTickers[event.company];
    const layoffDate = parseDateMMDDYYYY(event.date);

    const candle = await fetchStockCandle(symbol, layoffDate);
    if (candle && candle.priceOnDay > 0) {
      const change7Days = ((candle.price7Days - candle.priceOnDay) / candle.priceOnDay) * 100;
      const change30Days = ((candle.price30Days - candle.priceOnDay) / candle.priceOnDay) * 100;

      results.push({
        symbol,
        companyName: event.company,
        layoffDate: event.date,
        laidOff: event.laidOff,
        priceOnDay: candle.priceOnDay,
        price7Days: candle.price7Days,
        price30Days: candle.price30Days,
        change7Days: Math.round(change7Days * 100) / 100,
        change30Days: Math.round(change30Days * 100) / 100,
        dailyPrices: candle.dailyPrices,
      });
    }

    // Rate limit: 200ms between requests
    await delay(200);
  }

  // Sort by change30Days ascending (worst first)
  results.sort((a, b) => a.change30Days - b.change30Days);

  // Cache results
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(results));
  } catch {
    // Ignore
  }

  return results;
}
