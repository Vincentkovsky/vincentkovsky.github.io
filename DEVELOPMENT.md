# Development Guide

This document outlines the coding standards, best practices, and workflow for contributing to the Personal Web Portfolio project.

## Code Style and Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type where possible
- Use type inference when the type is obvious
- Use meaningful variable and function names

```typescript
// Good
const user: User = { id: 1, name: "John" };

// Bad
const u: any = { id: 1, name: "John" };
```

### React Components

- Use functional components with hooks
- Each component should have a single responsibility
- Keep components small and focused
- Use proper component organization:
  - UI components in `client/src/components/ui/`
  - Page sections in `client/src/components/`
  - Page components in `client/src/pages/`

```tsx
// Good component structure
function Button({ children, onClick }: ButtonProps) {
  return (
    <button 
      className="bg-primary text-white px-4 py-2 rounded" 
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### CSS and Styling

- Use Tailwind CSS for styling
- Follow the project's design system
- Use the shadcn/ui component patterns for consistency
- Use responsive design for all components

```tsx
// Good styling with Tailwind
<div className="flex flex-col md:flex-row gap-4 p-6">
  <div className="flex-1">Content</div>
  <div className="flex-1">Content</div>
</div>
```

### API and Backend

- Follow RESTful API design principles
- Use proper error handling with descriptive messages
- Validate all input data with Zod schemas
- Implement proper type safety between client and server

```typescript
// Good API endpoint implementation
app.post("/api/resource", async (req, res) => {
  try {
    const validatedData = resourceSchema.parse(req.body);
    const result = await storage.createResource(validatedData);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
```

## Project Structure and Organization

### File Naming Conventions

- Use kebab-case for file names: `my-component.tsx`
- Use PascalCase for component names: `MyComponent`
- Use camelCase for variables, functions, and methods

### Import Order

1. External libraries
2. Internal modules
3. Components
4. Hooks
5. Types and interfaces
6. CSS/SCSS files

```typescript
// External libraries
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Internal modules
import { someUtility } from '@/lib/utilities';

// Components
import { Button } from '@/components/ui/button';

// Hooks
import { useCustomHook } from '@/hooks/useCustomHook';

// Types
import type { MyComponentProps } from '@/types';
```

## Development Workflow

### Starting Development

1. Make sure you have the latest code:
   ```
   git pull origin main
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Making Changes

1. Create a new branch for your feature or bug fix:
   ```
   git checkout -b feature/your-feature-name
   ```

2. Write tests for your changes (if applicable)

3. Implement your changes following the code standards

4. Test your changes locally:
   ```
   npm run dev
   ```

5. Commit your changes with a descriptive commit message:
   ```
   git commit -m "Add feature: your feature description"
   ```

### Pull Requests

1. Push your branch to the repository:
   ```
   git push origin feature/your-feature-name
   ```

2. Create a pull request on GitHub

3. Wait for code review and approval

4. Once approved, merge your pull request

## Database Changes

When making changes to the database schema:

1. Update the schema in `shared/schema.ts`

2. Run the database migration:
   ```
   npm run db:push
   ```

## Deployment

### Building for Production

```
npm run build
```

### Running in Production

```
npm run start
```

## Troubleshooting

- If you encounter issues with dependencies, try:
  ```
  rm -rf node_modules
  npm install
  ```

- If you have database connection issues, check your environment variables

- For TypeScript errors, run:
  ```
  npm run check
  ``` 