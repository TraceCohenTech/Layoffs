export default async function handler(req, res) {
  const { symbol, from, to } = req.query;

  if (!symbol || !from || !to) {
    return res.status(400).json({ error: 'Missing required params: symbol, from, to' });
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${from}&period2=${to}&interval=1d`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const data = await response.json();
    const result = data?.chart?.result?.[0];

    if (!result || !result.timestamp) {
      return res.status(200).json({ timestamps: [], closes: [] });
    }

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).json({ timestamps, closes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}
