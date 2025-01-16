# Provider Components

This directory contains provider components that wrap the application with necessary context and functionality.

## Providers

### Authentication Provider
- Google OAuth integration
- Session management
- Role-based access control
- Protected routes handling

### Theme Provider
- Dark mode configuration
- Theme customization
- Dynamic styling
- CSS variable management

### Query Provider
- React Query configuration
- Data fetching setup
- Cache management
- Error handling

### Store Provider
- Zustand store initialization
- Global state management
- State persistence
- Store middleware

## Usage

1. **Provider Setup**
```typescript
// src/app/providers.tsx
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { StoreProvider } from "@/components/providers/store-provider"

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <StoreProvider>
          {children}
        </StoreProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
```

2. **Provider Configuration**
```typescript
// src/app/layout.tsx
import { Providers } from "./providers"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Best Practices
- Initialize providers at the root level
- Configure proper error boundaries
- Handle loading states
- Implement proper TypeScript types
- Follow React Server Components guidelines
- Use "use client" directive when needed
