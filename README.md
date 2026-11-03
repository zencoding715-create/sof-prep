# FIELDGUIDE — Special Warfare Prep

FIELDGUIDE is a public preparation website with pathway-specific score comparisons and an AI-generated, week-by-week training course. Each week includes a stated effort target and personalized progression based on the selected route, entered score gaps, experience, time, equipment, and timeline.

## AI plan API

The browser sends the selected pathway and service route, fitness scores and their supplied comparison targets, training experience, availability, equipment, pool access, sports/prep background, focus, and an optional restriction note to the hosted AI service. It does not send the user's email, password, name, or event-search location to the plan generator. The server forwards plan details to the OpenAI Responses API with `store: false`; OpenAI's standard abuse-monitoring logs may still retain prompts and responses for up to 30 days, with legal and safety exceptions. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data). The public plan API is rate-limited to five requests per IP per hour. Provider usage may incur charges.

## Accounts and saved plans

Users can create an account with an email address and password, sign in with a secure HTTP-only session cookie, and explicitly save, reopen, or delete their training plans. Account email and password are never included in the AI plan request. Passwords are stored as salted scrypt hashes. Saved plan contents are encrypted with AES-256-GCM before they are written to Postgres. A separate owner-only dashboard at `/admin.html` provides read-only access to account emails and saved plan details, including scores and restriction notes. The dashboard never displays password hashes or session tokens. Its access key must be configured as a private server secret and its session expires after 12 hours. Deleting an account removes its saved plans and sessions.

Saving is optional and is performed only after the user chooses **Save to my account**. A saved program contains its pathway, route, starting scores, generated schedule, and any restriction note included in the original profile. Event-search location is not saved. Data remains until the user deletes it or the database is removed. Sessions expire after 30 days. Email verification and password reset are not configured yet; users should use an email they control and keep their password safe.

The account API requires a Postgres `DATABASE_URL` and a `PLAN_ENCRYPTION_KEY` containing 64 hexadecimal characters. The private dashboard also requires a unique `ADMIN_ACCESS_KEY` with at least 32 bytes. Keep all three as server-side secrets; never publish them in this repository or in browser code. The database schema is created by the server at startup. The encryption key must remain available to decrypt saved programs; changing or losing it makes existing saved program contents unreadable.

### Supabase Free Postgres setup

The server uses the standard PostgreSQL `pg` driver, so a Supabase database works directly without exposing Supabase keys to the browser. Create a Supabase project, open **Connect**, and copy the **Session pooler** connection string (port `5432`). Replace its password placeholder, retain `sslmode=require`, and set the full string as `DATABASE_URL` in the Render service's private environment settings. Reserved characters in the password must be URL-encoded. Do not use a Supabase `anon` or `service_role` API key here. Also set `PLAN_ENCRYPTION_KEY` and `ADMIN_ACCESS_KEY` in Render; save changes and redeploy. Confirm `/health` reports both `accountsAvailable` and `adminConfigured` as `true`, then open `/admin.html` and sign in with the dashboard key.

Supabase Free currently includes a 500 MB database per project and can pause projects after a week of low activity. Plan for the database to need resuming if it is inactive; check Supabase's current plan limits before relying on it for continuous availability.

## Run the server

Requires Node.js 20 or newer. Install dependencies with `npm install`, configure `OPENAI_API_KEY`, `DATABASE_URL`, `PLAN_ENCRYPTION_KEY`, and `ADMIN_ACCESS_KEY` in the server environment, then run `npm start`. The server hosts the static pages and exposes `POST /api/generate-plan`, account endpoints under `/api/auth` and `/api/plans`, owner dashboard endpoints under `/api/admin`, and `GET /health`. It binds to `0.0.0.0` and uses the platform-provided `PORT` when deployed.

Never place service credentials in `index.html` or any other browser-delivered file. Set usage alerts or spending controls in the OpenAI platform.

## Deploy

The project uses GitHub Pages as its public entry point and Render for the canonical website and API. The Pages entry redirects to the Render site so account cookies remain same-origin. Render builds with `npm install --omit=dev` and starts with `npm start`. Configure `OPENAI_API_KEY`, `DATABASE_URL`, `PLAN_ENCRYPTION_KEY`, and `ADMIN_ACCESS_KEY` as Render secrets. Keep `index.html`, `admin.html`, `.nojekyll`, `robots.txt`, and `qualification-guides/` together at the published site root so the guide links work.

FIELDGUIDE is an independent preparation resource, not an official military recruiting or medical source. Verify current requirements with the relevant service and review AI-generated training with a qualified professional. The intensity reference is Jake Zweig’s publicly described hard/easy training cycles, recovery weeks, and tapering; FIELDGUIDE does not reproduce his paid program or claim identical weekly volume.
