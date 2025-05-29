
import React, { useState } from 'react';
import { Upload, Search, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [productName, setProductName] = useState('');
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSearch = async () => {
    setLoading(true);
    const googleResults = await searchGoogleShopping(productName);
    const mlResults = await searchMercadoLivre(productName);
    const allResults = [...googleResults, ...mlResults];
    setResults(allResults.sort((a, b) => a.price - b.price));
    setLoading(false);
  };

  const searchGoogleShopping = async (query) => {
    try {
      const response = await fetch(`/api/serpapi?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar no Google Shopping (proxy):', error);
      return [];
    }
  };

  const searchMercadoLivre = async (query) => {
    try {
      const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      return (data.results || []).map(item => ({
        name: item.title,
        price: item.price,
        store: 'Mercado Livre',
        link: item.permalink,
        image: item.thumbnail
      }));
    } catch (error) {
      console.error('Erro ao buscar no Mercado Livre:', error);
      return [];
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ec4899, #facc15, #f97316)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <motion.h1
        style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', textShadow: '1px 1px #000' }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        Onde Comprar Mais Barato?
      </motion.h1>

      <motion.p
        style={{ color: 'white', marginBottom: '1.5rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        Pesquise pelo nome ou envie uma foto do produto que deseja encontrar
      </motion.p>

      <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px', width: '100%', marginBottom: '1.5rem' }}>
        <input
          placeholder="Ex: Tênis Nike Air Max"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', fontSize: '1rem' }}
        />
        <button onClick={handleSearch} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
          <Search style={{ display: 'inline', width: '20px', height: '20px', marginRight: '0.25rem' }} /> Buscar
        </button>
      </div>

      <label style={{ backgroundColor: 'white', padding: '0.5rem 1.5rem', borderRadius: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', marginBottom: '1rem' }}>
        <Upload style={{ width: '16px', height: '16px' }} /> Enviar Foto
        <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
      </label>

      {image ? (
        <img src={image} alt="Produto" style={{ width: '160px', height: '160px', objectFit: 'contain', borderRadius: '8px', border: '4px solid white', marginBottom: '1.5rem' }} />
      ) : (
        <div style={{ width: '160px', height: '160px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <ImageIcon style={{ width: '40px', height: '40px', color: '#d1d5db' }} />
        </div>
      )}

      {loading ? (
        <motion.p style={{ color: 'white', fontSize: '1.25rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Buscando ofertas...</motion.p>
      ) : (
        <motion.div style={{ display: 'grid', gap: '1rem', maxWidth: '500px', width: '100%' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {results.map((item, idx) => (
            <a href={item.link} target="_blank" rel="noopener noreferrer" key={idx} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'black' }}>
              <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '8px' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f97316' }}>{item.name}</p>
                <p style={{ fontSize: '0.9rem', color: '#374151' }}>R$ {item.price.toFixed(2)} <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>({item.store})</span></p>
              </div>
            </a>
          ))}
        </motion.div>
      )}
    </div>
  );
}
