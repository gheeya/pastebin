# Paste.io
A simple, minimalistic replica of pastebin

---

## Features

- Create a paste containing arbitrary text
- Receive a shareable URL for the paste
- View pastes via API or HTML page
- Optional time-based expiry (TTL)
- Optional view-count limits
- Safe HTML rendering (no script execution)
- Deterministic time support for automated testing

---

## Tech Stack

- Backend: Node.js, Express
- Frontend: React (Vite)
- Persistence Layer: MongoDB (via Mongoose)
- Deployment: Vercel

---

## Repository Structure

.
├── backend/
├── frontend/
├── package.json
└── README.md

The backend and frontend are deployed as separate Vercel projects using
their respective subdirectories.

---

## Running the Project Locally

### Prerequisites

- Node.js >= 18
- MongoDB connection string (local MongoDB or MongoDB Atlas)

---

### Install Dependencies

From the repository root:

npm install  
npm run install-all

This installs dependencies for both the backend and frontend.

---

### Environment Variables

Create a .env file inside the backend directory, you can refer .env.sample:

MONGODB_URI=your_mongodb_connection_string  
TEMP_DB_NAME=your_database_name
TEMP_DB_NAME=temp_db_name
TEST_MODE=1

---

### Start the Application

npm run dev

- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:5173

---

## Build

To build the frontend:

npm run build

The build output is generated in frontend/dist.

---

## API Endpoints

### Health Check

GET /api/healthz

Returns HTTP 200 and JSON confirming connectivity to the persistence layer.

Example:
{ "ok": true }

### Create a Paste

POST /api/pastes

Request body (JSON):

{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}

Rules:
- content is required and must be a non-empty string
- ttl_seconds is optional; if present, must be an integer ≥ 1
- max_views is optional; if present, must be an integer ≥ 1
- null or omitted values indicate no limit

Successful response:

{
  "id": "string",
  "url": "https://your-app.vercel.app/p/<id>"
}


### Fetch a Paste (API)

GET /api/pastes/:id

Successful response:

{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}

- remaining_views may be null if unlimited
- expires_at may be null if no TTL
- Each successful fetch increments the view count

Unavailable pastes return HTTP 404.

---

### View a Paste (HTML)

GET /p/:id

- Returns HTML containing the paste content
- Returns HTTP 404 if unavailable
- Content is safely escaped to prevent script execution

---

## Deterministic Time Support (Testing)

If TEST_MODE=1 is set, the backend uses the request header:

x-test-now-ms: <milliseconds since epoch>

as the current time for expiry logic. If not provided, real system time is used.

---

## Persistence Layer

MongoDB is used as the persistence layer via Mongoose to ensure data survives
across requests and works correctly in serverless environments.

---

## Design Decisions

- Availability enforced at read time to avoid race conditions
- View counts increment only on successful fetches
- TTL expiry computed at creation time
- No in-memory storage to ensure serverless compatibility

---

## Deployment

- Backend deployed on Vercel from the backend directory : https://pastebin-backend-umber.vercel.app/
- Frontend deployed on Vercel from the frontend directory : https://pastebin-frontend-beta.vercel.app/
