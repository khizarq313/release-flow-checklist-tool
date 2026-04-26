# Release Flow

Release Flow is a single-page release checklist tool built with React, GraphQL, Prisma, and PostgreSQL. Each release stores a fixed checklist, computes its own status automatically, and lets users create, review, update, and delete releases from one responsive interface.

## Stack

- Frontend: React, TypeScript, Vite, Apollo Client, Tailwind CSS
- Backend: Node.js, Express, Apollo Server, Prisma
- Database: PostgreSQL
- API style: GraphQL over HTTP

## Features

- View all releases in a responsive list/detail workspace
- Create a release with name, due date, and optional additional information
- Check or uncheck any shared checklist step for a release
- Auto-compute status from checklist state: planned, ongoing, done
- Update release notes after creation
- Delete a release
- Run backend tests with Jest
- Run locally with Docker Compose or plain npm commands

## Run Locally

### Option 1: Docker Compose

This starts PostgreSQL, the backend API, and the frontend dev server.

```bash
docker compose up --build
```

App URLs:

- Frontend: http://localhost:5173
- GraphQL API: http://localhost:4000/graphql
- Health check: http://localhost:4000/health

### Option 2: Run services manually

1. Start PostgreSQL.

```bash
docker compose up -d postgres
```

2. Create local env files.

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

3. Start the backend.

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate dev
npm run dev
```

4. Start the frontend in a second terminal.

```bash
cd frontend
npm ci
npm run dev
```

## Test Commands

```bash
cd backend
npm test -- --runInBand
```

## API Endpoints

### REST-style utility endpoints

- `GET /` returns a short API message
- `GET /health` returns `{ "status": "ok" }`

### GraphQL endpoint

- `POST /graphql`

Supported operations:

- Query `releases`: fetch all releases
- Query `release(id: ID!)`: fetch one release
- Mutation `createRelease(name: String!, date: String!, additionalInfo: String)`
- Mutation `updateSteps(id: ID!, steps: [Boolean!]!)`
- Mutation `updateAdditionalInfo(id: ID!, additionalInfo: String!)`
- Mutation `deleteRelease(id: ID!)`

## Database Schema

Prisma schema:

```prisma
model Release {
	id             String   @id @default(uuid())
	name           String
	date           DateTime
	additionalInfo String?
	steps          Json
	createdAt      DateTime @default(now())
	updatedAt      DateTime @updatedAt
}
```

Notes:

- `steps` stores the fixed checklist state for a release as a boolean array
- `status` is not stored in the database; it is computed in the GraphQL resolver
- The app uses PostgreSQL, but the model is simple enough to adapt to MySQL if needed

## Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: API port, defaults to `4000`
- `FRONTEND_URL`: allowed frontend origin for CORS, defaults to `http://localhost:5173`

### Frontend

- `VITE_API_URL`: GraphQL endpoint, defaults to `http://localhost:4000/graphql`

## Deployment Notes

The codebase is deployment-ready, but the actual cloud deployment was not executed from this workspace because no hosting credentials are available here.

Recommended setup:

1. Deploy PostgreSQL on Render, Railway, Neon, Supabase, or another managed provider.
2. Deploy the backend as a Node service and set `DATABASE_URL` and `FRONTEND_URL`.
3. Deploy the frontend as a static Vite site and set `VITE_API_URL` to the deployed backend GraphQL URL.

Typical production build commands:

### Backend

```bash
npm ci
npm run build:render
npm start
```

### Render backend settings

Use these values for your Render Web Service:

- Root Directory: `backend`
- Build Command: `npm ci && npm run build:render`
- Start Command: `npm start`

Required Render environment variables:

- `DATABASE_URL`: full Render Postgres Internal Database URL
- `FRONTEND_URL`: your Vercel frontend URL
- `NODE_ENV`: `production`

If the API throws `The table public.Release does not exist in the current database`, the backend is connected to the database but migrations were not applied. Redeploy the Render service after confirming the build command includes `npm run build:render`.

### Frontend

```bash
npm ci
npm run build
```
