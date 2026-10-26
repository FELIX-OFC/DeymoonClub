export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { q, type } = req.query;

  if (!q) return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });

  // Detectamos si 'q' es una URL de YouTube
  const isYTUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(q);

  try {
    if (type === 'search') {
      if (isYTUrl) {
        // Si es un enlace, usamos tu endpoint de info (asumiendo que lempi tiene uno, o lo adaptamos)
        // Si lempi no tiene endpoint de info, podemos usar el de búsqueda con el ID
        const videoId = q.split('v=')[1]?.split('&')[0] || q.split('youtu.be/')[1]?.split('?')[0];
        
        // Hacemos una búsqueda usando el ID para obtener los metadatos (título, foto, autor)
        const searchRes = await fetch(`https://api.lempi.lat/search/youtube?query=${videoId}&apikey=montekey28`);
        const data = await searchRes.json();
        return res.status(200).json(data);
      } else {
        // Búsqueda normal por texto
        const searchRes = await fetch(`https://api.lempi.lat/search/youtube?query=${encodeURIComponent(q)}&apikey=montekey28`);
        const data = await searchRes.json();
        return res.status(200).json(data);
      }
      
    } else if (type === 'mp3') {
      // Aquí 'q' ya viene siendo la URL completa del video
      const audioRes = await fetch(`https://api.lempi.lat/dl/yta?url=${encodeURIComponent(q)}&apikey=montekey28`);
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