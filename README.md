# Diego Brañez — Landing minimalista

Estructura básica para un sitio estático con enlaces y QR.

## Estructura
- `index.html` — página principal.
- `css/style.css` — estilos y paleta (blanco/negro + acento rojo).
- `js/main.js` — espacio para scripts si los necesitas.
- `img/` — logos e imágenes.

## Cómo verlo
- Local directo: abre `index.html` en tu navegador.
- Servidor simple (opcional): `python -m http.server 8000` y visita `http://localhost:8000`.

## Personalización rápida
- Cambia textos y enlaces en `index.html`:
  - Accesos rápidos: propuestas, agenda y WhatsApp.
  - Redes sociales: actualiza los `href` con tus perfiles reales.
  - Actos y trayectoria: ajusta los items de las listas y la línea de tiempo.
  - Contacto: correo y WhatsApp del equipo.
- Carruseles: `Galería de actos` (imágenes estáticas) y carruseles de cards (`acts`, `team`) usan la misma lógica; solo reemplaza contenido.
- Sección “Destacados visuales”: grid para más imágenes o banners. Cambia las rutas de `img/...` por tus recursos.
- Los QR usan `api.qrserver.com`: actualiza la URL dentro del `data=` para cada QR (asegúrate de URL-encode si cambias caracteres especiales).
- Puedes alternar el logo en el `<img>` principal a `img/logo2.jpeg` si prefieres esa versión.

## Deploy gratuito recomendado
- GitHub Pages, Netlify, Vercel o Cloudflare Pages: sube estos archivos y sirve la raíz del proyecto.
