# 🚀 Subir a GitHub Pages — 2 minutos, sin terminal

El sitio ya está listo para publicar: rutas relativas, `.nojekyll` incluido,
embeds de YouTube funcionando sobre https. No hay que cambiar nada.

## Opción A — desde el navegador (recomendada)

1. Entrá a **https://github.com/new** (logueado en tu cuenta).
   - Repository name: `portfolio` (o `bloqqmayus`)
   - Visibility: **Public**
   - NO marques "Add a README" → **Create repository**.
2. En la página de la repo vacía, click en **"uploading an existing file"**
   (o Add file → Upload files).
3. Arrastrá **todo el contenido** de la carpeta `portfolio/`:
   `index.html`, la carpeta `assets/`, `.nojekyll`, `README.md`, etc.
   ⚠️ El contenido, no la carpeta contenedora.
   (Si no ves `.nojekyll` en tu explorador, activá "mostrar archivos ocultos" —
   en Windows: Vista → Elementos ocultos.)
4. Abajo: **Commit changes**.
5. **Settings → Pages** → Build and deployment → Source: *Deploy from a branch*
   → Branch: **main** / carpeta **/(root)** → **Save**.
6. Esperá 1-2 minutos y abrí:
   **https://TU-USUARIO.github.io/portfolio/**
   Ahí los videos reproducen embebidos, con filtros y modal propios. ✅

## Opción B — con terminal (si tenés git)

```bash
cd portfolio
git init -b main
git add -A
git commit -m "Portfolio BLOQQ MÁYUS"
git remote add origin https://github.com/TU-USUARIO/portfolio.git
git push -u origin main
```
Después, Settings → Pages igual que en el paso 5 de la Opción A.

## Opción C — automática (con el asistente)

Con un token fino de GitHub (permiso *Contents: read/write*, solo este repo):

```bash
./deploy.sh <TOKEN> "mensaje del commit"
```

Clona el repo publicado, sincroniza `index.html` + `assets/` + guías + `.nojekyll`,
commitea y pushea. GitHub Pages republica solo en ~1 minuto.
El token se usa en memoria durante el push: no se guarda en archivos ni en el repo.

## Notas

- **URL en la raíz**: si nombrás la repo `TU-USUARIO.github.io`, el sitio queda
  en `https://TU-USUARIO.github.io/` (sin `/portfolio/`).
- **Dominio propio**: Settings → Pages → Custom domain → escribí tu dominio
  y agregá el CNAME que te indica en tu DNS. Gratis, con HTTPS automático.
- **Actualizar el sitio**: reemplazá `index.html` y/o `assets/` y commiteá
  (o volvé a subir por la web). Pages republica solo en ~1 minuto.
- **Versión de un solo archivo**: `Portfolio_BLOQQ_MAYUS.html` sirve para
  mandar por mail/WhatsApp como demo offline; para Pages usá siempre
  `index.html` + `assets/` (más liviano y actualizable).
