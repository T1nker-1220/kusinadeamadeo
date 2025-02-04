# API Documentation

## Database State API

### Get Database State
```typescript
GET /api/database/state
```

Fetches the complete state of the database including tables, columns, policies, indexes, enums, functions, and triggers.

#### Authentication
- Requires authentication
- Admin role required

#### Response Format
```typescript
interface DatabaseState {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: string;
      default: string | null;
    }>;
    policies: Array<{
      name: string;
      command: string;
      roles: string[];
      using: string;
      with_check: string;
    }>;
    indexes: Array<{
      name: string;
      definition: string;
    }>;
  }>;
  enums: Array<{
    name: string;
    values: string[];
  }>;
  functions: Array<{
    name: string;
    language: string;
    return_type: string;
    arguments: string;
    security_definer: boolean;
  }>;
  triggers: Array<{
    name: string;
    table: string;
    timing: string;
    event: string;
    definition: string;
  }>;
}
```

#### Success Response
```json
{
  "tables": [...],
  "enums": [...],
  "functions": [...],
  "triggers": [...]
}
```

#### Error Responses
```typescript
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 403 Forbidden
{
  "error": "Forbidden"
}

// 500 Internal Server Error
{
  "error": "Internal server error"
}
```

#### Example Usage
```typescript
const fetchDatabaseState = async () => {
  const response = await fetch('/api/database/state');
  if (!response.ok) {
    throw new Error('Failed to fetch database state');
  }
  return response.json();
};
```

#### Notes
- Response may be large depending on database size
- Consider implementing pagination for large databases
- Cache responses when appropriate
- Monitor performance impact of frequent calls

// ... existing documentation ...
