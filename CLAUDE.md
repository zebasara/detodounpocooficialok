# De Todo Un Poco — Contexto del Proyecto

## Qué es
Tienda de ropa online (hombre/mujer/unisex) desplegada en Vercel.  
URL producción: https://detodounpocooficialok.vercel.app

## Stack
- **Frontend**: HTML + CSS + JS vanilla (sin frameworks)
- **Base de datos**: Firebase Firestore (productos en tiempo real con `onSnapshot`)
- **Imágenes**: Cloudinary (upload desde admin)
- **Deploy**: Vercel (rama `main` → auto-deploy)
- **PWA**: Service Worker (`sw.js`) + manifest (`manifest.json`)

## Archivos clave
| Archivo | Función |
|---|---|
| `index.html` | Tienda pública — grid de productos, filtros, modal, likes |
| `admin.html` | Panel de administración (con contraseña) |
| `firebase-config.js` | Config Firebase + Cloudinary + WhatsApp/Instagram |
| `api/producto.js` | Página de producto individual (Vercel serverless) |
| `vercel.json` | Configuración de rutas Vercel |

## Credenciales / IDs (NO publicar)
- Firebase project: `detodounpocooficialok-6b190`
- Cloudinary cloud: `dywosceas`, preset: `detodounpoco`
- WhatsApp: `5493734485570`
- Instagram: `detodounpoco_oficialok`
- Admin password: en `firebase-config.js` → `storeConfig.adminPassword`

## Colección Firestore: `products`
Campos por documento:
```
title          string
description    string
price          number
originalPrice  number | null   (precio tachado, opcional)
category       'mujer' | 'hombre' | 'unisex'
status         'disponible' | 'por_pedido' | 'agotado'   ← NUEVO (2025-05)
imageUrl       string   (primera imagen, compat.)
images         string[] (array de URLs Cloudinary)
likes          number
createdAt      Timestamp
```

## Features implementadas
- Grid de productos con filtro por categoría y orden por likes/nuevo
- Slider de imágenes en cards y modal con swipe táctil
- Sistema de likes (persistido en Firestore + localStorage)
- Modal de detalle con galería + miniaturas + botón WhatsApp
- **Estado de producto**: `disponible` / `por_pedido` / `agotado`
  - Badge visual en card y modal
  - Botón "Consultar" → "Pedir" (por_pedido) o deshabilitado (agotado)
  - Se gestiona desde admin.html
- **Admin panel**:
  - Lista de productos en contenedor scrolleable (max-height: 620px)
  - Buscador en tiempo real por nombre de producto
  - Badge de estado en cada item de la lista
- PWA instalable (banner de instalación, iOS + Android)
- SEO básico (meta tags, Open Graph, schema.org, sitemap)

## Reglas al editar
- **No romper** la estructura actual de HTML/CSS/JS
- El código es vanilla — no introducir dependencias npm ni frameworks
- Los productos existen localmente pero se deploya vía **GitHub → Vercel**
- Siempre verificar que los cambios en `index.html` no rompan el módulo ES (`<script type="module">`)
- El campo `status` tiene default implícito `'disponible'` si no existe en Firestore
