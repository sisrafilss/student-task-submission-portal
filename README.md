# Student Task & Submission Portal

A modern, scalable full-stack web application designed for managing student assignments, task submissions, automated mentor distribution, and comprehensive grading evaluation workflows.

---

## 🌐 Live Deployment & Overview Video

- **Live Application:** [https://student-submission-portal-frontend.vercel.app/login](https://student-submission-portal-frontend.vercel.app/login)
- **Project Overview Video:** [https://youtu.be/9xjWa3KY4xQ](https://youtu.be/9xjWa3KY4xQ)
- **Deployment Platform:** Vercel (Next.js App Router Frontend + Serverless Express REST API)

### 🔑 Demo Login Credentials

For quick live testing, one-click demo login buttons are available on the login page:

| Role | Email | Password | Primary Permissions |
|---|---|---|---|
| **Super Admin** | `admin@gmail.com` | `123456` | Platform metrics, user management (students/mentors), batches, assignments, and analytics. |
| **Active Mentor** | `mentor@gmail.com` | `123456` | Review assigned submissions, dynamic rubric grading, feedback, batch overview. |
| **Student (Batch 01)** | `student@gmail.com` | `123456` | View batch assignments, standalone & modal submission portals, track marks & feedback. |

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

# Seed initial admin, mentor, and student records
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

### 1. Student Standalone Submission Portal & Robust Forms (`main`)

- **Standalone Portal Route (`/student/submit`)**:
  - Dedicated submission page in Next.js App Router with Suspense boundary and preselection query parameter (`?assignmentId=...`).
  - Student sidebar navigation includes direct one-click link to "Submit Project" (`FolderUp` icon).
- **Visible & Mandatory `Project Name` Field**:
  - Both the standalone form (`StudentStandaloneSubmissionForm`) and modal dialog (`StudentSubmissionDialog`) feature a visible `Project Name *` input field.
  - Complete form fields: **Project Name**, **Git Repository URL**, **Live Deployment URL**, and **Project Description**.
- **Duplicate Submission Prevention Guard**:
  - Real-time client-side detection: selecting an already submitted assignment triggers a warning banner (`SubmissionEligibilityAlert`) and immediately disables the submit button.
  - Backend enforcement: queries database unique constraint (`assignmentId_studentId`) and returns `409 Conflict`.
- **Spam Rate-Limiting Protection**:
  - In-memory rate limiting cooldown window (60 seconds) prevents rapid submissions.
  - Interactive countdown badge (`SubmissionRateLimitBadge`) informs the student of remaining cooldown seconds.
  - Backend service throws `429 Too Many Requests` if submissions occur within the cooldown window.
- **Backend APIs**:
  - `POST /api/v1/submissions`: Submit deliverables with `assignmentId`, `projectName`, `repoUrl`, `liveUrl`, and `notes`.
  - `GET /api/v1/submissions/my-submissions`: Retrieve student's submission history with pagination and status filters.

---

### 2. Real Database Dynamic Dashboards (`main`)

- **Student Dashboard (`/student/dashboard`)**:
  - Fetches live database counts for active batch assignments, submitted projects, and cumulative average evaluation score.
  - Quick action links to assignments hub, submission history, and grades.
- **Mentor Dashboard (`/mentor/dashboard`)**:
  - Displays pending assigned submissions queue count, evaluated count for the current week, and active assigned batches.
- **Admin Dashboard (`/admin/dashboard`)**:
  - System-wide metric cards displaying total enrolled students, active teaching mentors, active assignment tracks, and lifetime platform submissions.
- **Backend APIs**:
  - `GET /api/v1/dashboard/student`: Aggregated metrics for the authenticated student.
  - `GET /api/v1/dashboard/mentor`: Evaluation metrics for the authenticated mentor.
  - `GET /api/v1/dashboard/admin`: System-wide counts and platform health statistics.

---

### 3. Fair Task Distribution & Round-Robin Engine (`main`)

- **Automated Mentor Allocation**:
  - When a student submits an assignment, the distribution engine calculates active mentor quotas and automatically assigns the submission using atomic database operations.
  - Prevents mentor over-allocation and maintains balanced grading queues across the teaching staff.
- **Dynamic Quota Adjustment**:
  - Admins can configure custom per-mentor capacity (`maxPerMentor`) and reassign quotas per assignment track.

---

### 4. Interactive Assignment & Batch Management (`main`)

- **Batch Management (`/admin/batches`)**:
  - Manage course tracks, batch codes, start/end schedules, and student enrollments.
- **Assignment Builder (`/admin/assignments`)**:
  - Create, edit, and delete assignments with deadlines, total marks, and dynamic grading rubrics.
  - Cascade deletion protection: safely cleans up associated submissions and mentor allocations.
- **Backend APIs**:
  - `POST /api/v1/assignments`: Create assignment with rubrics and mentor quotas.
  - `GET /api/v1/assignments`: List assignments with search and batch filtering.
  - `PATCH /api/v1/assignments/:id`: Update assignment details and rubrics.
  - `DELETE /api/v1/assignments/:id`: Remove assignment and cascade clean associations.

---

### 5. Mentor Evaluation Hub & Dynamic Rubrics (`main`)

- **Submissions Queue (`/mentor/submissions`)**:
  - Filter submissions by status (`PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`).
  - View student repository links, live demos, and notes.
- **Dynamic Rubric Scoring**:
  - Evaluators grade each rubric criterion individually; the system automatically calculates total marks and syncs with database records.
  - Requires constructive feedback and mandatory rejection justification for non-passing submissions.

---

### 6. User Management & Cloudinary Profile (`main`)

- **Role-Based Access Control (RBAC)**:
  - Multi-tier authorization supporting `ADMIN`, `INSTRUCTOR`, `MENTOR`, and `STUDENT` roles.
  - Route guards and middleware protection on both frontend (`proxyRouting`) and backend (`auth` middleware).
- **Cloudinary Avatar Upload (`/settings`)**:
  - Real-time profile photo upload to Cloudinary with automatic deletion of legacy assets to optimize storage.
  - Instant avatar synchronization across top navigation bar, dropdown menu, and sidebar profile cards.

---

## 📡 API Endpoints Overview

| Module | Method | Endpoint | Access Role | Description |
|---|---|---|---|---|
| **Health** | `GET` | `/api/v1/health` | Public | System status and uptime. |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate user and issue JWT tokens. |
| **Auth** | `POST` | `/api/v1/auth/refresh-token` | Public | Refresh expired access tokens. |
| **Auth** | `POST` | `/api/v1/auth/change-password` | Authenticated | Change user password and update activation state. |
| **Dashboard** | `GET` | `/api/v1/dashboard/student` | `STUDENT` | Student personalized dashboard metrics. |
| **Dashboard** | `GET` | `/api/v1/dashboard/mentor` | `MENTOR` | Mentor evaluation queue metrics. |
| **Dashboard** | `GET` | `/api/v1/dashboard/admin` | `ADMIN` | Platform administrative overview metrics. |
| **Assignments**| `GET` | `/api/v1/assignments` | `ADMIN`, `MENTOR` | Filterable assignment list. |
| **Assignments**| `GET` | `/api/v1/assignments/my-batch`| `STUDENT` | Assignments belonging to student's batch. |
| **Assignments**| `POST`| `/api/v1/assignments` | `ADMIN` | Create assignment with rubrics & quotas. |
| **Assignments**| `PATCH`| `/api/v1/assignments/:id` | `ADMIN` | Update assignment details. |
| **Assignments**| `DELETE`| `/api/v1/assignments/:id`| `ADMIN` | Cascade delete assignment. |
| **Submissions**| `POST`| `/api/v1/submissions` | `STUDENT` | Submit project deliverables (Rate-limited). |
| **Submissions**| `GET` | `/api/v1/submissions/my-submissions` | `STUDENT` | Student submission history. |
| **Submissions**| `GET` | `/api/v1/submissions/mentor-queue` | `MENTOR` | Assigned submissions for mentor grading. |
| **Submissions**| `POST`| `/api/v1/submissions/:id/evaluate` | `MENTOR` | Grade submission with rubric breakdown. |
| **Batches** | `GET` | `/api/v1/batches` | `ADMIN`, `MENTOR` | List all academic batches. |
| **Batches** | `POST`| `/api/v1/batches` | `ADMIN` | Create new batch. |
| **Users** | `GET` | `/api/v1/users/students` | `ADMIN` | Manage student accounts. |
| **Users** | `GET` | `/api/v1/users/mentors` | `ADMIN` | Manage mentor accounts. |

---

## 🔍 How to Verify the Features

### 1. Verify via Browser

1. Open the application at [http://localhost:3002](http://localhost:3002) (or the [Live Demo](https://student-submission-portal-frontend.vercel.app/login)).
2. **Student Submission Flow**:
   - Log in using **Student Demo**.
   - Notice the **"Submit Project"** item in the sidebar navigation (`/student/submit`).
   - Click the link to open the Standalone Submission Portal.
   - Enter your **Project Name**, **GitHub URL**, **Live Link**, and **Description**.
   - Submit the project and observe the 60-second cooldown timer. Attempting to submit again immediately will display the cooldown badge.
   - Select an already submitted assignment from the dropdown and observe the **"Already Submitted"** warning with the button disabled.
3. **Mentor Evaluation Flow**:
   - Log in using **Mentor Demo**.
   - Navigate to **Submissions Queue** (`/mentor/submissions`).
   - Click on an assigned pending submission to open the Evaluation Dialog.
   - Input rubric scores and constructive feedback, then click **Approve** or **Reject**.
4. **Admin Dashboard & System Flow**:
   - Log in using **Admin Demo**.
   - Review live metric cards on `/admin/dashboard`.
   - Navigate to **Assignments** (`/admin/assignments`) to create or inspect batch assignments.

---

### 2. Verify Backend APIs via curl

#### Step 1: Obtain Access Token
```bash
ADMIN_TOKEN=$(curl -s http://localhost:5002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123456"}' | jq -r '.data.accessToken')
```

#### Step 2: Fetch System Dashboard Metrics
```bash
curl -s http://localhost:5002/api/v1/dashboard/admin \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
```

#### Step 3: Create Assignment with Rubrics
```bash
curl -s -X POST http://localhost:5002/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Assignment 03 - Full Stack Store",
    "description": "Build an e-commerce platform with Next.js and Prisma.",
    "batchId": "e70cc949-4119-4aca-be63-97396aea664a",
    "deadline": "2026-11-20T23:59:59.000Z",
    "totalMarks": 60,
    "maxPerMentor": 10,
    "rubrics": [
      { "criterion": "Responsive UI", "maxMarks": 30 },
      { "criterion": "Authentication & Database", "maxMarks": 30 }
    ]
  }' | jq .
```
