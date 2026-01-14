# AI Agent Instructions for ARK Starters SPA

> **Purpose**: This document provides structured guidance for AI coding agents working on this React SPA project. It includes decision trees, verification procedures, and task-specific workflows to enable autonomous, high-quality code contributions.

## Table of Contents

- [Quick Start for Agents](#quick-start-for-agents)
- [Project Overview](#project-overview)
- [Critical Rules](#critical-rules)
- [Agent Task Workflows](#agent-task-workflows)
- [Code Standards and Patterns](#code-standards-and-patterns)
- [Verification Procedures](#verification-procedures)
- [File-Specific Context](#file-specific-context)
- [Troubleshooting Guide](#troubleshooting-guide)

---

## Quick Start for Agents

### Before You Begin
1. **Read Critical Rules** section - non-negotiable requirements
2. **Identify your task type** from Agent Task Workflows
3. **Follow the specific workflow** for your task
4. **Run verification procedures** before completing

### Project Commands
```bash
# Development
npm start              # Start dev server (localhost:3000)
npm run build          # Production build
npm run preview        # Preview production build
npm run analyze        # Build with bundle analysis (generates build/stats.html)

# Quality
npm run lint           # ESLint check
npm test               # Run E2E tests (Cypress)

# Utility
npm outdated           # Check package versions
```

### Repository Structure
```
src/
├── app/                    # Routes and page components
├── components/             # Shared UI components (use 'translation' namespace)
├── config/                 # Configuration (lang.ts, gdpr.ts)
├── features/              # Feature modules (use 'translation' namespace)
├── lib/                   # Shared utilities and libraries
│   ├── authentication/    # Auth providers (Auth0, MSAL)
│   ├── components/        # Reusable lib components (use 'libComponents' namespace)
│   ├── errorHandler/      # Error handling utilities
│   ├── i18n/             # Internationalization utilities
│   ├── mocks/            # MSW mock handlers
│   └── rtk/              # Redux Toolkit slices and APIs
├── locales/              # Translation files (en/, it/, etc.)
│   └── {lang}/
│       ├── translation.json       # Default namespace
│       ├── libComponents.json     # For lib components
│       ├── gdpr.json             # GDPR/cookie consent
│       └── zodCustom.json        # Form validation errors
└── siteMap/              # Site navigation structure
```

---

## Project Overview

This is a **React 19.2** Single Page Application starter template with enterprise-grade features.

### Core Technologies
- **Framework**: React 19.2.3 + TypeScript 5.9.3
- **Build**: Vite 7.3.0
- **UI**: Chakra UI 3.30.0 with Emotion
- **State**: Redux Toolkit 2.11.2 + RTK Query
- **Router**: React Router 7.11.0
- **Auth**: Flexible provider system (Auth0, MSAL/Azure AD B2C)
- **i18n**: i18next 25.7.3 + react-i18next 16.5.1
- **Forms**: React Hook Form 7.70.0 + Zod 4.3.5
- **Tables**: TanStack Table 8.21.3
- **Testing**: Cypress 15.8.1 (E2E)
- **PWA**: vite-plugin-pwa 1.2.0
- **DnD**: @dnd-kit/core 6.3.1 + @dnd-kit/sortable 9.0.1

### Key Features
- **Flexible Authentication**: Pluggable auth providers (Auth0, MSAL)
- **Full i18n Support**: Auto-detect locale, translation namespaces
- **PWA Ready**: Service worker, offline support
- **GDPR Compliant**: Cookie consent management
- **Accessible**: WCAG compliant, screen reader friendly
- **Dark Mode**: Native light/dark theme support

---

## Critical Rules

### 🔴 MUST Follow (Non-Negotiable)

#### 1. Code Language: English Only
**ALL code must be in English** (except translation files in `src/locales/`)

```typescript
// ✅ CORRECT
const userName = "John";
function fetchUserData() { /* ... */ }

// ❌ WRONG - Non-English names
const nomeUtente = "John";
function ottieniDatiUtente() { /* ... */ }
```

**Applies to**:
- Variable names
- Function names
- Class/interface names
- File names
- Comments
- Test descriptions
- Console logs

**Exceptions**: Only `src/locales/*/` translation files

#### 2. Translation Keys: All UI Text Must Be Translated
**NEVER** use hardcoded strings in UI components.

```typescript
// ❌ WRONG - Hardcoded text
<Button>Submit</Button>
<Text>Welcome to our app</Text>

// ✅ CORRECT - Translation keys
const { t } = useTranslation();
<Button>{t("common_submit")}</Button>
<Text>{t("home_welcome")}</Text>
```

#### 3. Translation Namespaces: Strict Separation
- **`libComponents` namespace**: Components in `src/lib/components/`
- **`translation` namespace** (default): Components in `src/components/` or `src/features/`

```typescript
// In src/lib/components/AppDatePicker/appDatePicker.tsx
const { t } = useTranslation();
const label = t("libComponents:appDatePicker_openDatePicker");

// In src/features/movies/moviePage.tsx
const { t } = useTranslation();
const title = t("movies_movies"); // No namespace prefix
```

#### 4. Semantic Tokens: No Hardcoded Colors
**ALWAYS** use semantic tokens from `theme.ts`. Never use raw color values.

```typescript
// ❌ WRONG - Hardcoded colors
<Box bg="blue.500" color="#ffffff">
<Box borderColor="rgb(200, 200, 200)">

// ✅ CORRECT - Semantic tokens
<Box bg="brand.solid" color="brand.contrast">
<Box borderColor="border.default">
```

Available semantic token categories:
- `bg.*` - Backgrounds (e.g., `bg.info`, `bg.panel`)
- `border.*` - Borders
- `brand.*` - Brand colors (solid, contrast, fg, muted, subtle, emphasized, focusRing)
- `primary.*` - Primary palette
- `error.*` - Error states
- `code.*` - Code highlighting

#### 5. Date Formatting: Use i18next Formatters
**In React components**, always use `useTranslation()` hook for date formatting.

```typescript
// ✅ CORRECT - i18next formatter
const { t } = useTranslation();
const formatted = t('{{val, shortDate}}', { val: new Date() });

// ❌ WRONG - Direct date-fns import
import { format } from 'date-fns'; // ESLint will block this
```

**In utility functions** (non-React), use helpers from `@/lib/i18n/formatDate`:
```typescript
import { formatISODate, formatShortDate } from "@/lib/i18n/formatDate";
```

Available formatters:
- `isoDate` - ISO 8601 (YYYY-MM-DD)
- `shortDate` - Localized short date
- `longDate` - Localized long date with weekday
- `dateTime` - Localized date and time
- `dateFormat` - Custom format (accepts `format` param)

#### 6. TypeScript: Strict Mode, No `any`
- Strict mode enabled - no exceptions
- Use `unknown` instead of `any`
- Prefer type inference over explicit types
- Use `interface` for object shapes, `type` for unions/intersections

```typescript
// ✅ CORRECT
interface User {
  id: string;
  name: string;
}
const response: unknown = await fetch(url);

// ❌ WRONG
const data: any = await fetch(url);
```

#### 7. Z-Index: Use Chakra Predefined Values Only
```typescript
// Only these values allowed:
const zIndices = {
  hide: -1, auto: "auto", base: 0, docked: 10,
  dropdown: 1000, sticky: 1100, banner: 1200, overlay: 1300,
  modal: 1400, popover: 1500, skipLink: 1600,
  toast: 1700, tooltip: 1800
};

// ✅ CORRECT
<Box zIndex="modal">

// ❌ WRONG
<Box zIndex={9999}>
```

#### 8. Exports: Prefer Named Exports
```typescript
// ✅ CORRECT
export const MyComponent = () => { /* ... */ };
export function useCustomHook() { /* ... */ }

// ❌ AVOID
export default MyComponent;
```

#### 9. Commit Messages: Conventional Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

```bash
# Format: <type>(<scope>): <subject>

# Examples:
feat(auth): add support for custom MSAL scopes
fix(i18n): resolve translation key not found error
docs(readme): update authentication setup instructions
refactor(tables): extract pagination logic to custom hook
test(e2e): add tests for login flow
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

**Common scopes**: `auth`, `i18n`, `ui`, `routing`, `state`, `forms`, `tables`, `pwa`, `gdpr`, `api`, `config`, `deps`, `dx`, `a11y`, `e2e`

---

## Agent Task Workflows

### Task Type Decision Tree

```
Is your task about...
├─ Adding/modifying UI components? → [UI Component Workflow](#ui-component-workflow)
├─ Adding/changing translations? → [Translation Workflow](#translation-workflow)
├─ Authentication changes? → [Authentication Workflow](#authentication-workflow)
├─ API integration? → [API Integration Workflow](#api-integration-workflow)
├─ Form creation/modification? → [Form Workflow](#form-workflow)
├─ Table implementation? → [Table Workflow](#table-workflow)
├─ Theme/styling changes? → [Theme Workflow](#theme-workflow)
├─ Testing? → [Testing Workflow](#testing-workflow)
└─ Other? → [General Workflow](#general-workflow)
```

---

### UI Component Workflow

**When**: Creating or modifying React components

#### Step-by-Step

1. **Determine component location**:
   - Shared across features? → `src/components/`
   - Feature-specific? → `src/features/{feature}/`
   - Reusable library component? → `src/lib/components/`

2. **Set up translation namespace**:
   ```typescript
   // For src/lib/components/*
   import { useTranslation } from "react-i18next";
   const { t } = useTranslation();
   const label = t("libComponents:componentName_key");
   
   // For src/components/* or src/features/*
   import { useTranslation } from "react-i18next";
   const { t } = useTranslation();
   const label = t("featureName_key");
   ```

3. **Use semantic tokens for styling**:
   ```typescript
   // Check src/theme.ts for available tokens
   <Box bg="bg.panel" color="fg.default" borderColor="border.subtle">
   ```

4. **Follow React patterns**:
   - Functional components only
   - Use hooks (useState, useEffect, custom hooks)
   - Named exports
   - TypeScript interfaces for props

5. **Add accessibility**:
   - Semantic HTML elements
   - ARIA labels (translated)
   - Keyboard navigation
   - Focus management

6. **Testing** (MUST):
   - [ ] Add test case(s) for the new component/feature
   - [ ] Ensure existing tests still pass
   - [ ] Update or delete tests if new request overrides previous functionality

7. **Verification**:
   - [ ] All text uses translation keys
   - [ ] Colors use semantic tokens
   - [ ] TypeScript types defined
   - [ ] No `any` types
   - [ ] Accessible (test with keyboard)
   - [ ] Runs `npm run lint` without errors

**Example Component**:
```typescript
// src/components/UserCard/userCard.tsx
import { Box, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface UserCardProps {
  name: string;
  email: string;
}

export const UserCard = ({ name, email }: UserCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Box bg="bg.panel" p={4} borderRadius="md" borderColor="border.subtle" borderWidth="1px">
      <Heading size="md" color="fg.emphasized">
        {name}
      </Heading>
      <Text color="fg.muted" fontSize="sm">
        {t("userCard_email")}: {email}
      </Text>
    </Box>
  );
};
```

---

### Translation Workflow

**When**: Adding or modifying translation strings

#### Step-by-Step

1. **Determine namespace**:
   - Component in `src/lib/components/`? → `libComponents.json`
   - Component in `src/components/` or `src/features/`? → `translation.json`
   - GDPR/cookie text? → `gdpr.json`
   - Zod validation errors? → `zodCustom.json`

2. **Choose key naming convention**:
   ```
   {featureName}_{componentName}_{elementPurpose}
   
   Examples:
   - movies_movieCard_title
   - movies_movieCard_releaseDate
   - libComponents:appDatePicker_openDatePicker
   - common_submit
   - common_cancel
   ```

3. **Add to ALL supported languages**:
   ```bash
   # Check src/config/lang.ts for supported languages
   # Default: en, it
   
   # Add key to each:
   src/locales/en/translation.json
   src/locales/it/translation.json
   ```

4. **Example** (adding a new feature):
   ```json
   // src/locales/en/translation.json
   {
     "movies_movies": "Movies",
     "movies_addMovie": "Add Movie",
     "movies_searchPlaceholder": "Search movies..."
   }
   
   // src/locales/it/translation.json
   {
     "movies_movies": "Film",
     "movies_addMovie": "Aggiungi Film",
     "movies_searchPlaceholder": "Cerca film..."
   }
   ```

5. **For lib components**:
   ```json
   // src/locales/en/libComponents.json
   {
     "appDatePicker_openDatePicker": "Open date picker",
     "appDatePicker_clearDate": "Clear date"
   }
   ```

6. **Testing** (MUST):
   - [ ] Add test case(s) for the translation keys in components
   - [ ] Ensure existing tests still pass
   - [ ] Update or delete tests if new request overrides previous functionality

7. **Verification**:
   - [ ] Key added to ALL supported language files
   - [ ] Key follows naming convention
   - [ ] Correct namespace used
   - [ ] No hardcoded strings remain in component
   - [ ] Test language switching works

---

### Authentication Workflow

**When**: Modifying authentication logic or adding new auth provider

#### Step-by-Step

1. **Understand current provider**:
   - Check `src/index.tsx` for active provider
   - Current options: `Auth0AuthProvider`, `MsalAuthProvider`

2. **For existing provider modifications**:
   - Edit provider implementation in `src/lib/authentication/providers/`
   - Ensure `AuthProvider` interface is maintained
   - Update environment variables in `.env.local` if needed

3. **For new provider**:
   - Implement `AuthProvider` interface:
     ```typescript
     export interface AuthProvider {
       init: () => Promise<void>;
       login: () => void;
       logout: () => void;
       handleLoginRedirect: () => Promise<void>;
       getToken: (audience?: string) => TokenResponse;
       hasPermission: (permission: string, audience?: string) => boolean;
       getLoginStatus: () => LoginStatus;
       getUserDetail: () => Promise<UserAccountInfo | null>;
     }
     ```
   - Create provider class in `src/lib/authentication/providers/{providerName}.ts`
   - Update `src/index.tsx` to support new provider

4. **Environment configuration**:
   - Update `.env.local` with required variables
   - Update `public/connectionStrings.cjs` to serve variables
   - Document required env vars

5. **Protected routes**:
   ```typescript
   import { ProtectedRoute } from "@/lib/authentication/components/protectedRoute";
   
   <ProtectedRoute permission="required.permission">
     <YourComponent />
   </ProtectedRoute>
   ```

6. **Testing** (MUST):
   - [ ] Add test case(s) for authentication flows (login, logout, token refresh)
   - [ ] Ensure existing tests still pass
   - [ ] Update or delete tests if new request overrides previous functionality

7. **Verification**:
   - [ ] AuthProvider interface fully implemented
   - [ ] Login flow works
   - [ ] Logout flow works
   - [ ] Token refresh works
   - [ ] Protected routes enforce permissions
   - [ ] No secrets in code (use env vars)

---

### API Integration Workflow

**When**: Adding new API endpoints with RTK Query

#### Step-by-Step

1. **Create API slice** in `src/lib/rtk/{feature}Api.ts`:
   ```typescript
   import { createAppApi } from "@/lib/rtk/createAppApi";
   import { arkFetchBaseQuery } from "@/lib/rtk/arkFetchBaseQuery";
   
   export const moviesApi = createAppApi({
     reducerPath: 'moviesApi',
     baseQuery: arkFetchBaseQuery({ baseUrl: '/api' }),
     endpoints: (builder) => ({
       getMovies: builder.query({
         query: ({ pageIndex, pageSize, sorting, filters }) => ({
           url: '/movies',
           params: { page: pageIndex, limit: pageSize, ...sorting, ...filters },
         }),
       }),
       createMovie: builder.mutation({
         query: (movie) => ({
           url: '/movies',
           method: 'POST',
           body: movie,
         }),
       }),
     }),
   });
   
   export const { useGetMoviesQuery, useCreateMovieMutation } = moviesApi;
   ```

2. **Expected API response format** for paginated queries:
   ```typescript
   {
     data: T[],      // Array of items
     count: number,  // Total count
     page: number,   // Current page (0-indexed)
     limit: number,  // Page size
   }
   ```

3. **Register API in store** (`src/lib/rtk/store.ts`):
   ```typescript
   import { moviesApi } from "@/lib/rtk/moviesApi";
   
   export const store = configureStore({
     reducer: {
       [moviesApi.reducerPath]: moviesApi.reducer,
       // ... other reducers
     },
     middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(moviesApi.middleware),
   });
   ```

4. **Mock API for testing** (optional):
   - Add MSW handler in `src/lib/mocks/handlers.ts`
   ```typescript
   import { http, HttpResponse } from 'msw';
   
   export const handlers = [
     http.get('/api/movies', ({ request }) => {
       const url = new URL(request.url);
       const page = url.searchParams.get('page') || '0';
       const limit = url.searchParams.get('limit') || '10';
       
       return HttpResponse.json({
         data: mockMovies,
         count: mockMovies.length,
         page: parseInt(page),
         limit: parseInt(limit),
       });
     }),
   ];
   ```

5. **Use in component**:
   ```typescript
   import { useGetMoviesQuery } from "@/lib/rtk/moviesApi";
   
   const { data, isLoading, error } = useGetMoviesQuery({
     pageIndex: 0,
     pageSize: 10,
     sorting: [],
     filters: [],
   });
   ```

6. **Testing** (MUST):
   - [ ] Add test case(s) for API endpoints using MSW mocks
   - [ ] Ensure existing tests still pass
   - [ ] Update or delete tests if new request overrides previous functionality

7. **Verification**:
   - [ ] API slice created with `createAppApi`
   - [ ] Uses `arkFetchBaseQuery` for auth token injection
   - [ ] Registered in store
   - [ ] Response format matches expected structure
   - [ ] TypeScript types defined for request/response
   - [ ] MSW mock created (if applicable)
   - [ ] Works in development

---

### Form Workflow

**When**: Creating forms with validation

#### Step-by-Step

1. **Define Zod schema** with i18n error messages:
   ```typescript
   import { z } from "zod";
   
   const movieSchema = z.object({
     title: z.string().min(1), // Uses default zod-i18n error
     year: z.number().min(1900).max(2100),
     description: z.string().optional(),
     customField: z.string().refine(val => val.includes("test"), {
       params: { i18n: { key: "movies_customFieldError" } },
     }),
   });
   
   type MovieFormData = z.infer<typeof movieSchema>;
   ```

2. **Add custom error to `zodCustom.json`**:
   ```json
   // src/locales/en/zodCustom.json
   {
     "movies_customFieldError": "Field must contain 'test'"
   }
   ```

3. **Set up React Hook Form**:
   ```typescript
   import { useForm } from "react-hook-form";
   import { zod2FormValidator } from "@/lib/i18n/zod2FormValidator";
   
   const {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm<MovieFormData>({
     resolver: zod2FormValidator(movieSchema),
   });
   ```

4. **Build form with Chakra UI**:
   ```typescript
   import { Field } from "@chakra-ui/react";
   import { useTranslation } from "react-i18next";
   
   const { t } = useTranslation();
   
   <form onSubmit={handleSubmit(onSubmit)}>
     <Field.Root invalid={!!errors.title}>
       <Field.Label>{t("movies_titleLabel")}</Field.Label>
       <Input {...register("title")} />
       <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
     </Field.Root>
     
     <Button type="submit">{t("common_submit")}</Button>
   </form>
   ```

5. **Field-level validation** (optional):
   ```typescript
   import { zod2FieldValidator } from "@/lib/i18n/zod2FieldValidator";
   
   <Input
     {...register("title", {
       validate: zod2FieldValidator(movieSchema.shape.title),
     })}
   />
   ```

6. **Testing** (MUST):
   - [ ] Add test case(s) for form validation and submission
   - [ ] Ensure existing tests still pass
   - [ ] Update or delete tests if new request overrides previous functionality

7. **Verification**:
   - [ ] Zod schema defined with proper types
   - [ ] Custom errors in `zodCustom.json` for all languages
   - [ ] Form uses `zod2FormValidator`
   - [ ] All labels/placeholders use translation keys
   - [ ] Error messages display correctly
   - [ ] Form submission works
   - [ ] Validation triggers on blur and submit

---

### Table Workflow

**When**: Implementing data tables with sorting, filtering, pagination

#### Step-by-Step

1. **Use `PaginatedSortableTable` component**:
   ```typescript
   import { PaginatedSortableTable } from "@/lib/components/PaginatedSortableTable";
   import { ColumnDef } from "@tanstack/react-table";
   
   interface Movie {
     id: string;
     title: string;
     year: number;
     rating: number;
   }
   
   const columns: ColumnDef<Movie>[] = [
     {
       accessorKey: "title",
       header: t("movies_titleColumn"),
       enableSorting: true,
       enableColumnFilter: true,
     },
     {
       accessorKey: "year",
       header: t("movies_yearColumn"),
       enableSorting: true,
     },
     {
       accessorKey: "rating",
       header: t("movies_ratingColumn"),
       cell: ({ getValue }) => `⭐ ${getValue()}`,
     },
   ];
   ```

2. **Implement RTK Query hook** (see [API Integration Workflow](#api-integration-workflow))

3. **Use table component**:
   ```typescript
   <PaginatedSortableTable<Movie>
     columns={columns}
     useQueryHook={useGetMoviesQuery}
     isDraggable={true}              // Enable column reordering
     disableHeaderFilters={false}    // Show column filters
     externalFilters={false}         // Use header filters (not external)
   />
   ```

4. **For external filters** (filters outside table headers):
   ```typescript
   const [filters, setFilters] = useState<ColumnFiltersState>([]);
   
   <PaginatedSortableTable<Movie>
     columns={columns}
     useQueryHook={useGetMoviesQuery}
     externalFilters={true}
     externalFiltersState={filters}
   />
   
   {/* Your custom filter UI */}
   <Select onChange={(e) => setFilters([{ id: "genre", value: e.target.value }])}>
     ...
   </Select>
   ```

5. **Custom cell rendering**:
   ```typescript
   {
     accessorKey: "actions",
     header: t("common_actions"),
     cell: ({ row }) => (
       <Button onClick={() => handleEdit(row.original)}>
         {t("common_edit")}
       </Button>
     ),
   }
   ```

6. **Testing** (MUST):
   - [ ] Add test case(s) for table sorting, filtering, and pagination
   - [ ] Ensure existing tests still pass
   - [ ] Update or delete tests if new request overrides previous functionality

7. **Verification**:
   - [ ] API returns correct format (data, count, page, limit)
   - [ ] Columns defined with types
   - [ ] Column headers use translation keys
   - [ ] Sorting works
   - [ ] Filtering works (if enabled)
   - [ ] Pagination works
   - [ ] Drag & drop reordering works (if enabled)
   - [ ] Custom cells render correctly

---

### Theme Workflow

**When**: Adding/modifying colors, semantic tokens, or theme configuration

#### Step-by-Step

1. **Locate theme file**: `src/theme.ts`

2. **Understanding semantic tokens**:
   - Semantic tokens map to actual color values
   - Support light/dark mode automatically
   - Organized by purpose (bg, border, brand, etc.)

3. **Adding new semantic tokens**:
   ```typescript
   // src/theme.ts
   export const theme = createSystem(defaultConfig, {
     theme: {
       semanticTokens: {
         colors: {
           // Add your custom tokens
           myFeature: {
             bg: {
               value: { _light: "{colors.gray.50}", _dark: "{colors.gray.900}" }
             },
             border: {
               value: { _light: "{colors.gray.200}", _dark: "{colors.gray.700}" }
             },
           },
         },
       },
     },
   });
   ```

4. **Use in components**:
   ```typescript
   <Box bg="myFeature.bg" borderColor="myFeature.border">
   ```

5. **Modifying existing tokens**:
   - Find token in `src/theme.ts`
   - Update light/dark values
   - Test in both color modes

6. **Color mode management**:
   - Chakra stores mode in localStorage
   - Set custom key to avoid conflicts:
     ```typescript
     // src/index.tsx
     const colorModeManager = createLocalStorageManager("arkStarters-ColorMode");
     ```

7. **Testing** (MUST):
   - [ ] Add test case(s) for theme changes if applicable
   - [ ] Ensure existing tests still pass
   - [ ] Update or delete tests if new request overrides previous functionality

8. **Verification**:
   - [ ] Semantic tokens follow naming convention
   - [ ] Both light and dark values defined
   - [ ] No hardcoded colors in components
   - [ ] Test in light mode
   - [ ] Test in dark mode
   - [ ] Color contrast meets accessibility standards

---

### Testing Workflow

**When**: Adding or modifying E2E tests

#### Step-by-Step

1. **Cypress test location**: `cypress/e2e/`

2. **Use Testing Library selectors**:
   ```typescript
   // cypress/e2e/movies.cy.ts
   describe("Movies Feature", () => {
     beforeEach(() => {
       cy.visit("/movies");
     });
     
     it("should display movie list", () => {
       cy.findByRole("heading", { name: /movies/i }).should("exist");
       cy.findAllByRole("row").should("have.length.greaterThan", 1);
     });
     
     it("should filter movies by title", () => {
       cy.findByRole("textbox", { name: /search/i }).type("Inception");
       cy.findByText("Inception").should("exist");
     });
   });
   ```

3. **Custom commands** (if needed):
   - Add to `cypress/support/commands.ts`
   - Use throughout tests

4. **Running tests**:
   ```bash
   npm run e2e:start    # Interactive mode (UI)
   npm run e2e:ci       # Headless mode (CI)
   npm test             # Alias for e2e:ci
   ```

5. **MSW mocks** (for E2E mode):
   - Mocks enabled when `VITE_MODE=e2e`
   - Defined in `src/lib/mocks/handlers.ts`
   - Intercepted automatically via service worker

6. **Verification**:
   - [ ] Tests use Testing Library queries
   - [ ] Tests are descriptive and readable
   - [ ] Tests pass in headless mode
   - [ ] No flaky tests (random failures)
   - [ ] Test data uses mocks (not real API)

---

### General Workflow

**When**: Tasks not covered by specific workflows

#### Step-by-Step

1. **Understand the requirement**:
   - Read issue/task description carefully
   - Identify affected files
   - Check for related code patterns

2. **Explore codebase**:
   - Use `grep` to find similar patterns
   - Read existing implementations
   - Check for utilities/helpers

3. **Make minimal changes**:
   - Modify as few files as possible
   - Preserve existing code style
   - Don't fix unrelated issues

4. **Follow code standards**:
   - English code only
   - TypeScript strict mode
   - Named exports
   - Translation keys for UI text
   - Semantic tokens for colors

5. **Test your changes**:
   - Run `npm run lint`
   - Test manually in browser
   - Run relevant tests
   - Check both light and dark modes

6. **Commit**:
   - Follow Conventional Commits format
   - Write clear, concise message
   - Single purpose per commit

---

## Code Standards and Patterns

### Lazy Loading Components

Use `LazyComponent` for routes, `createLazyComponent` for entry points.

```typescript
// Routes (automatic via siteMap.tsx)
export const siteMap: ArkRoute[] = [{
  path: "/dashboard",
  lazy: async () => import("../features/dashboard/dashboardPage"),
}];

// Entry points
import { createLazyComponent } from "@/lib/components/createLazyComponent";
const InitGlobals = createLazyComponent(() => import("./initGlobals"));
```

---

### Image Lazy Loading

All image components support native browser lazy loading for improved performance.

#### Logo Component
```typescript
// src/logo.tsx - Always visible (above the fold), eager loading
<Image 
  src={imgUrl} 
  alt="ARK Logo"
  loading="eager"  // Load immediately
/>
```

#### Avatar Component
```typescript
// Defaults to lazy loading
<Avatar 
  src={userImage}
  name="John Doe"
  // loading="lazy" is default, no need to specify
/>

// Override for above-the-fold avatars
<Avatar 
  src={userImage}
  loading="eager"
/>
```

#### Carousel Component
```typescript
// CarouselItem defaults to lazy loading
<CarouselItem 
  src={imageUrl}
  alt="Product image"
  // loading="lazy" is default
/>

// Override if needed
<CarouselItem 
  src={imageUrl}
  loading="eager"
/>
```

#### General Guidelines
- **Above the fold** (visible on page load): Use `loading="eager"`
- **Below the fold** (requires scrolling): Use `loading="lazy"` (default)
- **Images in lists/tables**: Always use `loading="lazy"`
- **Hero images**: Use `loading="eager"`
- **Thumbnail galleries**: Use `loading="lazy"`

---


### React Component Patterns

#### Functional Components with Hooks
```typescript
import { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface MyComponentProps {
  initialCount?: number;
}

export const MyComponent = ({ initialCount = 0 }: MyComponentProps) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(initialCount);
  
  useEffect(() => {
    // Side effects here
  }, []);
  
  return (
    <Box>
      <Button onClick={() => setCount(count + 1)}>
        {t("common_increment")}
      </Button>
    </Box>
  );
};
```

#### Custom Hooks
```typescript
// src/lib/useAsyncEffect.ts
import { useEffect } from "react";

export const useAsyncEffect = (
  effect: () => Promise<void>,
  deps: React.DependencyList
) => {
  useEffect(() => {
    effect();
  }, deps);
};

// Usage
import { useAsyncEffect } from "@/lib/useAsyncEffect";

useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);
```

#### Debouncing
```typescript
import { useDebounce } from "@/lib/useDebounce";

const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // Trigger search with debouncedSearch
}, [debouncedSearch]);
```

### State Management Patterns

#### Redux Toolkit Slice
```typescript
// src/lib/rtk/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: User | null;
  preferences: UserPreferences;
}

const initialState: UserState = {
  currentUser: null,
  preferences: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { setUser, updatePreferences } = userSlice.actions;
export default userSlice.reducer;
```

### Error Handling

#### Error Boundary Strategy
Multi-level error boundaries protect the application:
- **Root** (`src/index.tsx`) - Critical errors, last resort
- **Router** (`src/lib/router.tsx`) - Navigation and routing errors  
- **Layout** (`src/components/layout/layout.tsx`) - Page-level errors
- **Feature** - Isolate widget/component failures (optional, use sparingly)

#### FeatureErrorBoundary
Use `FeatureErrorBoundary` only for reusable widgets/components embedded within pages, not for entire page views (already protected by Layout).

**Example:**
```typescript
import { FeatureErrorBoundary } from "@/lib/components/FeatureErrorBoundary/FeatureErrorBoundary";

// Wrap reusable widget within a page
<FeatureErrorBoundary featureLabel={t("dashboard_sales_widget")}>
  <SalesWidget />
</FeatureErrorBoundary>

// Custom fallback
<FeatureErrorBoundary fallback={<CustomError />}>
  <ComplexWidget />
</FeatureErrorBoundary>
```

**Key points:**
- Use for embedded widgets/cards that could fail independently
- Don't wrap entire page views (Layout handles this)
- `featureLabel` must be translated (appears in UI)
- Auto-logs to Application Insights
- Provides retry button in default fallback

**Translation keys** (`libComponents.json`):
`featureErrorBoundary_errorInFeature`, `featureErrorBoundary_errorOccurred`, `featureErrorBoundary_unexpectedError`, `featureErrorBoundary_tryAgain`

#### Try-Catch for Async Operations
```typescript
const handleSubmit = async () => {
  try {
    await submitData(formData);
    toast.success(t("common_success"));
  } catch (error) {
    console.error("Submit failed:", error);
    toast.error(t("common_error"));
  }
};
```

### Styling Patterns

#### Responsive Design
```typescript
import { Box } from "@chakra-ui/react";

<Box
  width={{ base: "100%", md: "50%", lg: "33%" }}
  padding={{ base: 4, md: 6, lg: 8 }}
  fontSize={{ base: "sm", md: "md" }}
>
  Responsive content
</Box>
```

#### Conditional Styling
```typescript
<Box
  bg={isActive ? "brand.solid" : "bg.subtle"}
  color={isActive ? "brand.contrast" : "fg.default"}
  _hover={{ bg: "brand.emphasized" }}
  _focus={{ borderColor: "brand.focusRing" }}
>
  Conditional styles
</Box>
```

---

## Verification Procedures

### Before Committing

Run these checks before committing code:

#### 1. Linting
```bash
npm run lint
```
**Expected**: No errors, no warnings (max warnings: 0)

#### 2. TypeScript Compilation
```bash
npx tsc --noEmit
```
**Expected**: No type errors

#### 3. Build
```bash
npm run build
```
**Expected**: Build succeeds, no errors

#### 4. Manual Testing Checklist

**For UI changes**:
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Test keyboard navigation
- [ ] Test with screen reader (if applicable)

**For forms**:
- [ ] Validation triggers correctly
- [ ] Error messages display
- [ ] Submission works
- [ ] Success/error feedback shown

**For translations**:
- [ ] Switch languages and verify text changes
- [ ] Check for missing translation keys (shows key instead of text)
- [ ] Verify all supported languages have translations

**For API integration**:
- [ ] API calls succeed
- [ ] Loading states display
- [ ] Error states display
- [ ] Data displays correctly

#### 5. E2E Tests (if applicable)
```bash
npm test
```
**Expected**: All tests pass

---

## File-Specific Context

### `src/index.tsx`
**Purpose**: Application entry point, provider setup

**Key responsibilities**:
- Initialize authentication provider
- Configure Redux store
- Set up color mode manager
- Configure i18n
- Render App component

**When to modify**:
- Switching auth providers
- Adding new Redux slices
- Changing color mode storage key
- Modifying app-wide providers

---

### `src/theme.ts`
**Purpose**: Chakra UI theme configuration

**Key responsibilities**:
- Define semantic tokens
- Configure color schemes
- Set typography scales
- Define z-index values

**When to modify**:
- Adding new semantic tokens
- Changing brand colors
- Updating typography
- Modifying component variants

---

### `src/config/lang.ts`
**Purpose**: i18n configuration

**Key responsibilities**:
- Define supported languages
- Set default language
- Configure language switcher display

**When to modify**:
- Adding new language support
- Changing default language

---

### `src/config/gdpr.ts`
**Purpose**: GDPR/cookie consent configuration

**Key responsibilities**:
- Define cookie categories
- Configure consent banner
- Set policy URLs

**When to modify**:
- Adding new cookie categories
- Changing consent behavior
- Updating privacy policy links

---

### `src/lib/rtk/store.ts`
**Purpose**: Redux store configuration

**Key responsibilities**:
- Configure reducers
- Add middleware
- Register RTK Query APIs

**When to modify**:
- Adding new slice
- Adding new RTK Query API
- Adding custom middleware

---

### `src/lib/authentication/authProvider.ts`
**Purpose**: Authentication provider interface

**When to modify**:
- Adding methods to auth interface (affects all providers)
- Changing auth token structure

---

### `src/lib/i18n/formatters.ts`
**Purpose**: Custom i18next formatters for dates, currency, etc.

**When to modify**:
- Adding new date/number formatters
- Changing formatting logic

---

### `public/connectionStrings.cjs`
**Purpose**: Serve environment variables to frontend

**Key responsibilities**:
- Read from `.env.local` in development
- Serve as `window.appSettings`

**When to modify**:
- Adding new environment variables
- Changing auth provider (requires different env vars)

---

## Troubleshooting Guide

### Build Errors

#### Error: "Module not found"
**Cause**: Missing dependency or incorrect import path

**Fix**:
1. Check package.json for dependency
2. Run `npm install` if missing
3. Verify import path uses `@/` alias correctly
4. Check file exists at expected path

---

#### Error: "TypeScript: Type 'X' is not assignable to type 'Y'"
**Cause**: Type mismatch

**Fix**:
1. Check interface/type definitions
2. Ensure data structure matches expected type
3. Use type assertion if certain: `data as ExpectedType`
4. Add type guard for runtime checking

---

### Runtime Errors

#### Error: "Cannot read property 'X' of undefined"
**Cause**: Accessing property on null/undefined object

**Fix**:
1. Add optional chaining: `object?.property`
2. Add null check: `if (object) { ... }`
3. Provide default value: `object ?? defaultValue`
4. Check why object is undefined (API call failed, not initialized, etc.)

---

#### Error: "Maximum update depth exceeded"
**Cause**: Infinite re-render loop

**Fix**:
1. Check `useEffect` dependencies
2. Don't update state unconditionally in render
3. Memoize callbacks with `useCallback`
4. Memoize values with `useMemo`

---

### Test Failures

#### Error: "Element not found"
**Cause**: Cypress can't find element with selector

**Fix**:
1. Check element exists in DOM
2. Wait for element to appear: `cy.findByText("text").should("exist")`
3. Use correct Testing Library query
4. Check translation key is correct
5. Ensure MSW mock returns expected data

---

#### Error: "Test is flaky (passes sometimes)"
**Cause**: Race condition or timing issue

**Fix**:
1. Add explicit waits: `cy.wait('@apiCall')`
2. Use `should` assertions instead of direct commands
3. Wait for API responses before asserting
4. Don't rely on fixed timeouts

---

### Development Issues

#### Issue: "Changes not reflecting in browser"
**Cause**: Cache or build issue

**Fix**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Restart dev server
4. Check file is saved
5. Verify file is in correct location

---

#### Issue: "Language switch doesn't work"
**Cause**: Translation files not loaded or config issue

**Fix**:
1. Check `src/config/lang.ts` includes language
2. Verify translation files exist in `src/locales/{lang}/`
3. Restart dev server to reload translations
4. Check browser console for i18n errors

---

## Additional Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Chakra UI v3](https://chakra-ui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router v7](https://reactrouter.com/)
- [i18next](https://www.i18next.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TanStack Table v8](https://tanstack.com/table/latest)
- [Cypress](https://docs.cypress.io/)
- [Vite](https://vitejs.dev/)

### Project-Specific
- [Conventional Commits](https://www.conventionalcommits.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

## Success Criteria by Task Type

Use these checklists to verify your work before completing:

### UI Component
- [ ] Component uses TypeScript with strict types
- [ ] All text uses translation keys
- [ ] Colors use semantic tokens
- [ ] Component is accessible (keyboard, ARIA labels)
- [ ] Works in light and dark modes
- [ ] Responsive design implemented
- [ ] No ESLint errors
- [ ] Named export used
- [ ] **Test case(s) added for the component/feature**
- [ ] **Existing tests pass or updated appropriately**

### Translation
- [ ] Keys added to ALL supported languages
- [ ] Keys follow naming convention
- [ ] Correct namespace used
- [ ] No hardcoded strings in components
- [ ] Language switching works
- [ ] **Test case(s) added for translation keys**
- [ ] **Existing tests pass or updated appropriately**

### Authentication
- [ ] AuthProvider interface implemented
- [ ] Login/logout flows work
- [ ] Token refresh works
- [ ] Protected routes enforce permissions
- [ ] Environment variables documented
- [ ] No secrets in code
- [ ] **Test case(s) added for auth flows**
- [ ] **Existing tests pass or updated appropriately**

### API Integration
- [ ] RTK Query API created with `createAppApi`
- [ ] Uses `arkFetchBaseQuery`
- [ ] Registered in store
- [ ] TypeScript types defined
- [ ] Response format matches expectations
- [ ] MSW mock created (if needed)
- [ ] Auth token included in requests
- [ ] **Test case(s) added for API endpoints**
- [ ] **Existing tests pass or updated appropriately**

### Form
- [ ] Zod schema defined
- [ ] Form uses `zod2FormValidator`
- [ ] Custom errors in `zodCustom.json`
- [ ] All labels/placeholders translated
- [ ] Validation works on blur and submit
- [ ] Error messages display correctly
- [ ] Success/error feedback shown
- [ ] **Test case(s) added for form validation and submission**
- [ ] **Existing tests pass or updated appropriately**

### Table
- [ ] API returns correct format (data, count, page, limit)
- [ ] Columns defined with TypeScript types
- [ ] Headers use translation keys
- [ ] Sorting works
- [ ] Filtering works (if enabled)
- [ ] Pagination works
- [ ] Custom cells render correctly
- [ ] **Test case(s) added for table functionality**
- [ ] **Existing tests pass or updated appropriately**

### Theme
- [ ] Semantic tokens properly defined
- [ ] Light and dark values specified
- [ ] No hardcoded colors in components
- [ ] Tested in both color modes
- [ ] Color contrast meets accessibility standards
- [ ] **Test case(s) added if applicable**
- [ ] **Existing tests pass or updated appropriately**

### Testing
- [ ] Tests use Testing Library queries
- [ ] Tests are descriptive
- [ ] Tests pass in headless mode
- [ ] No flaky tests
- [ ] MSW mocks configured correctly

---

**Last Updated**: 2026-01-09
**Document Version**: 1.0.0
