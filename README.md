# Dropterest — Production-Grade Authentication Engine

A secure, modular, production-ready authentication and role-based access control (RBAC) foundation built with **Next.js App Router**, **Better Auth**, **Neon PostgreSQL**, and **Drizzle ORM**.

---

## 🛠 Technology Stack

- **Framework**: Next.js (App Router, Server Components & Actions)
- **Language**: TypeScript (Strict Mode)
- **Database**: Neon Serverless PostgreSQL (WebSocket pooler connection)
- **ORM & Migrations**: Drizzle ORM + Drizzle Kit
- **Authentication**: Better Auth (Secure HTTP-only cookies, password hashing, verification tokens)
- **Styling & UI**: Tailwind CSS, Motion (Framer Motion), Lucide React
- **Validation**: Zod + React Hook Form + `@hookform/resolvers`
- **Notifications**: Sonner Toast Manager
- **State Management**: TanStack Query (server state), Zustand (minimal client UI state)

---

## 📂 Project Architecture

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx            # Clean centered glassmorphic auth layout
│   │   ├── login/page.tsx        # Login with rate-limit protection & password toggle
│   │   ├── signup/page.tsx       # Signup with username validation & strength meter
│   │   ├── forgot-password/      # Anti-enumeration password reset request
│   │   ├── reset-password/       # Secure token-verified password update
│   │   └── verify-email/         # Token verification & resend rate-limited flow
│   ├── api/
│   │   └── auth/[...all]/        # Better Auth Route Handler endpoint
│   ├── dashboard/                # Protected user dashboard & session identity
│   ├── creator/                  # RBAC guarded creator portal (creator, admin, super_admin)
│   ├── admin/                    # RBAC guarded administration console (admin, super_admin)
│   ├── settings/                 # Account identity & security preferences
│   ├── layout.tsx                # Root layout with Sonner Toaster
│   └── globals.css
├── components/
│   └── auth/
│       └── logout-button.tsx     # Client signOut component
├── db/
│   ├── index.ts                  # Drizzle Neon client singleton
│   ├── migrate.ts                # Neon migration runner
│   ├── schema/
│   │   ├── auth.ts               # Better Auth tables (user, session, account, verification)
│   │   ├── profile.ts            # RBAC Profiles table with foreign key & unique constraints
│   │   └── index.ts              # Schema aggregator
│   └── migrations/               # SQL migration snapshots
├── lib/
│   ├── auth/
│   │   ├── auth.ts               # Better Auth server configuration with Drizzle adapter
│   │   └── auth-client.ts        # Better Auth client instance
│   ├── security/
│   │   ├── auth-guards.ts        # Server utilities: requireAuth(), requireRole(), requirePermission()
│   │   ├── rbac.ts               # Role definitions, hierarchy, and permissions matrix
│   │   └── rate-limit.ts         # In-memory / Redis-ready rate limiter abstraction
│   └── validation/
│       └── auth-schemas.ts       # Zod schemas for signup, login, password reset, etc.
└── middleware.ts                 # Edge route protection & session forwarding
```

---

## 🔒 Security Architecture

1. **Zero Client Trust**: Identities, sessions, and roles are resolved exclusively on the server through cryptographic session cookies and database lookups.
2. **Account Enumeration Protection**: Forgot-password endpoints return consistent generic responses regardless of email existence.
3. **Strict RBAC Guardrails**: Default public signups are strictly `viewer`. Privileged roles (`creator`, `business`, `moderator`, `finance`, `admin`, `super_admin`) cannot be injected via client payload.
4. **Credential Isolation**: Password hashing is delegated to Better Auth's native Scrypt/Argon2 algorithms. Passwords, hashes, and verification tokens are never logged or sent to the client.
5. **Rate Limiting**: Critical endpoints (signup, login, forgot-password, resend verification) are governed by the `checkRateLimit` abstraction (in-memory for local dev, Upstash Redis pluggable for multi-region prod).

---

## 👑 Role-Based Access Control (RBAC) Matrix

| Role | Hierarchy Level | Capabilities |
| :--- | :---: | :--- |
| `viewer` | 1 | Read public drops, manage personal profile |
| `creator` | 2 | Viewer rights + create drops, manage assets, access Creator Portal |
| `business` | 3 | Viewer rights + manage brand assets, access Business Portal |
| `moderator` | 4 | Moderate community content, flag violations, manage reports |
| `finance` | 5 | View financial analytics, manage billing & payouts |
| `admin` | 6 | Operational admin, user role promotion, system audits |
| `super_admin`| 7 | Full unconstrained platform governance & security configuration |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or Node 20+
- Neon PostgreSQL database instance

### 2. Environment Variables
Copy `.env.example` to `.env.local` and configure:
```bash
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-square-snow-zaxh2xtk-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="YOUR_32_CHAR_RANDOM_SECRET"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run Database Migrations
Generate and push schemas directly to Neon:
```bash
# Generate SQL migration file
npm run db:generate

# Execute migration against live Neon database
npm run db:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing the Authentication Flows

1. **Sign Up**: Navigate to `/signup`. Test username length/character validation, password strength meter, and terms acceptance.
2. **Email Verification**: Test `/verify-email` with token handling and resend email flow.
3. **Login**: Navigate to `/login`. Test invalid credential feedback and successful sign-in.
4. **Session Guard**: Navigate to `/dashboard` directly without logging in; verify automatic redirect to `/login`.
5. **RBAC Guarding**:
   - Access `/creator` as a standard `viewer` → Access restricted screen shown.
   - Access `/admin` as a non-admin → Access restricted screen shown.
6. **Password Reset**: Navigate to `/forgot-password`, trigger reset email, and visit `/reset-password?token=...` to update password.
7. **Sign Out**: Click "Sign out" from the top navigation to destroy the active session cookie.
