# Running Documaxxer

Documaxxer is a Next.js resume and CV builder with Auth.js authentication and a Prisma SQLite database for local development.

## Prerequisites

- Node.js 18.18 or newer
- npm
- Git

Check your installed versions:

```powershell
node --version
npm --version
```

## First-Time Setup

From the project root:

```powershell
npm install
Copy-Item .env.example .env
```

Open `.env` and set a private `AUTH_SECRET`. For local development, the existing value is usable, but replace it before sharing or deploying the application.

A fresh local environment uses SQLite:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-long-random-secret"
AUTH_URL="http://localhost:3000"
```

Generate a secret with OpenSSL when it is available:

```powershell
openssl rand -base64 32
```

## Database Setup

Apply the checked-in Prisma migrations:

```powershell
npx prisma migrate dev
```

This creates `prisma/dev.db` locally and applies the schema for users, sessions, profiles, templates, and saved documents.

Regenerate the Prisma client after changing `prisma/schema.prisma`:

```powershell
npx prisma generate
```

To inspect the local database in Prisma Studio:

```powershell
npx prisma studio
```

## Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Important routes:

- `/` - landing page
- `/signup` - create an account
- `/login` - sign in
- `/dashboard` - authenticated dashboard
- `/create` - choose a document type
- `/templates` - choose a template
- `/builder` - document builder

The development server reloads automatically when source files change. Stop it with `Ctrl+C`.

## Verify the Project

Run linting:

```powershell
npm run lint
```

Create a production build:

```powershell
npm run build
```

Run the production build:

```powershell
npm run start
```

The production server is available at [http://localhost:3000](http://localhost:3000) unless another port is configured.

## Authentication Notes

- Signup is handled by `POST /api/auth/signup`.
- Login uses Auth.js credentials authentication through `/api/auth/[...nextauth]`.
- Saved documents use authenticated `GET`/`POST /api/documents` and `GET`/`PATCH`/`DELETE /api/documents/:id` endpoints.
- Unauthenticated requests to `/dashboard` redirect to `/login`.
- Email addresses are normalized to lowercase during signup and login.
- Passwords are stored as bcrypt hashes, never as plain text.

## Reset Local Database

To reset the local SQLite database during development:

```powershell
Remove-Item prisma/dev.db -Force
npx prisma migrate dev
```

This deletes local users and data. Do not run it against a shared or production database.

## Troubleshooting

### Prisma client or runtime errors

Regenerate the client and retry the build:

```powershell
npx prisma generate
npm run build
```

The project uses matching Prisma `6.19.0` packages. Do not upgrade only `prisma` or only `@prisma/client`.

### Port 3000 is already in use

Run Next.js on another port:

```powershell
npm run dev -- -p 3001
```

Then update `AUTH_URL` in `.env` to match the selected port and restart the server.

### Authentication does not work

Confirm that:

1. `.env` exists in the project root.
2. `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL` are set.
3. The database migration has been applied.
4. The development server was restarted after changing `.env`.

## Development Workflow

1. Start the database state with `npx prisma migrate dev` when needed.
2. Start the app with `npm run dev`.
3. Make and test changes locally.
4. Run `npm run lint` and `npm run build` before considering the change complete.
5. Keep `.env` and local database files out of version control.
