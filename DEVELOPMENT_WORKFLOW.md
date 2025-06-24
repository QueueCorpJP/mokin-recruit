# Mokin Recruit - Development Workflow

## 🏗️ Architecture Overview
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Development**: Docker Compose
- **Authentication**: Supabase Auth + JWT

## 🚀 Quick Start Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f server
docker-compose logs -f client

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build server
docker-compose build client
```

## 📁 Project Structure
```
mokin-recruit/
├── client/          # Next.js frontend
├── server/          # Node.js backend
├── packages/        # Shared packages
│   └── shared-types/
├── docs/           # Documentation
└── docker-compose.yml
```

## 🔧 Development Best Practices
1. Use Docker for consistent environment
2. Supabase Client Library for DB operations
3. TypeScript for type safety
4. Shared types package for consistency
5. Proper error handling and logging
