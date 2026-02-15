# Better Email Demo

A working demo app showing how to integrate `@repo/better-email` with [Better Auth](https://www.better-auth.com/).

It wires up all 8 email types (verification, reset password, magic link, OTP, organization invitation, change email, delete account, two-factor OTP) using React Email templates and the Nuntly provider.

## What's inside

- **Next.js** app with sign-in, sign-up, forgot password, dashboard, and organization pages
- **Better Auth** with email/password, organization, and two-factor plugins
- **Better Email** with `ReactEmailRenderer` (8 templates) and `NuntlyProvider`
- **SQLite** database via `better-sqlite3` + Drizzle ORM (zero infrastructure)

## Getting started

### 1. Install dependencies

```bash
npm install
# or
pnpm install
# or
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
NUNTLY_API_KEY=ntly_xxxxxxxxxxxx
EMAIL_FROM=Demo <noreply@demo.example.com>
BETTER_AUTH_SECRET=change-me
BETTER_AUTH_URL=http://localhost:3100
NEXT_PUBLIC_BASE_URL=http://localhost:3100
ENABLE_MAGIC_LINK=false
ENABLE_EMAIL_OTP=false
```

### 3. Start dev server

```bash
npm run dev
# or
pnpm dev
# or
bun run dev
```

The `predev` script automatically runs `drizzle-kit push` to create the SQLite database and tables before starting. The app runs on [http://localhost:3100](http://localhost:3100).

## Database

The demo uses a local `demo.db` SQLite file. It is created automatically on first run.

### Browse with Drizzle Studio

```bash
npm run db:studio
```

### Query from the command line

```bash
# List all tables
sqlite3 demo.db ".tables"

# Show table schema
sqlite3 demo.db ".schema user"

# List users
sqlite3 demo.db "SELECT id, name, email, emailVerified FROM user;"

# List sessions
sqlite3 demo.db "SELECT id, userId, datetime(expiresAt, 'unixepoch') as expires FROM session;"

# List organizations
sqlite3 demo.db "SELECT id, name, slug FROM organization;"

# List invitations
sqlite3 demo.db "SELECT id, email, role, status FROM invitation;"

# Reset the database
rm demo.db && npm run db:push
```

## Available scripts

| Script | Description |
|---|---|
| `dev` | Start dev server (auto-pushes schema first) |
| `build` | Build for production |
| `start` | Start production server |
| `db:push` | Create/sync database tables from Drizzle schema |
| `db:generate` | Generate SQL migration files |
| `db:migrate` | Run pending migrations |
| `db:studio` | Open Drizzle Studio to browse data |
