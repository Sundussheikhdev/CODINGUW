# CODINGUW - Investor Readiness Platform

A complete vertical slice of an investor readiness platform built with Next.js 14 and Fastify, featuring company onboarding, document management, investability scoring, and scheduling capabilities. This project demonstrates a full-stack application with modern web technologies and best practices.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Environment Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Sundussheikhdev/CODINGUW.git
cd CODINGUW
npm install
```

2. **Set up environment variables:**
```bash
# Backend
cp apps/backend/env.example apps/backend/.env
# Edit apps/backend/.env with your database URL (default: file:./dev.db)
```

3. **Set up the database:**
```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

### Development

**Option 1: Run with Docker Compose (Recommended)**
```bash
docker-compose up -d
```

**Option 2: Run locally**
```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend  
cd apps/frontend
npm run dev
```

**Option 3: Run both with npm (from root)**
```bash
# Install concurrently first
npm install -g concurrently

# Then run both services
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 📋 Features

### ✅ Core Features (All Implemented)
- **Onboarding Wizard:** Multi-step company setup with KYC and financial linking
- **Dashboard:** Company profile with status badges and investability score
- **Data Room:** Secure document upload and management (PDF, PPTX, XLSX)
- **Investability Scoring:** Automated scoring based on KYC, financials, docs, and revenue
- **Scheduling:** Cal.com integration for investor calls
- **Notifications:** Real-time in-app notifications for key events
- **File Upload:** Secure file handling with size limits and type validation

### 🔧 Technical Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Fastify + TypeScript + Prisma + SQLite
- **Validation:** Zod schemas on both client and server
- **Security:** Helmet, CORS, rate limiting, file upload restrictions
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS with responsive design

## 🏗️ Project Structure

```
CODINGUW/
├── README.md                    # This file
├── package.json                 # Root package management
├── docker-compose.yml          # Container orchestration
├── docs/
│   └── DECISIONS.md            # Architecture decisions
├── apps/
│   ├── frontend/               # Next.js 14 app
│   │   ├── src/
│   │   │   ├── app/            # App router pages
│   │   │   │   ├── layout.tsx  # Root layout
│   │   │   │   └── page.tsx    # Main page
│   │   │   ├── components/     # React components
│   │   │   │   ├── OnboardingWizard.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── DataRoom.tsx
│   │   │   │   ├── InvestabilityScoreCard.tsx
│   │   │   │   ├── Notifications.tsx
│   │   │   │   ├── Scheduling.tsx
│   │   │   │   └── CompanyProfile.tsx
│   │   │   ├── lib/
│   │   │   │   └── api.ts      # API client
│   │   │   └── types/
│   │   │       └── index.ts    # TypeScript types
│   │   ├── public/             # Static assets
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── Dockerfile
│   └── backend/                # Fastify API
│       ├── src/
│       │   ├── routes/         # API endpoints
│       │   │   ├── company.ts
│       │   │   ├── kyc.ts
│       │   │   ├── financials.ts
│       │   │   ├── files.ts
│       │   │   ├── score.ts
│       │   │   └── notifications.ts
│       │   ├── types/
│       │   │   └── schemas.ts  # Validation schemas
│       │   ├── tests/
│       │   │   └── api.test.ts # API tests
│       │   └── index.ts        # Main server file
│       ├── prisma/             # Database schema & migrations
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── uploads/            # File storage
│       ├── package.json
│       └── Dockerfile
```

## 🔌 API Endpoints

### Company Management
- `POST /api/company` - Create/update company
- `GET /api/company` - Get company details

### KYC & Financials
- `POST /api/kyc/verify` - Verify KYC (mock/sandbox)
- `POST /api/financials/link` - Link financials (mock Plaid)

### Documents
- `POST /api/files` - Upload document (multipart/form-data)
- `GET /api/files` - List documents

### Scoring & Notifications
- `GET /api/score` - Get investability score
- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## 🧪 Testing

Run the test suite:
```bash
cd apps/backend
npm test
```

## 📊 Investability Scoring

The platform calculates an investability score (0-100) based on:
- **KYC Verified:** +30 points
- **Financials Linked:** +20 points  
- **Documents Uploaded:** +25 points (if ≥3 docs)
- **Revenue Scale:** +25 points (scaled 0-$1M → 0-25 points)

## 🔒 Security Features

- Input validation with Zod schemas
- File upload restrictions (PDF, PPTX, XLSX only)
- File size limits (10MB max)
- Rate limiting on write endpoints
- CORS configuration
- Security headers with Helmet
- Parameter validation for all routes

## 🎯 User Flow

1. **Onboarding:** User enters company details, completes KYC, links financials
2. **Dashboard:** View company profile, status badges, and investability score
3. **Data Room:** Upload and manage documents (pitch deck, financials, etc.)
4. **Notifications:** Receive real-time updates for key actions
5. **Scheduling:** Book calls with investment team via Cal.com

## 🚀 Deployment

The CODINGUW application is containerized and ready for deployment:

```bash
# Build and run with Docker
docker-compose up --build

# Or deploy to cloud platforms
# Backend: Deploy to Render/Fly.io
# Frontend: Deploy to Vercel
```

### GitHub Repository
- **URL**: https://github.com/Sundussheikhdev/CODINGUW
- **Branch**: `main`
- **Status**: Active development

## 📝 Development Notes

- All API endpoints are validated with Zod schemas
- TypeScript is used throughout for type safety
- The database uses CUID for all primary keys
- File uploads are stored in `/uploads` directory
- Notifications are created for key user actions
- Mock integrations for KYC (Persona) and financials (Plaid)
- Clean, responsive UI with Tailwind CSS

## 🏆 Project Status

**✅ COMPLETE** - All required features implemented and working:

- [x] Onboarding wizard with 3 steps
- [x] Company dashboard with status badges
- [x] Document upload and management
- [x] Investability scoring algorithm
- [x] In-app notifications system
- [x] Cal.com scheduling integration
- [x] API validation and security
- [x] Database schema and migrations
- [x] TypeScript throughout
- [x] Responsive design
- [x] Docker containerization
- [x] Comprehensive documentation

## 📝 About This Project

This is a **CODINGUW** project - a complete vertical slice of an investor readiness platform built as a demonstration of full-stack development capabilities. The application showcases modern web development practices including:

- **Frontend**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Backend**: Fastify with TypeScript, Prisma ORM, and SQLite
- **Architecture**: Monorepo structure with shared types and validation
- **Security**: Input validation, file upload restrictions, and rate limiting
- **Testing**: API tests with Vitest
- **Deployment**: Docker containerization ready for production

The project demonstrates a complete user flow from company onboarding through document management to investor scheduling, with real-time notifications and automated scoring.

---

**Repository:** https://github.com/Sundussheikhdev/CODINGUW  
**Status:** ✅ Complete vertical slice ready for demo  
**Build Status:** ✅ All tests passing, no linting errors  
**Deployment Ready:** ✅ Docker containers configured