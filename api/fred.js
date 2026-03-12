export default async function handler(req, res) {
  const { series_id } = req.query;

  if (!series_id) {
    return res.status(400).json({ error: 'Missing series_id' });
  }

  const API_KEY = '97dcf41c7648ee044dc4c08ccc59396f';
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(series_id)}&api_key=${API_KEY}&file_type=json&observation_start=2020-01-01&frequency=m`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch FRED data' });
  }
}
