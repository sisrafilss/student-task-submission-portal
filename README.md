# Student Task & Submission Portal

A modern, scalable full-stack web application designed for managing student assignments, task submissions, and automated evaluation workflows.

---

## 🏗 Architecture

The project is structured as a high-performance **Monorepo** managed by **Turborepo** and **pnpm workspaces**, consolidating both the client application and API services in a single repository.

### Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui (Default Port: `3002`)
- **Backend:** Express.js 5, TypeScript, Prisma ORM 7 (`@prisma/adapter-pg`), PostgreSQL, Zod (Default Port: `5002`)
- **Database:** PostgreSQL (Compatible with Local PostgreSQL and Neon Serverless Cloud)
- **Deployment Strategy:** Vercel deployment (Serverless Express API bundle via `esbuild` + Next.js App Router)
- **Package Manager:** `pnpm` (Strictly Enforced)

---

## 📂 Folder Structure

```text
student-task-submission-portal/
├── backend/            # Express.js REST API & Prisma ORM
│   ├── prisma/         # Prisma configuration & schema definitions
│   ├── src/            # Controllers, routes, middlewares, services, and shared utilities
│   ├── .env.example    # Backend environment variable template
│   ├── vercel.json     # Serverless rewrite configuration
│   └── package.json
├── frontend/           # Next.js App Router & UI components
│   ├── public/         # Static assets and icons
│   ├── src/            # Pages, layouts, shadcn/ui components, and service abstractions
│   ├── .env.example    # Frontend environment variable template
│   └── package.json
├── package.json        # Turborepo root scripts
├── pnpm-workspace.yaml # Monorepo workspace mapping
├── turbo.json          # Turborepo task pipeline configuration
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **pnpm:** v10.0.0 or higher
- **PostgreSQL:** Local PostgreSQL (v15+) or Neon Serverless PostgreSQL

### 1. Clone the Repository

```bash
git clone git@github.com:sisrafilss/student-task-submission-portal.git
cd student-task-submission-portal
```

### 2. Install Dependencies

Install all dependencies across both frontend and backend using `pnpm`:

```bash
pnpm install
```

### 3. Environment Configuration

#### Backend Configuration:
Copy `backend/.env.example` to `backend/.env` and update your PostgreSQL connection settings:

```bash
cp backend/.env.example backend/.env
```

```env
NODE_ENV=development
PORT=5002

# Local PostgreSQL Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_submission_portal?schema=public"
DATABASE_URL_UNPOOLED="postgresql://postgres:postgres@localhost:5432/student_submission_portal?schema=public"

# Neon Cloud Database (Production)
# DATABASE_URL="postgresql://neondb_owner:dummy@ep-dummy-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
# DATABASE_URL_UNPOOLED="postgresql://neondb_owner:dummy@ep-dummy.us-east-2.aws.neon.tech/neondb?sslmode=require"

JWT_ACCESS_SECRET="your_jwt_secret_key"
JWT_ACCESS_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=12
```

#### Frontend Configuration:
Copy `frontend/.env.example` to `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

```env
PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:5002/api/v1
```

### 4. Database Setup & Seeding

Synchronize your database schema and seed initial sample data:

```bash
# Push schema to PostgreSQL
pnpm --filter backend exec prisma db push

# Seed initial admin and student records
pnpm --filter backend seed
```

### 5. Start Development Servers

Run both the frontend and backend concurrently with Turborepo:

```bash
pnpm dev
```

- **Frontend Application:** [http://localhost:3002](http://localhost:3002)
- **Backend API:** [http://localhost:5002](http://localhost:5002)

Alternatively, run each service independently:
- Run Frontend only: `pnpm dev:frontend`
- Run Backend only: `pnpm dev:backend`

### 6. Production Build

To generate optimized production builds for both packages:

```bash
pnpm build
```

---

## ✨ Features & Modules

### Monorepo Architecture (`main`)

- **Unified Monorepo Orchestration**:
  - Turborepo configuration (`turbo.json`) enabling fast, parallel builds and development workflows.
  - Independent dependency scopes managed via `pnpm-workspace.yaml`.

- **Modular Express 5 & Prisma 7 Backend**:
  - **Prisma 7 Driver Adapter Architecture**: Modernized database integration utilizing `@prisma/adapter-pg` and centralized `prisma.config.ts`.
  - **Connection Pooling**: Configured runtime connection (`DATABASE_URL`) alongside direct migration connection (`DATABASE_URL_UNPOOLED`).
  - **Feature-Isolated Modules**: Layered Controller-Service-Route-Validation architecture.
  - **Centralized Error Handling**: Uniform response structure managed through `catchAsync`, `ApiError`, and `globalErrorHandler`.
  - **Serverless Ready**: Dual-mode entry with `server.ts` for local node processes and `serverless.ts` bundled with `esbuild` for Vercel deployment.

- **Next.js 16 App Router Frontend**:
  - Built with React 19, TypeScript, and modern Tailwind CSS.
  - Standardized component library powered by `shadcn/ui`.
  - Abstracted data access layer utilizing `serverFetch` (`src/lib/server-fetch.ts`) with strict Zod schema validation.
  - Fully responsive layout across all device viewports (Desktop, Tablet, Mobile) with adaptive touch-friendly interfaces.

---

## 📡 API Endpoints

### Health Check

```bash
# Verify API operational status
curl -i http://localhost:5002/api/v1/health
```

*Response:*
```json
{
  "success": true,
  "message": "Student Submission Portal Backend API is healthy and operational!",
  "data": {
    "uptime": 14.03,
    "environment": "development"
  }
}
```
