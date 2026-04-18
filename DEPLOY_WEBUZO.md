# Webuzo Deployment

This project should be deployed as **two separate Node.js applications** in Webuzo:

1. `frontend`: Next.js app from the repo root
2. `api`: Express app from `backend/`

## Important

This repo uses `next@16.1.6`. Next.js 16 requires **Node.js 20.9+** according to the official Next.js docs:

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/guides/upgrading/version-16

If your Webuzo dropdown only offers `Node.js 16`, this frontend will not run correctly. Use Node `20` or `22` in Webuzo.

## Recommended domain layout

- Frontend: `https://your-domain.com`
- API: `https://api.your-domain.com`

This is the simplest setup for your current codebase.

## 1. Upload files

Upload the full repo to:

- `/home/extremis/extremis`

Your backend app will run from:

- `/home/extremis/extremis/backend`

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
- `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- `NEXT_PUBLIC_API_URL=https://api.your-domain.com`
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
- `Deployment Domain`: your API subdomain
- `Base Application URL`: `/`
- `Application Path`: `/home/extremis/extremis/backend`
- `Application Type`: Node.js `20` or `22`
- `Application startup file`: `src/server.js`
- `Start Command`: `npm start`
- `Deployment Environment`: `Production`

API environment variables:

- `NODE_ENV=production`
- `AUTH_PORT=4000`
- `CLIENT_ORIGIN=https://your-domain.com,https://www.your-domain.com`
- `MONGODB_URI=...`
- `MONGODB_DB=extremis`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `CLOUDINARY_UPLOAD_TIMEOUT_MS=15000`

After the app is created, open terminal/SSH in `/home/extremis/extremis/backend` and run:

```bash
npm install
```

## 4. DNS

Create or confirm these DNS records:

- `@` or your root domain -> frontend app
- `www` -> frontend app
- `api` -> backend app

Then enable SSL for both the main domain and the `api` subdomain.

## 5. Health checks

After deploy:

- frontend: `https://your-domain.com`
- API health: `https://api.your-domain.com/api/health`

Expected API response:

```json
{
  "ok": true,
  "service": "auth-api"
}
```

## Notes

- The frontend now respects an absolute `NEXT_PUBLIC_API_URL`, so using `https://api.your-domain.com` works correctly on this hosting.
- The backend now supports a comma-separated `CLIENT_ORIGIN` allowlist for CORS.
- If you prefer a single-domain setup like `https://your-domain.com/api`, you would need Webuzo or your web server to reverse proxy `/api` to the backend port.
