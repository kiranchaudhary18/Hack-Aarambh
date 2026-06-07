<div align="center">

# 🔐 Hack-Aarambh

### Fake Job Offer Detection System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.1-red?logo=nestjs)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.2-cyan?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-black?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*A comprehensive AI-powered system to detect fake job offers and suspicious recruitment messages*

</div>

---

## 📋 Overview

Hack-Aarambh is a full-stack application designed to protect job seekers from fraudulent recruitment schemes. The system analyzes job offers, email communications, and PDF documents using advanced pattern recognition and machine learning techniques to identify potential scams.

### 🎯 Key Features

- **🔍 Multi-Format Analysis** - Analyze plain text, emails, WhatsApp messages, and PDF offer letters
- **🤖 AI-Powered Detection** - Pattern-based fraud detection with ML integration capabilities
- **📊 Real-time Scoring** - Instant fraud probability scores with detailed red flag explanations
- **👤 User Authentication** - Secure JWT-based auth with password reset functionality
- **📈 Admin Dashboard** - Comprehensive analytics and flagged case monitoring
- **📜 Scan History** - Complete audit trail of all analyzed documents
- **🔔 Email Notifications** - Automated alerts for high-risk detections
- **🎨 Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS

---

## 🏗️ Architecture

### System Components

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React Frontend│◄────►│   NestJS API    │◄────►│   PostgreSQL    │
│   (TanStack)    │      │   (TypeScript)  │      │   (Prisma ORM)  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │  AI/ML Engine   │
                        │  (Python)       │
                        └─────────────────┘
```

### Tech Stack

#### Backend
- **Framework**: NestJS 11.1 (TypeScript)
- **Database**: PostgreSQL 16 with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **File Processing**: PDF parsing with pdf-parse
- **Email Service**: Nodemailer with SMTP
- **Queue**: Job queue for async processing
- **Testing**: Jest with Supertest

#### Frontend
- **Framework**: React 19.2 with TanStack Start
- **Styling**: Tailwind CSS 4.2
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query
- **Routing**: TanStack Router
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics
- **Animations**: GSAP

#### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 16+
- Python 3.9+ (for AI engine)
- Docker (optional)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/develper21/hack-aarambh
cd hack-aarambh
```

#### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Update .env with your configuration
# Required variables:
# - DATABASE_URL=postgresql://user:password@localhost:5432/hack_aarambh
# - JWT_SECRET=your-secret-key
# - SMTP_HOST=smtp.gmail.com
# - SMTP_USER=your-email@gmail.com
# - SMTP_PASS=your-app-password

# Setup database
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3001`

#### 3. Frontend Setup

```bash
cd webapp

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Update .env with:
# - VITE_API_URL=http://localhost:3001

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

#### 4. AI Engine Setup (Optional)

```bash
cd server/src/ai-engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train model (optional)
python training/train_model.py
```

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker compose up --build

# Services included:
# - Backend API (port 3001)
# - Frontend (port 5173)
# - PostgreSQL (port 5432)
```

### Individual Docker Builds

```bash
# Backend
cd server
docker build -t hack-aarambh-backend .
docker run -p 3001:3001 hack-aarambh-backend

# Frontend
cd webapp
docker build -t hack-aarambh-frontend .
docker run -p 5173:5173 hack-aarambh-frontend
```

---

## 📸 Screenshots

### Home Page

![Home Page](./docs/home.png)

*Landing page with overview and call-to-action*

---

## 🔧 API Documentation

### Authentication Endpoints

```typescript
POST   /api/auth/register      // Register new user
POST   /api/auth/login         // Login user
POST   /api/auth/logout        // Logout user
POST   /api/auth/forgot-password  // Request password reset
POST   /api/auth/reset-password   // Reset password
POST   /api/auth/verify-code      // Verify reset code
```

### Analysis Endpoints

```typescript
POST   /api/analysis/analyze   // Analyze job offer text
POST   /api/analysis/analyze-pdf  // Analyze PDF document
GET    /api/analysis/history   // Get user's scan history
GET    /api/analysis/:id       // Get specific analysis result
```

### Admin Endpoints

```typescript
GET    /api/admin/analytics    // Get platform analytics
GET    /api/admin/scans        // Get all scans (admin)
GET    /api/admin/users        // Get all users
PUT    /api/admin/users/:id    // Update user status
```

### User Endpoints

```typescript
GET    /api/users/profile      // Get user profile
PUT    /api/users/profile      // Update user profile
GET    /api/users/history      // Get user's analysis history
```

---

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run specific test file
npm test -- analysis.score.spec.ts
```

### Frontend Tests

```bash
cd webapp

# Run tests (if configured)
npm test
```

---

## 📁 Project Structure

```
hack-aarambh/
├── server/                          # Backend API
│   ├── src/
│   │   ├── admin/                   # Admin module
│   │   ├── ai-engine/               # AI/ML integration
│   │   ├── analysis/                # Job offer analysis
│   │   ├── auth/                    # Authentication module
│   │   ├── email/                   # Email service
│   │   ├── history/                 # Scan history
│   │   ├── queue/                   # Job queue
│   │   ├── users/                   # User management
│   │   ├── types/                   # TypeScript definitions
│   │   ├── app.module.ts            # Root module
│   │   └── main.ts                  # Entry point
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── .env.example                 # Environment template
│   ├── Dockerfile                  # Backend container
│   └── package.json
├── webapp/                          # Frontend application
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utilities and API client
│   │   ├── routes/                  # Page routes
│   │   │   ├── admin/               # Admin pages
│   │   │   ├── dashboard.tsx       # Main dashboard
│   │   │   ├── login.tsx           # Login page
│   │   │   ├── signup.tsx          # Signup page
│   │   │   └── ...                 # Other pages
│   │   ├── router.tsx               # Router configuration
│   │   └── server.ts                # Vite server
│   ├── public/                      # Static assets
│   ├── .env.example                 # Environment template
│   └── package.json
├── docs/                            # Documentation
│   ├── dashboard.png                # Dashboard screenshot
│   ├── analysis.png                 # Analysis screenshot
│   └── analytics.png                # Analytics screenshot
└── README.md                        # This file
```

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Class-validator and Zod schemas
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **CORS Configuration**: Configured cross-origin resource sharing
- **Rate Limiting**: API rate limiting (to be implemented)
- **Email Verification**: Optional email verification flow

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use meaningful commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database managed with [Prisma](https://www.prisma.io/)

---

## 📞 Support

For support, email support@hackaarambh.com or open an issue in the repository.

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star!**

Made with ❤️ by the TeamMax

</div>
