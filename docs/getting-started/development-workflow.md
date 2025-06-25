# Mokin Recruit - Development Workflow

## 🏗️ Architecture Overview

- **Full-Stack Framework**: Next.js 15 + API Routes + TypeScript
- **Frontend**: Next.js + React 19 + TailwindCSS v4
- **Database**: Supabase (PostgreSQL) + Supabase Client Library
- **Development**: Docker Compose
- **Authentication**: Supabase Auth + JWT

## 🚀 Quick Start Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f client

# Stop all services
docker-compose down

# Rebuild client service
docker-compose build client
```

## 📁 Project Structure

```
mokin-recruit/
├── client/          # Next.js Full-Stack App (Frontend + API Routes)
├── packages/        # Shared packages
│   └── shared-types/
├── docs/           # Documentation
└── docker-compose.yml
```

## 🔧 Development Best Practices

1. Use Docker for consistent environment
2. Next.js API Routes for server-side logic
3. Supabase Client Library for DB operations
4. TypeScript for type safety
5. Shared types package for consistency
6. Proper error handling and logging
7. Dependency Injection with Inversify.js
