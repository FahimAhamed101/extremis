This project uses:

- Next.js (frontend)
- Redux Toolkit Query (frontend API layer)
- Express + MongoDB + Mongoose (backend, MVC pattern)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
copy .env.example .env
```

3. Update `.env` values (especially `MONGODB_URI` and `JWT_SECRET`).

4. Run backend API:

```bash
npm run dev:backend
```

5. Run frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- `NEXT_PUBLIC_API_URL` (local default: `http://localhost:4000`, production single-domain recommendation: `/api`)
- `NEXT_PUBLIC_SITE_URL` (recommended in production, e.g. `https://www.extremis.top`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional, e.g. `G-XXXXXXXXXX`)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (required for direct browser uploads)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (required, unsigned preset)
- `AUTH_PORT` (default: `4000`)
- `CLIENT_ORIGIN` (default: `http://localhost:3000`)
- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (default: `7d`)
- `CLOUDINARY_CLOUD_NAME` (required for uploads)
- `CLOUDINARY_API_KEY` (required for uploads)
- `CLOUDINARY_API_SECRET` (required for uploads)
- `CLOUDINARY_UPLOAD_TIMEOUT_MS` (optional, default: `15000`)

## Production Deployment

This repo supports two production layouts:

- Single domain with reverse proxy:
  `https://your-domain.com` -> Next.js frontend
  `https://your-domain.com/api` -> Express backend
- Split domains:
  `https://your-domain.com` -> frontend
  `https://api.your-domain.com` -> backend

For the single-domain layout, set `NEXT_PUBLIC_API_URL=/api` and proxy `/api` to the backend process. A ready-to-adapt NGINX example lives at [deploy/nginx/extremis-single-domain.conf](/abs/path/c:/Users/Fahim/Desktop/extremis/deploy/nginx/extremis-single-domain.conf).

The frontend API layer already falls back to `/api` on non-local production pages, and the backend mounts routes both with and without the `/api` prefix so reverse-proxied requests work cleanly.

## API Endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `POST /api/uploads` (backend Express API, authenticated)

## SEO Files

- `GET /sitemap.xml` is generated from `app/sitemap.ts`
- `GET /robots.txt` is generated from `app/robots.ts`
- Set `NEXT_PUBLIC_SITE_URL` in Vercel for canonical URLs, sitemap, and robots host values

## Architecture

- Frontend RTK Query service: `lib/services/authApi.ts`
- Backend MVC:
  - Model: `backend/src/models/User.js`
  - Controller: `backend/src/controllers/authController.js`
  - Upload controller: `backend/src/controllers/uploadController.js`
  - Routes: `backend/src/routes/authRoutes.js`
  - Upload route: `backend/src/routes/uploadRoutes.js`
  - App entry: `backend/src/server.js`
