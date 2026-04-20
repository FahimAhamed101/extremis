# Webuzo Deployment

For Webuzo, the most practical setup for this repo is:

1. Create only the frontend app in Webuzo on your main domain.
2. Run the backend separately on an internal port such as `4000`.
3. Reverse proxy `/api` to that backend process with NGINX.

## Important

This repo uses `next@16.1.6`. Next.js 16 requires **Node.js 20.9+** according to the official Next.js docs:

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/guides/upgrading/version-16

If your Webuzo dropdown only offers `Node.js 16`, this frontend will not run correctly. Use Node `20` or `22` in Webuzo.

## Recommended Webuzo Layout

- `https://your-domain.com` -> Next.js frontend on port `3000`
- `https://your-domain.com/api` -> Express backend on port `4000`

Webuzo does not let you attach two separate apps to the same domain and same base path `/`, so a single-domain setup needs a reverse proxy in front of the backend.

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
- `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- `NEXT_PUBLIC_API_URL=/api`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=...` (optional)

After the app is created, open terminal/SSH in `/home/extremis/extremis` and run:

```bash
npm install
npm run build
```

## 3. Backend process

Run the API outside the Webuzo app UI so it can stay on an internal port:

```bash
cd /home/extremis/extremis
npm install
pm2 start backend/src/server.js --name extremis-api
pm2 save
```

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

If you prefer, `PORT=4000` also works because the backend accepts either `AUTH_PORT` or `PORT`.

## 4. NGINX reverse proxy

Add an NGINX site/server block that forwards:

- `/` -> `http://127.0.0.1:3000`
- `/api/` -> `http://127.0.0.1:4000/`

A ready-to-edit example is included at [deploy/nginx/extremis-single-domain.conf](/abs/path/c:/Users/Fahim/Desktop/extremis/deploy/nginx/extremis-single-domain.conf).

After updating NGINX:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 5. DNS

Create or confirm these DNS records:

- `@` or your root domain -> your server
- `www` -> your server

Then enable SSL for the main domain and `www` if you use it.

## 6. Health checks

After deploy:

- frontend: `https://your-domain.com`
- API health: `https://your-domain.com/api/health`

Expected API response:

```json
{
  "ok": true,
  "service": "auth-api"
}
```

## Notes

- The frontend supports both absolute API URLs and relative `/api`.
- In production, if `NEXT_PUBLIC_API_URL` is left empty, the frontend API layer also falls back to `/api` on non-local pages.
- The backend now supports a comma-separated `CLIENT_ORIGIN` allowlist for CORS.
- The backend is mounted both at `/api/*` and `/*`, which makes reverse-proxied `/api` traffic work without changing route modules.

## Alternate Layout

If you would rather avoid reverse proxy configuration, you can still deploy this repo with:

- `https://your-domain.com` -> frontend
- `https://api.your-domain.com` -> backend

In that case, set `NEXT_PUBLIC_API_URL=https://api.your-domain.com` and create a second Webuzo app for the backend on the API subdomain.
