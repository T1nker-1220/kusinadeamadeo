# TypeScript Configuration

## TypeScript Setup

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Type Definitions

### Database Types
```typescript
// types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'customer'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'admin' | 'customer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'customer'
          created_at?: string
        }
      }
      // Other tables...
    }
  }
}
```

### Component Types
```typescript
// types/components.ts
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

// Add other component types...
```

## Type Safety Guidelines

### 1. Strict Type Checking
- Enable strict mode in tsconfig.json
- Use explicit type annotations
- Avoid using 'any' type

### 2. Type Inference
```typescript
// Good - Let TypeScript infer types when obvious
const numbers = [1, 2, 3] // inferred as number[]

// Good - Explicit types when needed
const getData = async (): Promise<Data> => {
  // ...
}
```

### 3. Type Guards
```typescript
function isError(error: unknown): error is Error {
  return error instanceof Error
}

// Usage
try {
  // ...
} catch (error) {
  if (isError(error)) {
    console.error(error.message)
  }
}
```

### 4. Utility Types
```typescript
// Partial
type PartialUser = Partial<User>

// Pick
type UserName = Pick<User, 'firstName' | 'lastName'>

// Omit
type UserWithoutId = Omit<User, 'id'>
```

## Best Practices

1. **Type Organization**
   - Keep types close to their usage
   - Use separate type files for shared types
   - Group related types together

2. **Type Naming**
   - Use PascalCase for type names
   - Be descriptive and clear
   - Add Type or Interface suffix when helpful

3. **Type Safety**
   - Use union types for finite options
   - Leverage literal types
   - Implement proper error handling

4. **Code Quality**
   - Use ESLint with TypeScript rules
   - Implement proper error boundaries
   - Follow TypeScript best practices

## Common Patterns

### API Response Types
```typescript
interface ApiResponse<T> {
  data: T
  error: string | null
  status: number
}

// Usage
type UserResponse = ApiResponse<User>
```

### Event Handler Types
```typescript
type HandleChange = (event: React.ChangeEvent<HTMLInputElement>) => void
type HandleSubmit = (event: React.FormEvent<HTMLFormElement>) => void
```

### State Types
```typescript
interface State {
  loading: boolean
  error: string | null
  data: Data | null
}
```

## Error Handling
```typescript
// Custom error class
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Error handling
try {
  throw new ApiError('Not found', 404)
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`${error.statusCode}: ${error.message}`)
  }
}
```
