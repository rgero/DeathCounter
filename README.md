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

The server and its Docker image require Node.js 22 or newer. `KEY_QUERY_PASSKEY` must be configured; the server does not use a default key.

## Migrate existing encrypted data

This release replaces CryptoJS with native Web Crypto. The app and WebSocket server accept **only the new format**. Do not deploy the new app against unconverted data. No table schema change is normally needed, but confirm encrypted columns can hold longer strings before applying the migration.

The offline converter is `DeathCounter/scripts/migrate-encryption.mjs`. It converts `name`, `description`, and `entityList[].name` in `death_counters`. It preserves IDs, ownership, counters, list tokens, shared links, and other metadata. Empty strings, null descriptions, and absent optional fields are preserved. Plaintext imports/exports do not need conversion.

### Prepare and rehearse

Use Node.js 22 or newer. Install dependencies with `npm ci` in `DeathCounter/`. Rehearse on a copy of the database, including a backup restore, before production. Stop if the dry-run reports damaged data or an incorrect key. Legacy AES-CBC has no authentication tag: even successful legacy decryption cannot reliably prove the original key or data was correct. Review representative converted data in the rehearsal.

In `DeathCounter/`, create a local `.env.migration` containing the following variables. This filename is ignored by Git. Set actual values locally, never in source control or chat:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
LEGACY_SECRET_KEY=the-exact-old-VITE_SECRET_KEY
TARGET_SECRET_KEY=the-VITE_SECRET_KEY-for-the-new-build
```

The old and target keys may be the same. `TARGET_SECRET_KEY` must match the new frontend's `VITE_SECRET_KEY`. Preserve the legacy key securely for recovery. Never put the service-role key into any `VITE_*` variable: those variables are public browser configuration. Restrict local file access to your user, particularly on Windows where POSIX file modes are not sufficient. The service-role key bypasses row-level security so the converter can process every owner's rows.

From `DeathCounter/`, run a dry-run (no writes):

```sh
node --env-file=.env.migration scripts/migrate-encryption.mjs
```

The dry-run scans every page, validates old and already-converted values, and checks new encryption round-trips. Unknown formats, malformed records, wrong target keys, or failed legacy decryption stop the run with a nonzero exit code. It does not print plaintext, ciphertext, or keys.

### Production cutover

1. Prepare and test both new builds before starting maintenance. Keep the old builds available for rollback.
2. Stop **all** database writers, including old browser sessions and imports. Merely hiding the UI is insufficient; enforce maintenance at your deployment/access layer. Keep writes disabled until verification and deployment finish.
3. Take a complete Supabase backup and confirm you can restore it. The converter's journal is not a full database backup.
4. Repeat the dry-run with the production keys, then apply:

```sh
node --env-file=.env.migration scripts/migrate-encryption.mjs --apply --confirm-backup --writers-stopped --journal migration-backup-2026-11-18.jsonl
```

The apply pass validates the full table before any updates. It creates a new journal exclusively (existing files are never overwritten), flushes original and replacement **encrypted** columns before each update, and rereads persisted ciphertext. It does not store decrypted plaintext. Keep journals private and outside cloud-synced/public directories. Only filenames matching `migration-backup-*.jsonl` are ignored automatically.

5. Verify independently with no writes:

```sh
node --env-file=.env.migration scripts/migrate-encryption.mjs --verify-only
```

Verification must report every row in the new format or empty. `LEGACY_SECRET_KEY` is not needed for this check. New-format values are authenticated with `TARGET_SECRET_KEY`, not merely identified by a prefix.

6. Deploy the new frontend and WebSocket server together. Keep `VITE_WS_AUTH_TOKEN` equal to `KEY_QUERY_PASSKEY`. Require browsers to reload the new build before writes resume so cached legacy JavaScript cannot store old ciphertext again.
7. Check owner lists, existing shared links, create/edit/import/export, and socket synchronization. Recopy each list's WebSocket auth token from the token modal into companion clients: previously copied CryptoJS auth tokens are no longer accepted. The plaintext game token and shared-link URL do not change. Clients passing the token as an opaque string only need its new value; clients parsing/decrypting it need a protocol update.
8. Reopen writes only after these checks pass. Remove the local service-role credential file when finished and retain protected backups according to your recovery policy.

### Failure and rollback

On any failure, keep maintenance enabled. Conversion is per row, not one table-wide transaction. A rerun verifies and skips already-converted fields, allowing mixed old/new rows to resume safely. Use a **new journal filename** for each apply attempt and retain every previous journal.

To roll back before reopening writes, restore the full database backup and redeploy **both old builds** before allowing clients back in. Journals also contain per-row encrypted `before`/`after` columns for controlled manual recovery by ID, but there is no automatic journal-restore command. Never blindly overwrite a row that no longer matches the journal's `after` values. If new writes have already resumed, restoring an old backup would lose them: first reconcile those writes as part of recovery.

### Ciphertext contract

Version 1 is `dc:v1:` followed by canonical base64 of `salt (16 bytes) | IV (12 bytes) | AES-GCM ciphertext | tag (16 bytes)`. Plaintext is UTF-8. Keys are AES-256 derived with PBKDF2-HMAC-SHA256, 600,000 iterations. The PBKDF2 salt is the stored salt concatenated with UTF-8 `dc:v1:database` or `dc:v1:socket`; that same purpose string is authenticated additional data. Each encryption operation has a random salt, and each field has a fresh random IV. A list operation shares its derived key across fields to avoid a PBKDF2 computation per field. Fields are limited to 1 MiB of UTF-8 plaintext; server auth-token envelopes are limited to 4,096 characters. Future incompatible changes require a new version.

The offline legacy decoder alone understands CryptoJS's base64 OpenSSL `Salted__` format: 8-byte salt, AES-256-CBC/PKCS7, EVP_BytesToKey MD5 with one iteration deriving both key and IV. Neither deployed runtime has a legacy fallback or a CryptoJS dependency.

Browser Web Crypto requires HTTPS or localhost. This change adds authenticated encryption but **does not make frontend keys secret**: Vite includes them in the browser bundle. Supabase authorization must still rely on appropriate authentication and RLS policies; this is not end-to-end encryption or a redesign of WebSocket authorization.

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
npm run test:crypto
```

From `WebSocket/Server/`:

```sh
npm run build
npm test
```

`test:crypto` uses Node's built-in runner for codec and offline migration tests, including a frozen fixture generated by CryptoJS before its removal. Server tests check browser/server interoperability and asynchronous message authentication. No tests connect to a real database; a rehearsal against your own staging database is required before production conversion.

## Companion key listener

The key listener is maintained separately: [Death Counter Key Listener](https://github.com/rgero/Death-Counter-Key-Listener). Configure it to connect to the same WebSocket server and use the active death list's token.
