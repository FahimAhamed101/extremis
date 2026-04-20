# Webuzo Deployment

For Webuzo, the simplest setup for this repo is:

1. Deploy the frontend on `extremis.top`.
2. Deploy the backend separately on `api.extremis.top`.

## Important

This repo uses `next@16.1.6`. Next.js 16 requires **Node.js 20.9+** according to the official Next.js docs:

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/guides/upgrading/version-16

If your Webuzo dropdown only offers `Node.js 16`, this frontend will not run correctly. Use Node `20` or `22` in Webuzo.

## Recommended Webuzo Layout

- `https://extremis.top` -> Next.js frontend
- `https://api.extremis.top` -> Express backend

This avoids the same-domain base-path limitation in Webuzo and does not require an NGINX `/api` reverse proxy.

## 1. Upload files

Upload the full repo to:

- `/home/extremis/extremis`

## 2. Frontend application in Webuzo

Use **Applications -> Add Applications -> Self Managed** and create a frontend app with these values:

- `Port`: any free port, for example `3000`
- `Application Name`: `extremis-frontend`
- `Deployment Domain`: your main domain
- `Base Application URL`: `/`
- `Application Path`: `/home/extremis/extremis`
- `Application Type`: Node.js `20` or `22`
- `Application startup file`: `webuzo-frontend.js`
- `Start Command`: `npm run start:webuzo`
- `Deployment Environment`: `Production`

Frontend environment variables:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://extremis.top`
- `NEXT_PUBLIC_API_URL=https://api.extremis.top`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=...` (optional)

After the app is created, open terminal/SSH in `/home/extremis/extremis` and run:

```bash
npm install
npm run build
```

## 3. API application in Webuzo

Create a second **Self Managed** app with these values:

- `Port`: any free port, for example `4000`
- `Application Name`: `extremis-api`
- `Deployment Domain`: `api.extremis.top`
- `Base Application URL`: `/`
- `Application Path`: `/home/extremis/extremis/backend`
- `Application Type`: Node.js `20` or `22`
- `Application startup file`: `src/server.js`
- `Start Command`: `npm start`
- `Deployment Environment`: `Production`

After the app is created, open terminal/SSH in `/home/extremis/extremis/backend` and run:

```bash
npm install
```

API environment variables:

- `NODE_ENV=production`
- `AUTH_PORT=4000`
- `CLIENT_ORIGIN=https://extremis.top,https://www.extremis.top`
- `MONGODB_URI=...`
- `MONGODB_DB=extremis`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `CLOUDINARY_UPLOAD_TIMEOUT_MS=15000`

If you prefer, `PORT=4000` also works because the backend accepts either `AUTH_PORT` or `PORT`.

## 4. DNS

Create or confirm these DNS records:

- `@` or your root domain -> frontend app
- `www` -> frontend app
- `api` -> backend app

Then enable SSL for both `extremis.top` and `api.extremis.top`.

## 5. Health checks

After deploy:

- frontend: `https://extremis.top`
- API health: `https://api.extremis.top/api/health`

Expected API response:

```json
{
  "ok": true,
  "service": "auth-api"
}
```

## Notes

- The frontend supports absolute API URLs, so `https://api.extremis.top` works cleanly on Webuzo.
- The backend supports a comma-separated `CLIENT_ORIGIN` allowlist for CORS.
- A single-domain `/api` reverse proxy setup is still possible later if you decide to switch.
