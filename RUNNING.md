# Run Documaxxer

## First time only

Open PowerShell in the project folder and run:

```powershell
npm install
Copy-Item .env.example .env
npx prisma migrate dev
```

The migration creates the tables in your Neon PostgreSQL database.

## Start the app

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

Create an account at `/signup`, then sign in at `/login`.

## Useful commands

Check the code:

```powershell
npm run lint
```

Create a production build:

```powershell
npm run build
```

Stop the app with `Ctrl+C`.

## If the database is reset

Run:

```powershell
npx prisma migrate dev
```

To reset the development database:

```powershell
npx prisma migrate reset
```

This deletes all development accounts and documents, then reapplies the migrations.

## If port 3000 is busy

```powershell
npm run dev -- -p 3001
```

Then open http://localhost:3001.

## Environment file

The `.env` file must be in the project root and contain:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
AUTH_SECRET="your-secret"
AUTH_URL="http://localhost:3000"
```

Do not commit `.env`.
