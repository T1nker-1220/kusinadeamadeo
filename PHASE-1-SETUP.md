# Phase 1: Complete Initial Setup & Authentication

## Step 1: Project Setup

### 1.1 Create Next.js Project

```bash
# Create new project with all necessary configurations
npx create-next-app@latest ./ --typescript --tailwind --app --src-dir --import-alias "@/*" --use-npm

# Navigate to project directory
cd kusinadeamadeo

# Install essential dependencies
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js zod zustand next-themes class-variance-authority resend @types/node @types/react @types/react-dom
```

### 1.2 Project Structure Setup

```bash
# Create necessary directories
mkdir -p src/app/(auth)
mkdir -p src/app/(admin)
mkdir -p src/app/(store)
mkdir -p src/components/ui
mkdir -p src/lib/supabase
mkdir -p src/types
mkdir -p src/styles
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p public/images
```

### 1.3 Environment Setup

```bash
# Create environment file
touch .env.local

# Add environment variables
cat > .env.local << EOL
# Supabase Configuration
DATABASE_URL="your_database_url"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DATABASE_PASSWORD=your_database_password
NEXT_PUBLIC_PROJECT_ID=your_project_id

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Kusina de Amadeo"
NEXT_PUBLIC_BUSINESS_EMAIL=kusinadeamadeo@gmail.com
NEXT_PUBLIC_CONTACT_EMAIL=marquezjohnnathanieljade@gmail.com
NEXT_PUBLIC_BUSINESS_PHONE="+63 960 508 8715"
NEXT_PUBLIC_BUSINESS_LANDLINE="(046) 890-9060"
NEXT_PUBLIC_BUSINESS_ADDRESS="107 i Purok 4 Dagatan, Amadeo, Cavite"
NEXT_PUBLIC_BUSINESS_MAPS_URL="https://maps.app.goo.gl/nYwvNFvRrAeyDLMG7"
NEXT_PUBLIC_BUSINESS_FACEBOOK_PAGE_URL="https://www.facebook.com/profile.php?id=100087753559758"

# Business Hours Configuration
NEXT_PUBLIC_STORE_HOURS_OPEN="05:00"
NEXT_PUBLIC_STORE_HOURS_CLOSE="23:00"
NEXT_PUBLIC_ORDER_HOURS_START="08:00"
NEXT_PUBLIC_ORDER_HOURS_END="22:00"
NEXT_PUBLIC_TIMEZONE="Asia/Manila"

# Order Constraints
NEXT_PUBLIC_MIN_PREORDER_HOURS=2
NEXT_PUBLIC_MAX_PREORDER_DAYS=7

# Payment Configuration
NEXT_PUBLIC_GCASH_NUMBER="09605088715"
NEXT_PUBLIC_GCASH_NAME="John Nathaniel Marquez"

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
EOL
```

## Step 2: Database Schema Setup

### 2.0 Supabase CLI Setup
```bash
# Install Supabase CLI globally
npm install -g supabase

# Initialize Supabase in your project
npx supabase init

# Login to Supabase CLI (get access token from dashboard.supabase.com/account/tokens)
npx supabase login

# Link your project (replace with your project reference ID)
npx supabase link --project-ref your-project-ref

# Create migrations directory
mkdir -p supabase/migrations

# Add database scripts to package.json
npm pkg set scripts.db:status="supabase status"
npm pkg set scripts.db:pull="supabase db pull"
npm pkg set scripts.db:push="supabase db push"
npm pkg set scripts.db:reset="supabase db reset"
npm pkg set scripts.db:types="supabase gen types typescript --local > src/types/supabase.ts"
```

### 2.1 Create Tables
```sql
-- migrations/20240112000000_initial_schema.sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_role CHECK (role IN ('admin', 'customer'))
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create variants table
CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_type CHECK (type IN ('size', 'add_on', 'flavor'))
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  receipt_id TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  contact_number TEXT,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  CONSTRAINT valid_payment_method CHECK (payment_method IN ('gcash', 'cash')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed'))
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  variants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Apply Migrations
```bash
# Check database status
npm run db:status

# Push migrations to database
npm run db:push

# Generate TypeScript types
npm run db:types
```

### 2.3 Insert Initial Data

```sql
-- Insert admin user
INSERT INTO users (email, role)
VALUES ('kusinadeamadeo@gmail.com', 'admin');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Budget Meals', 'Affordable meal options'),
('Silog Meals', 'Filipino breakfast meals with rice and egg'),
('Ala Carte', 'Individual dishes'),
('Beverages', 'Drinks and refreshments'),
('Special Orders', 'Custom and special menu items');
```

## Step 3: Authentication Setup

### 3.1 Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google OAuth API
4. Configure OAuth consent screen
5. Create OAuth 2.0 Client ID
6. Add authorized redirect URIs:
   - http://localhost:3000/auth/callback
   - https://your-production-domain.com/auth/callback

### 3.2 Setup Supabase Auth

1. Go to Supabase Dashboard > Authentication
2. Enable Google OAuth provider
3. Add Google OAuth credentials
4. Configure email templates for:
   - Welcome email
   - Magic link
   - Change email
   - Reset password

## Step 4: Initial Files Setup

### 4.1 Create Base Components

Create essential UI components in `src/components/ui`:

- Button
- Input
- Form
- Card
- Modal
- Toast
- Loading
- ErrorBoundary

### 4.2 Setup Authentication Context

Create authentication context in `src/lib/auth.ts`

### 4.3 Setup Supabase Client

Create Supabase client in `src/lib/supabase/client.ts`

### 4.4 Setup Theme Configuration

Create theme configuration in `src/styles/theme.ts`

## Step 5: Testing Setup

### 5.1 Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest jest-environment-jsdom
```

### 5.2 Configure Jest

Create jest.config.js with Next.js configuration

## Step 6: Deployment Setup

### 6.1 Configure Build Settings

Update next.config.js for production optimization

### 6.2 Setup Error Monitoring

Configure error boundary and logging system

### 6.3 Performance Monitoring

Setup Core Web Vitals monitoring
