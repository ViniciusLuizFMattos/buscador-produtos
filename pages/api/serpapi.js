
export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Parâmetro "q" obrigatório' });

  try {
    const response = await fetch(`https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&hl=pt-br&api_key=c3786d9f90d02bef993df671d5e2c8f4ae329b582a853ac0da1f704f21e64f5c`);
    const data = await response.json();
    const results = (data.shopping_results || []).map(item => ({
      name: item.title,
      price: parseFloat(item.price.replace(/[R$\s]/g, '').replace(',', '.')),
      store: item.source,
      link: item.link,
      image: item.thumbnail
    }));
    res.status(200).json(results);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar na SerpAPI' });
  }
}
