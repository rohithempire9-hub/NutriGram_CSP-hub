# NutriGram MongoDB Backend

This repository now includes an Express API backed by MongoDB. The existing React UI is preserved. The API is an initial backend layer; the next integration step is to replace the frontend's localStorage/demo authentication handlers with API calls.

## API

- `GET /api/health` — service and MongoDB health.
- `POST /api/auth/login` — administrator login.
- `GET /api/auth/me` — current administrator session.
- `POST /api/auth/logout` — clear the session cookie.
- `GET|POST /api/children` — list and create child records.
- `PUT|DELETE /api/children/:id` — update and delete child records.
- `GET|POST /api/mandals` — list and create Mandals.
- `PUT|DELETE /api/mandals/:id` — update and delete Mandals.

All child and Mandal routes require an authenticated administrator. There is no public registration route and no demo login bypass. The API seeds the four starter Mandals only when the Mandal collection is empty; it does not seed sample child/health records.

## Local setup

1. Install dependencies with `npm install`.
2. Create a MongoDB Atlas database and copy its connection string.
3. Copy `.env.example` to `.env`.
4. Generate an administrator password hash:

   ```bash
   node server/scripts/hash-password.js "A-long-unique-password"
   ```

5. Put the generated `salt:hash` value in `ADMIN_PASSWORD_HASH`. Set `ADMIN_USERNAME`, `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, and `FRONTEND_URL=http://localhost:3000`.
6. Start the API with `npm run dev:server`.

The API listens on port 10000 by default. Test `http://localhost:10000/api/health`.

## Render deployment

Create a separate **Web Service** from this repository:

- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`

Add these environment variables in the Render dashboard:

- `NODE_ENV=production`
- `MONGODB_URI` — your Atlas connection string
- `JWT_SECRET` — a long random secret (32+ characters)
- `ADMIN_USERNAME` — the administrator login name
- `ADMIN_PASSWORD_HASH` — the generated hash, never the plain password
- `ADMIN_DISPLAY_NAME` — optional display name
- `FRONTEND_URL` — the exact deployed frontend origin, e.g. `https://nutrigram-csp-hub.onrender.com`

Do not commit `.env`, MongoDB credentials, the administrator password, or JWT secrets.

## Important integration note

The deployed frontend still needs its data/authentication layer switched from browser localStorage and demo accounts to these endpoints. Keep the API and frontend on HTTPS in production and configure the exact frontend origin in `FRONTEND_URL`.
