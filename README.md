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

- `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`)
- `AUTH_PORT` (default: `4000`)
- `CLIENT_ORIGIN` (default: `http://localhost:3000`)
- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `JWT_EXPIRES_IN` (default: `7d`)
- `CLOUDINARY_CLOUD_NAME` (required for uploads)
- `CLOUDINARY_API_KEY` (required for uploads)
- `CLOUDINARY_API_SECRET` (required for uploads)

## API Endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `POST /api/uploads` (backend Express API, authenticated)

## Architecture

- Frontend RTK Query service: `lib/services/authApi.ts`
- Backend MVC:
  - Model: `backend/src/models/User.js`
  - Controller: `backend/src/controllers/authController.js`
  - Upload controller: `backend/src/controllers/uploadController.js`
  - Routes: `backend/src/routes/authRoutes.js`
  - Upload route: `backend/src/routes/uploadRoutes.js`
  - App entry: `backend/src/server.js`
