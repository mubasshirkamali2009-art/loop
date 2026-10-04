# LOOP: AI-Powered Customer Feedback Intelligence Platform

LOOP helps organizations collect customer feedback, analyze it with AI, and turn it into clear insights. It detects sentiment and recurring themes, shows trends on a dashboard, answers questions in plain language, and writes Voice of Customer (VoC) reports. Each organization's data is kept separate (multi-tenant) and access is controlled by roles.

Built by **Sheikh Siam** for **Zidio Development**.

## Features

- **Authentication:** email/password and Google sign-in, profile photo upload
- **Multi-tenant organizations:** every record belongs to one organization and is filtered by it on the server
- **Role-based access control:** Org Admin, Manager, Analyst, Viewer
- **Feedback management:** add, search, filter, paginate, change status, delete, re-analyze
- **AI analysis:** sentiment, themes and a one-line summary for every feedback item
- **Batch review analysis:** paste up to 100 reviews, analyze them, save them with one click
- **Ask AI:** natural-language questions answered from your saved feedback
- **Analytics:** sentiment split, top themes and 7/30/90-day trends
- **VoC reports:** AI-written executive summary, complaints, praises and recommendations

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, lucide-react |
| Authentication | better-auth (email/password, Google OAuth) |
| Backend API | Node.js, Express (JavaScript) |
| Database | MongoDB Atlas (native driver) |
| AI | Google Gemini via `@google/genai` |
| Images | ImgBB |

## How it fits together

```
Browser ──> Next.js app (UI + sign-in) ──> Express API ──> MongoDB
                                               │
                                               └──> Gemini API
```

- Sign-in happens in the Next.js app, and sessions are stored in MongoDB.
- The Express API reads the session cookie, finds the user's organization and role, and applies both to every request.
- `organizationId` and `role` always come from the server, never from the request body.
- The Gemini key stays on the server and never reaches the browser.

## Project structure

```
loop/                      Next.js frontend
├── src/app/
│   ├── api/auth/[...all]/ better-auth handler
│   ├── api/upload/        ImgBB image upload
│   ├── login/  signup/
│   ├── dashboard/
│   ├── feedback/          list, new, [id]
│   ├── ai_chat/
│   ├── reports/           list, [id]
│   └── organization/  admin/  profile/
├── src/components/        Navbar, Sidebar, Footer, KpiCard, OrgGate, OrgOnboarding, ...
└── src/lib/               auth.ts, auth-client.ts, api.ts, types.ts, format.ts

loop server/               Express API
└── index.js
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- A MongoDB Atlas cluster
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- A Google OAuth client (only for Google sign-in)

### 1. Frontend

```bash
cd loop
npm install
npm run dev
```

Create `loop/.env`:

```env
MONGO_DB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=a_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMGBB_KEY=your_imgbb_key
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

### 2. API server

```bash
cd "loop server"
npm install express cors dotenv mongodb @google/genai
npx nodemon index.js
```

Create `loop server/.env` (next to `index.js`):

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_DB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Never commit `.env` files. If a key is ever shown in public, delete it and create a new one.

### 3. Google sign-in (optional)

In Google Cloud Console, create an OAuth client of type **Web application** and add:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

Restart the Next.js server after adding the keys to `.env`.

### 4. Check that everything works

1. Open `http://localhost:5000/api/health`. It should return `{"ok":true}`.
2. Sign up at `http://localhost:3000/signup`.
3. While logged in, open `http://localhost:5000/api/ai/health`. It should return `"ok":true`. If not, the message explains the cause (wrong key, missing model, quota).
4. Open `/ai_chat`, paste some reviews in the **Analyze reviews** tab and save them.

### Demo data

An organization admin can load 48 sample feedback items and analyze them:

```js
await fetch("http://localhost:5000/api/dev/seed", { method: "POST", credentials: "include" }).then(r => r.json())
```

## Roles

| Action | Org Admin | Manager | Analyst | Viewer |
|---|:-:|:-:|:-:|:-:|
| View feedback, analytics, reports | Yes | Yes | Yes | Yes |
| Add/edit feedback, use AI, generate reports | Yes | Yes | Yes | No |
| Delete feedback and reports, view members | Yes | Yes | No | No |
| Add members, change roles, edit organization | Yes | No | No | No |

## API overview

All routes need a logged-in user with an organization, except `/api/health`, `/api/me`, `/api/organization/onboard` and `/api/ai/analyze*`.

| Group | Endpoints |
|---|---|
| Session and organization | `GET /api/me`, `POST /api/organization/onboard`, `GET/PATCH /api/organization` |
| Users | `GET/POST /api/users`, `PATCH /api/users/:userId/role`, `DELETE /api/users/:userId` |
| Feedback | `POST/GET /api/feedback`, `GET/PATCH/DELETE /api/feedback/:id`, `POST /api/feedback/:id/analyze`, `POST /api/feedback/analyze-pending`, `POST /api/feedback/bulk` |
| Analytics | `GET /api/analytics`, `GET /api/analytics/trends?range=7d\|30d\|90d`, `GET /api/themes` |
| AI | `POST /api/ai/analyze`, `POST /api/ai/analyze-batch`, `POST /api/ai/query`, `GET /api/ai/health` |
| Reports | `POST/GET /api/reports`, `GET/DELETE /api/reports/:id` |

`GET /api/feedback` supports `search`, `sentiment`, `theme`, `status`, `source`, `from`, `to`, `page` and `limit`.

## Data model

| Collection | Purpose |
|---|---|
| `user`, `session`, `account` | Managed by better-auth |
| `organizations` | One record per tenant |
| `members` | `userId` to `organizationId` with a role (one organization per user) |
| `feedback` | Text, source, status, sentiment, themes, summary, `aiStatus` |
| `reports` | Generated VoC reports |

## Challenges and how they were solved

- **Shared login across two apps:** the Express API validates the better-auth session cookie against MongoDB, with CORS limited to the client and credentials enabled.
- **Tenant isolation:** `organizationId` and `role` are read from the session and membership record on the server, and every query includes the organization.
- **Google users with no organization:** a gate component asks them to create one first.
- **Reliable AI output:** JSON-only responses, field validation, retries with backoff for temporary errors, and a stored `aiStatus` so failed items can be retried.
- **Gemini setup errors:** the key is trimmed and read on the server, the model name is configurable, and `/api/ai/health` shows the real cause.
- **Large pasted reviews:** a split-by-sentence helper and chunked batch analysis (20 per call, up to 100).
- **Deployment readiness:** component file names and imports match exactly in letter case so Linux hosting builds work.

## Roadmap

- Email, support-ticket, social and app-store integrations
- CSV/Excel import and PDF export
- Scheduled reports, real-time alerts and email invitations
- Multilingual (including Bangla) analysis, predictive analytics, customer segmentation
- Super Admin panel, audit log, rate limiting, background job queue
- Automated tests, especially for tenant isolation and roles
- Mobile app

## Deployment notes

- Frontend on Vercel, API on Render or Railway.
- When the frontend and API are on different domains, browsers will not send the login cookie to the API. Proxy API calls through Next.js (`rewrites`) and point `NEXT_PUBLIC_SERVER_URL` at the proxy path.
- Add the production URL and `/api/auth/callback/google` to the Google OAuth client, and allow the API server's IP in MongoDB Atlas.

## Author

Sheikh Siam, Zidio Development