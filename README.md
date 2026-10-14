# The Death Counter

The Death Counter helps you track deaths across your games. Create a list for a game or playthrough, record deaths for bosses and other encounters, and share a read-only view with others.

The web app can be used on its own. An optional companion key listener can communicate with it through the WebSocket service.

![Skull background used by the app](DeathCounter/public/background.jpeg)

## Features

- Sign in with Google through Supabase.
- Create, switch between, edit, import, export, and remove death lists.
- Add encounters and record, increment, or decrement their death counts.
- View summary statistics for a death list.
- Share a read-only death list using a link.
- Optionally synchronize encounter names, counts, and completion events with a key listener over Socket.IO.

Imported lists are JSON files. [ExampleData.json](./ExampleData.json) shows the expected shape.

## Projects

| Directory | Purpose | Main technologies |
| --- | --- | --- |
| [`DeathCounter/`](./DeathCounter/) | Browser-based application | React, TypeScript, Vite, Material UI, TanStack Query, Supabase |
| [`WebSocket/Server/`](./WebSocket/Server/) | Express health endpoint and Socket.IO relay | Node.js, TypeScript, Express, Socket.IO, Zod |

The server validates and relays supported socket events between connected clients. It is only needed for key-listener synchronization; the web app's manual counters do not depend on it.

## Requirements

- Node.js 22 or newer
- npm
- A Supabase project for sign-in and death-list storage
- (Optional) Docker for the supplied container deployments

## Configure the web app

Create `DeathCounter/.env.local` with the following Vite variables:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_KEY` | Supabase publishable/anon key |
| `VITE_REDIRECT_URL` | OAuth callback destination; add it to the Supabase and Google OAuth allow-lists |
| `VITE_SECRET_KEY` | Key used by the app to encrypt death-list names, descriptions, and encounter names |
| `VITE_WSS_URL` | Socket.IO server URL, for example `http://localhost:8080` |
| `VITE_WS_AUTH_TOKEN` | Shared AES key used to authenticate socket messages; set it to the same value as the server's `KEY_QUERY_PASSKEY` |
| `VITE_FEEDBACK_URL` | Feedback endpoint URL |
| `VITE_FEEDBACK_KEY` | Authorization value for the feedback endpoint |

Vite variables are included in the browser build and are visible to users. Use only a Supabase publishable/anon key here, never a service-role key or another privileged credential. In particular, do not put a private GitHub token in `VITE_FEEDBACK_KEY`.

In Supabase, enable Google OAuth and create a `death_counters` table with the fields used by the app: `id`, `owner_id`, `name`, `description`, `currentlyActive`, `entityList`, and `token`. Configure authentication and row-level security policies for your deployment. The app encrypts list names, descriptions, and encounter names with `VITE_SECRET_KEY` before storing them.

## Configure the WebSocket server

Create `WebSocket/Server/.env` for local development:

```dotenv
KEY_QUERY_PASSKEY=replace-with-a-long-random-value
PORT=8080
```

Set the same `KEY_QUERY_PASSKEY` value in `VITE_WS_AUTH_TOKEN` in the web app's environment. For production, also set `NODE_ENV=production` and `ALLOWED_ORIGINS` to a comma-separated list of permitted web-app origins. Use `*` only if you intentionally want to allow every origin. The supplied server Compose configuration reads `WebSocket/Server/.env.production` and expects the service to listen on port `7654`.

The server's current Supabase dependency requires Node.js 22 or newer, but `WebSocket/Server/Dockerfile` still uses Node.js 18. Update that Dockerfile's base images to Node.js 22 before building a new server image.

## Run locally

Install and start the web app:

```sh
cd DeathCounter
npm ci
npm run dev
```

The Vite development server listens on `http://localhost:6200`.

In a second terminal, start the optional WebSocket service:

```sh
cd WebSocket/Server
npm ci
npm run dev
```

The service listens on port `8080` by default and exposes a health check at `/health`. Set `VITE_WSS_URL` to the service URL before starting the web app if you want socket synchronization.

## Build and test

From `DeathCounter/`:

```sh
npm run build
npm run lint
npm test
```

From `WebSocket/Server/`:

```sh
npm run build
```

## Companion key listener

The key listener is maintained separately: [Death Counter Key Listener](https://github.com/rgero/Death-Counter-Key-Listener). Configure it to connect to the same WebSocket server and use the active death list's token.
