export default async function handler(req, res) {
  // Configurar CORS para que tu web pueda llamar a esta función
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { q, type } = req.query; // q = canción a buscar, type = 'search' o 'mp3'

  if (!q) return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });

  try {
    if (type === 'search') {
      // Buscamos usando una API pública de búsqueda de YT
      const searchRes = await fetch(`https://api.lempi.lat/search/youtube?query=${encodeURIComponent(q)}&apikey=montekey28`);
      const data = await searchRes.json();
      return res.status(200).json(data);
      
    } else if (type === 'mp3') {
      // Descargamos el audio usando tu API de lempi
      const urlVideo = q; // Aquí pasamos la URL del video
      const audioRes = await fetch(`https://api.lempi.lat/dl/yta?url=${encodeURIComponent(urlVideo)}&apikey=montekey28`);
      const data = await audioRes.json();
      
      if (!data.status || !data.descarga?.url) {
        return res.status(404).json({ error: 'No se pudo extraer el MP3' });
      }
      return res.status(200).json({ url: data.descarga.url });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor proxy' });
  }
}