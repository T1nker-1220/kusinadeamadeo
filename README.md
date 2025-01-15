# Kusina de Amadeo

A modern food ordering system for an authentic Filipino restaurant in Amadeo, Cavite.

## Features

### Authentication System
- Google OAuth integration
- Role-based access control (admin/customer)
- Protected routes
- Session management
- Type-safe implementation

### User Management
- Profile management
- Role-based permissions
- Order history tracking
- Payment verification (admin)

### Product System (Coming Soon)
- Category management
- Product variants
- Add-ons system
- Stock tracking

### Order System (Coming Soon)
- Shopping cart
- Order processing
- Payment integration (GCash/Cash)
- Receipt generation

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/UI
- Zustand

### Backend
- Supabase (PostgreSQL)
- Prisma ORM
- Row Level Security
- Type-safe APIs

### Authentication
- Google OAuth 2.0
- Supabase Auth
- Protected routes
- Role-based access

### Development
- PNPM
- ESLint
- Prettier
- TypeScript
- Git

## Getting Started

### Prerequisites
- Node.js 18+
- PNPM
- Supabase account
- Google OAuth credentials

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/kusinadeamadeo.git

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Update environment variables
# Add your Supabase and Google OAuth credentials

# Run development server
pnpm dev
```

### Environment Variables
```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id"
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET="your-client-secret"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kusina de Amadeo"
```

## Project Structure
```
src/
  ├── app/                # Next.js 14 App Router
  ├── components/         # Reusable UI components
  ├── hooks/             # Custom React hooks
  ├── lib/               # Utility functions
  ├── server/            # Server-side code
  ├── store/             # Zustand store
  ├── styles/            # Global styles
  └── types/             # TypeScript types
```

## Documentation

- [Authentication System](documentation/updates/AUTHENTICATION_2024_01.md)
- [Database Schema](documentation/updates/DATABASE_SCHEMA_2024_01.md)
- [API Implementation](documentation/guidelines/API_IMPLEMENTATION.md)
- [Error Handling](documentation/guidelines/ERROR_HANDLING.md)

## Development Status

### Completed
- ✅ Project setup
- ✅ Database schema
- ✅ Authentication system
- ✅ User management

### In Progress
- 🔄 Database security (RLS)
- 🔄 API protection
- 🔄 Data validation

### Upcoming
- ⏳ Product management
- ⏳ Order system
- ⏳ Payment integration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Email: kusinadeamadeo@gmail.com
- Phone: +63 939 719 689
- Address: 107 i Purok 4 Dagatan, Amadeo, Cavite
