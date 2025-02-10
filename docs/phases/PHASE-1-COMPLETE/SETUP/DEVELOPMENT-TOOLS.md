# Development Tools Configuration

## ESLint Setup

### Installation
```bash
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D eslint-plugin-react eslint-plugin-react-hooks
pnpm add -D eslint-config-next eslint-config-prettier
```

### Configuration (.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
}
```

## Prettier Configuration

### Installation
```bash
pnpm add -D prettier
pnpm add -D prettier-plugin-tailwindcss
```

### Configuration (prettier.config.js)
```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-tailwindcss'],
}
```

## VSCode Setup

### Required Extensions
1. **ESLint**
   - ID: dbaeumer.vscode-eslint
   - Purpose: JavaScript/TypeScript linting

2. **Prettier**
   - ID: esbenp.prettier-vscode
   - Purpose: Code formatting

3. **Tailwind CSS IntelliSense**
   - ID: bradlc.vscode-tailwindcss
   - Purpose: CSS class suggestions

4. **PostCSS Language Support**
   - ID: csstools.postcss
   - Purpose: PostCSS syntax highlighting

### VSCode Settings (settings.json)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Git Configuration

### .gitignore
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### Git Hooks (using Husky)
```bash
pnpm add -D husky lint-staged
npx husky install
```

#### pre-commit hook (.husky/pre-commit)
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
```

#### lint-staged configuration (package.json)
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Development Scripts (package.json)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

## Development Best Practices

### 1. Code Quality
- Run linting before commits
- Maintain consistent code style
- Use TypeScript strictly
- Follow component best practices

### 2. Performance
- Monitor bundle size
- Optimize images
- Implement proper caching
- Use code splitting

### 3. Testing
- Write unit tests
- Implement integration tests
- Use testing best practices
- Maintain good test coverage

### 4. Security
- Keep dependencies updated
- Follow security best practices
- Implement proper error handling
- Use environment variables

### 5. Documentation
- Document code properly
- Maintain README files
- Update documentation regularly
- Use JSDoc comments
