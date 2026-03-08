// api/producto.js — Vercel Serverless Function
// Genera la página de producto con Open Graph tags
// para que WhatsApp muestre la imagen al compartir el link

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.redirect(302, '/');

  const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'detodounpocooficialok-6b190';
  const API_KEY    = process.env.FIREBASE_API_KEY    || 'AIzaSyClX9La52fBjrENUtumJh6gF40bldAmxaU';

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/${id}?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('No encontrado');

    const data   = await response.json();
    const f      = data.fields || {};
    const title  = f.title?.stringValue        || 'Producto';
    const desc   = f.description?.stringValue  || '';
    const price  = f.price?.integerValue || f.price?.doubleValue || 0;
    const img    = f.imageUrl?.stringValue     || '';
    const cat    = f.category?.stringValue     || '';

    // Detect site URL from request host
    const proto   = req.headers['x-forwarded-proto'] || 'https';
    const host    = req.headers['x-forwarded-host']  || req.headers.host;
    const siteUrl = `${proto}://${host}`;

    const waNum  = '5493734485570';
    const priceF = Number(price).toLocaleString('es-AR');
    const waText = encodeURIComponent(`Hola! Me interesa *${title}* por $${priceF}. ¿Está disponible? ${siteUrl}/producto?id=${id}`);
    const catLabel = cat === 'mujer' ? '👗 Mujer' : cat === 'hombre' ? '👔 Hombre' : '✨ Unisex';
    const catColor = cat === 'mujer' ? '#F67280' : cat === 'hombre' ? '#355C7D' : '#C06C84';
    const catBg    = cat === 'mujer' ? '#FFF0F0' : cat === 'hombre' ? '#EEF3F8' : '#F8F0FF';

    const html = `<!DOCTYPE html>
<html lang="es" prefix="og: https://ogp.me/ns#">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — De Todo Un Poco</title>

<!-- ✅ Open Graph — WhatsApp/Instagram/Facebook preview -->
<meta property="og:type"         content="product">
<meta property="og:site_name"    content="De Todo Un Poco">
<meta property="og:title"        content="${title} — $${priceF} ARS">
<meta property="og:description"  content="${desc.replace(/"/g, '&quot;').substring(0, 200)}">
<meta property="og:image"        content="${img}">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="1200">
<meta property="og:url"          content="${siteUrl}/producto?id=${id}">
<meta property="product:price:amount"   content="${price}">
<meta property="product:price:currency" content="ARS">

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="${title} — $${priceF} ARS">
<meta name="twitter:description" content="${desc.replace(/"/g, '&quot;').substring(0, 200)}">
<meta name="twitter:image"       content="${img}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --coral:#F67280; --mauve:#C06C84; --ocean:#355C7D; --peach:#F8B185;
  --warm-white:#FAF8F5; --charcoal:#1C1C1E; --gray:#6B6B6B;
  --light-gray:#E8E4DF; --wa:#25D366;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',sans-serif;background:var(--warm-white);color:var(--charcoal);min-height:100vh}
.navbar{background:rgba(250,248,245,.96);backdrop-filter:blur(12px);border-bottom:1px solid var(--light-gray);padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit}
.brand img{height:42px}
.brand-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;line-height:1.1}
.brand-sub{font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gray);font-family:'Outfit',sans-serif}
.back{text-decoration:none;color:var(--gray);font-size:.85rem;font-weight:500;display:flex;align-items:center;gap:4px;transition:color .2s}
.back:hover{color:var(--charcoal)}
.page{max-width:920px;margin:0 auto;padding:2.5rem 1.5rem;display:grid;grid-template-columns:1fr 1fr;gap:3.5rem;align-items:start}
.img-wrap{position:relative;border-radius:20px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.14);aspect-ratio:3/4;background:var(--light-gray)}
.img-wrap img{width:100%;height:100%;object-fit:cover;display:block}
.info{padding-top:.5rem}
.cat-tag{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${catColor};background:${catBg};padding:5px 14px;border-radius:12px;margin-bottom:1.1rem}
h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3.5vw,2.2rem);font-weight:700;line-height:1.2;margin-bottom:.9rem}
.price{font-size:2rem;font-weight:700;color:var(--ocean);margin-bottom:1.3rem;line-height:1}
.price span{font-size:.85rem;font-weight:400;color:var(--gray);margin-left:4px}
.desc{font-size:.95rem;color:var(--gray);line-height:1.75;margin-bottom:2rem}
.btn-wa{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--wa);color:#fff;border:none;border-radius:50px;padding:17px 28px;font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;text-decoration:none;cursor:pointer;box-shadow:0 4px 24px rgba(37,211,102,.4);transition:transform .2s,box-shadow .2s;width:100%;letter-spacing:.02em}
.btn-wa:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,211,102,.5)}
.btn-wa svg{width:22px;height:22px;flex-shrink:0}
.divider{height:1px;background:var(--light-gray);margin:1.8rem 0}
.back-foot{display:inline-flex;align-items:center;gap:6px;color:var(--gray);font-size:.85rem;text-decoration:none;transition:color .2s}
.back-foot:hover{color:var(--charcoal)}
@media(max-width:640px){
  .page{grid-template-columns:1fr;gap:1.5rem;padding:1rem}
  .price{font-size:1.6rem}
}
</style>
</head>
<body>
<nav class="navbar">
  <a href="/" class="brand">
    <img src="/logo.png" alt="De Todo Un Poco">
    <div>
      <div class="brand-name">De Todo Un Poco</div>
      <div class="brand-sub">Moda para todos</div>
    </div>
  </a>
  <a href="/" class="back">← Volver a la tienda</a>
</nav>

<main class="page">
  <div class="img-wrap">
    <img src="${img}" alt="${title}" loading="eager">
  </div>
  <div class="info">
    <div class="cat-tag">${catLabel}</div>
    <h1>${title}</h1>
    <div class="price">$${priceF}<span>ARS</span></div>
    <p class="desc">${desc}</p>
    <a href="https://wa.me/${waNum}?text=${waText}" target="_blank" class="btn-wa">
      <svg viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      Consultar por WhatsApp
    </a>
    <div class="divider"></div>
    <a href="/" class="back-foot">← Ver toda la tienda</a>
  </div>
</main>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).send(html);

  } catch (err) {
    console.error(err);
    return res.redirect(302, '/');
  }
};
