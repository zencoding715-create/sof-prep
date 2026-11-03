# FIELDGUIDE — Special Warfare Prep

FIELDGUIDE is a public preparation website with pathway-specific score comparisons and an AI-generated, week-by-week training course. The front end remains a static GitHub Pages site; plan generation runs through the server-side API in `server.js`.

## AI plan API

The browser sends only the selected pathway and service route, fitness scores and their supplied comparison targets, training experience, availability, equipment, pool access, sports/prep background, focus, and an optional restriction note. It does not send the user's name, age, or event-search location. The server forwards that profile to the OpenAI Responses API with `store: false`; the app does not persist plan requests or results. OpenAI's standard abuse-monitoring logs may still retain prompts and responses for up to 30 days, with legal and safety exceptions. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).

Never put an API key in `index.html` or another browser-delivered file. Set `OPENAI_API_KEY` in the Render service's environment settings. Optional settings are `OPENAI_MODEL` (defaults to `gpt-6-astra`) and `ALLOWED_ORIGINS` (defaults to the GitHub Pages origin). The public API is rate-limited to five plan requests per IP per hour. Set usage alerts or spending controls in the OpenAI platform; provider usage may incur charges.

## Run the server

Requires Node.js 20 or newer. Set `OPENAI_API_KEY` in the server environment, then run `npm start`. The server hosts the static pages and exposes `POST /api/generate-plan` plus `GET /health`. It binds to `0.0.0.0` and uses the platform-provided `PORT` when deployed.

## Deploy

The project is connected to GitHub Pages for the public site and Render for the API server. Render builds with `npm install --omit=dev` and starts with `npm start`. Configure `OPENAI_API_KEY` as a Render secret. Keep `index.html`, `.nojekyll`, `robots.txt`, and `qualification-guides/` together at the published site root so the guide links work.

FIELDGUIDE is an independent preparation resource, not an official military recruiting or medical source. Verify current requirements with the relevant service and review AI-generated training with a qualified professional.
