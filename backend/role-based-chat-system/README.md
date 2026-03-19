# Role-Based Chat System

Standalone full-stack chat system with:

- Next.js 15 frontend
- Node.js + Express + TypeScript backend
- MongoDB persistence
- JWT authentication
- Socket.IO realtime messaging

## Project Structure

- `src/`: backend source
- `client/`: frontend source in the packaged submission
- `documentation/`: HTML documentation for buyers
- `postman/`: API collection

## Local Setup

### Backend

1. Run `npm install`
2. Copy `.env.example` to `.env`
3. Update the environment values
4. Run `npm run dev`

Backend defaults:

- API base: `http://localhost:5000`
- Health check: `GET /health`

### Frontend

1. Run `cd client`
2. Run `npm install`
3. Copy `.env.example` to `.env.local`
4. Run `npm run dev`

Frontend default URL:

- App: `http://localhost:3000`

## Core Features

- Role-based registration and login for `user` and `sender`
- Conversation listing
- Contact search
- Create-or-open conversation flow
- Realtime message delivery
- Read receipts
- Responsive inbox UI

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/chat/contacts`
- `POST /api/chat/conversations`
- `GET /api/chat/conversations`
- `GET /api/chat/conversations/:conversationId/messages`
- `POST /api/chat/conversations/:conversationId/messages`
- `POST /api/chat/conversations/:conversationId/read`

All chat routes require `Authorization: Bearer <accessToken>`.

## Documentation

Open [documentation/INDEX.html](documentation/INDEX.html) in a browser for buyer-facing setup and usage documentation.

## Submission

Use the generated `submission/role-based-chat-system/` folder for your marketplace zip. That export excludes local secrets, build output, and development-only folders.
