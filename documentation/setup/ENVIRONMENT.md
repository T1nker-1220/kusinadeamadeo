# Environment Setup Guide - January 2024

## Overview
This guide details the complete environment setup for Kusina de Amadeo, including all required configurations and dependencies.

## Core Requirements

### 1. Node.js Environment
```bash
# Required versions
Node.js >= 18.17.0
PNPM >= 8.0.0
```

### 2. Package Dependencies
```json
{
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/ssr": "^0.0.10",
    "@supabase/supabase-js": "^2.39.1",
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "prisma": "^5.7.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
```

## Environment Variables

### 1. Core Configuration
```env
# Database Configuration
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STORE_NAME="Kusina de Amadeo"
NEXT_PUBLIC_STORE_DESCRIPTION="Authentic Filipino Restaurant"
```

### 2. Security Configuration
```env
# Authentication
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
SUPABASE_JWT_SECRET="[YOUR-JWT-SECRET]"

# API Keys (if needed)
NEXT_PUBLIC_GOOGLE_MAPS_KEY="[YOUR-MAPS-KEY]"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="[YOUR-CLOUD-NAME]"
CLOUDINARY_API_KEY="[YOUR-API-KEY]"
CLOUDINARY_API_SECRET="[YOUR-API-SECRET]"
```

## Project Structure

### 1. Core Directories
```bash
src/
├── app/                 # Next.js 14 app router
├── components/          # React components
├── lib/                 # Utility functions
├── server/             # Server-side code
├── types/              # TypeScript types
└── utils/              # Helper functions

documentation/          # Project documentation
├── guidelines/         # Development guidelines
├── setup/             # Setup guides
├── troubleshooting/   # Troubleshooting guides
└── updates/           # Update logs

prisma/                # Database configuration
├── schema.prisma      # Database schema
├── seed.ts            # Seed data
└── migrations/        # Database migrations
```

### 2. Configuration Files
```bash
.env                   # Environment variables
.env.example          # Example environment file
.gitignore            # Git ignore rules
next.config.js        # Next.js configuration
postcss.config.js     # PostCSS configuration
tailwind.config.js    # Tailwind CSS configuration
tsconfig.json         # TypeScript configuration
```

## Development Setup

### 1. Initial Setup
```bash
# Clone repository
git clone https://github.com/your-username/kusinadeamadeo.git
cd kusinadeamadeo

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
```

### 2. Database Setup
```bash
# Generate Prisma client
pnpm prisma generate

# Push database schema
pnpm prisma db push

# Run database seed
pnpm prisma db seed
```

### 3. Start Development Server
```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## IDE Configuration

### 1. VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 2. VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Git Configuration

### 1. Git Hooks
```bash
# Pre-commit hook
#!/bin/sh
pnpm lint-staged
```

### 2. Git Ignore Rules
```gitignore
# Dependencies
node_modules
.pnpm-store

# Next.js
.next
out

# Environment
.env
.env.local
.env.*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
```

## Security Best Practices

### 1. Environment Variables
- Never commit .env files
- Use different values for development/production
- Rotate sensitive keys regularly
- Use strong, unique passwords

### 2. Access Control
- Implement proper CORS settings
- Use secure headers
- Enable rate limiting
- Implement request validation

## Performance Optimization

### 1. Development
- Enable React Strict Mode
- Use TypeScript strict mode
- Implement proper caching
- Optimize image loading

### 2. Production
- Enable compression
- Implement caching strategies
- Optimize bundle size
- Use proper CDN configuration

## Maintenance Tasks

### 1. Regular Updates
- Update dependencies regularly
- Check for security vulnerabilities
- Monitor performance metrics
- Update documentation

### 2. Backup Procedures
- Regular database backups
- Code repository backups
- Environment configuration backups
- Documentation version control

## Version Information
- Last Updated: January 16, 2024
- Node.js Version: 18.17.0
- PNPM Version: 8.0.0
- Next.js Version: 14.0.4
- Status: Production Ready
