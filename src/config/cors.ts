import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL];

    // Permitir sin origin (Postman, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Normalizar la URL (quitar barra final)
    const normalizedOrigin = origin.replace(/\/$/, '');
    const normalizedWhitelist = whitelist.map(url => url?.replace(/\/$/, ''));

    if (normalizedWhitelist.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS'));
    }
  }
};
