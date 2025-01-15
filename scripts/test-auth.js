#!/usr/bin/env node

const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}🔒 Testing Authentication System${colors.reset}\n`);

// Test 1: Unauthenticated Access
console.log(`${colors.yellow}Test 1: Unauthenticated Access${colors.reset}`);
try {
  const result = execSync('curl -s http://localhost:3000/api/auth/test').toString();
  console.log('Response:', result);
  console.log(`${colors.red}❌ Expected to fail with 401${colors.reset}\n`);
} catch (error) {
  if (error.status === 401) {
    console.log(`${colors.green}✅ Correctly rejected unauthenticated request${colors.reset}\n`);
  }
}

console.log(`${colors.blue}To test authenticated access:${colors.reset}

1. Start your development server:
   ${colors.yellow}pnpm dev${colors.reset}

2. Open your browser and navigate to:
   ${colors.yellow}http://localhost:3000/api/auth/test${colors.reset}

3. Check the Network tab in DevTools to see:
   - Authentication headers
   - RLS policies in action
   - User role enforcement

Expected Results:
- Unauthenticated: 401 Unauthorized
- Authenticated: 200 OK with user data
- RLS: Should only return the user's own data

Additional Manual Tests:
1. Use Supabase Dashboard to:
   - Verify user creation
   - Check RLS policy logs
   - Monitor auth events

2. Test different user roles:
   - Create test users with different roles
   - Verify role-based access
   - Check RLS policy enforcement
`);
