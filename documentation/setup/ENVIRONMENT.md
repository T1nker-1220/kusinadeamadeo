# Environment Configuration Documentation

## Overview
This document details the environment configuration for the Kusina de Amadeo application. All sensitive credentials and configuration values are stored in the `.env` file.

## Core Configuration

### Supabase Configuration
```env
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_PROJECT_ID="[PROJECT_ID]"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"
SUPABASE_DATABASE_PASSWORD="[DATABASE_PASSWORD]"
```

### Google OAuth Configuration
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID="[GOOGLE_CLIENT_ID]"
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET="[GOOGLE_CLIENT_SECRET]"
```

### Application Configuration
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kusina de Amadeo"
NEXT_PUBLIC_BUSINESS_EMAIL="kusinadeamadeo@gmail.com"
NEXT_PUBLIC_CONTACT_EMAIL="kusinadeamadeo@gmail.com"
NEXT_PUBLIC_BUSINESS_PHONE="+63 960 508 8715"
NEXT_PUBLIC_BUSINESS_LANDLINE="(046) 890-9060"
NEXT_PUBLIC_BUSINESS_ADDRESS="107 i Purok 4 Dagatan, Amadeo, Cavite"
NEXT_PUBLIC_BUSINESS_MAPS_URL="[GOOGLE_MAPS_URL]"
NEXT_PUBLIC_BUSINESS_FACEBOOK_PAGE_URL="[FACEBOOK_PAGE_URL]"
```

### Business Hours Configuration
```env
NEXT_PUBLIC_STORE_HOURS_OPEN="05:00"
NEXT_PUBLIC_STORE_HOURS_CLOSE="23:00"
NEXT_PUBLIC_ORDER_HOURS_START="08:00"
NEXT_PUBLIC_ORDER_HOURS_END="22:00"
NEXT_PUBLIC_TIMEZONE="Asia/Manila"
```

### Order Constraints
```env
NEXT_PUBLIC_MIN_PREORDER_HOURS=2
NEXT_PUBLIC_MAX_PREORDER_DAYS=7
```

### Payment Configuration
```env
NEXT_PUBLIC_GCASH_NUMBER="09605088715"
NEXT_PUBLIC_GCASH_NAME="John Nathaniel Marquez"
```

### Image Configuration
```env
NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880 # 5MB in bytes
NEXT_PUBLIC_ALLOWED_IMAGE_TYPES=["image/jpeg", "image/png", "image/webp"]
```

### Email Configuration
```env
NEXT_PUBLIC_RESEND_EMAIL="kusinadeamadeo@gmail.com"
RESEND_API_KEY="[RESEND_API_KEY]"
```

## Usage Guidelines

### Database Connection
- `DATABASE_URL`: Primary database connection string with connection pooling
- `DIRECT_URL`: Direct database connection for migrations and certain operations
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous API key
- `SUPABASE_SERVICE_ROLE_KEY`: Private admin API key (never expose to client)

### Authentication
- Google OAuth is configured for authentication
- Credentials must be set up in the Google Cloud Console
- Redirect URIs must be configured for both development and production

### Business Rules
- Store hours: 5:00 AM to 11:00 PM
- Order processing: 8:00 AM to 10:00 PM
- Minimum pre-order time: 2 hours
- Maximum pre-order days: 7 days

### Image Handling
- Maximum image size: 5MB
- Supported formats: JPEG, PNG, WebP
- Images are stored in Supabase Storage

### Payment Processing
- GCash is the primary digital payment method
- Cash payments are accepted for in-store pickup
- Payment verification is manual through admin dashboard

## Security Considerations

### Environment Variables
- All sensitive credentials must be kept secure
- Never commit `.env` file to version control
- Use `.env.example` for documentation
- Rotate keys periodically for security

### API Keys
- Keep `SUPABASE_SERVICE_ROLE_KEY` secure
- Only use `NEXT_PUBLIC_` variables in client-side code
- Implement rate limiting for API endpoints
- Monitor API usage for suspicious activity

### Authentication
- Implement proper session management
- Use secure cookie settings
- Enable MFA for admin accounts
- Regular security audits

## Development Setup

1. Copy `.env.example` to `.env`
2. Fill in all required credentials
3. Never commit actual values to version control
4. Update values per environment (development/staging/production)

## Monitoring & Maintenance

### Regular Tasks
- Monitor API usage and rate limits
- Check for failed payments
- Review error logs
- Update credentials as needed

### Security Updates
- Rotate API keys periodically
- Update dependencies regularly
- Monitor for security advisories
- Implement security patches promptly
