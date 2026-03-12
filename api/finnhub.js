export default async function handler(req, res) {
  const { symbol, from, to, resolution = 'D' } = req.query;

  if (!symbol || !from || !to) {
    return res.status(400).json({ error: 'Missing required params: symbol, from, to' });
  }

  const API_KEY = 'd6pggfhr01qo88aj43g0d6pggfhr01qo88aj43gg';
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${encodeURIComponent(resolution)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&token=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch Finnhub data' });
  }
}
