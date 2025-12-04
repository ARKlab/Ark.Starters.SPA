# GitHub Copilot Instructions for ARK Starters SPA

## Project Overview

This is a React Single Page Application (SPA) starter template designed to demonstrate UI best practices with enterprise-grade features including flexible authentication, localization, PWA support, and GDPR compliance.

## Tech Stack

- **Framework**: React 19.2.0 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **UI Library**: Chakra UI 3.30.0 with Emotion
- **State Management**: Redux Toolkit 2.9.1
- **Routing**: React Router 7.9.6
- **Authentication**: Auth0 & MSAL (Azure AD B2C)
- **Localization**: i18next 25.6.3 with react-i18next
- **Forms**: React Hook Form 7.66.1 with Zod 4.1.12 validation
- **Tables**: TanStack Table 8.21.3
- **Testing**: Cypress 15.7.0 for E2E
- **PWA**: vite-plugin-pwa 1.1.0
- **Drag & Drop**: react-dnd 16.0.1

## Code Style & Standards

### Code Language Standards

**CRITICAL RULE**: All codebase must be in English, except for translation files.

This includes:
- **Variable names**: Use English names (e.g., `userName` not `nomeUtente`)
- **Function names**: Use English names (e.g., `getUserData` not `ottieniDatiUtente`)
- **Class and interface names**: Use English names
- **File names**: Use English names (e.g., `userProfile.tsx` not `profiloUtente.tsx`)
- **Code comments**: Write all comments in English
- **Test descriptions**: Write all test names and descriptions in English
- **Console logs and debug messages**: Use English

**Exceptions**:
- Translation files (`src/locales/*/`) can contain any language
- User-facing content that goes through translation system

**Example**:
```typescript
// ✅ Correct - English code
const userName = "John";
function fetchUserData() { /* ... */ }

// ❌ Wrong - Non-English code
const nomeUtente = "John";
function ottieniDatiUtente() { /* ... */ }
```

### TypeScript
- Use strict TypeScript configuration
- Prefer type inference over explicit types when obvious
- Use `interface` for object shapes, `type` for unions/intersections
- Enable all strict compiler options
- No `any` types - use `unknown` if necessary

### React Patterns
- Use functional components with hooks exclusively
- Use React Compiler (babel-plugin-react-compiler) enabled
- Prefer named exports over default exports
- Use `@emotion/react` for styled components with Chakra UI
- Component files should use `.tsx` extension

### Styling Guidelines

#### Units
- Use Chakra [Style](https://chakra-ui.com/docs/styling/style-props/sizing) properties units 
- Avoid use `px` units 
- Test designs at different browser font sizes for accessibility

#### Color Modes
- Support both light and dark modes natively
- Use Chakra UI's color mode system

#### Z-Index
Only use Chakra UI's predefined z-index values:
```typescript
const zIndices = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};
```

#### Semantic Tokens
- **DO NOT** use hardcoded colors directly in components
- **ALWAYS** use [semantic tokens](https://chakra-ui.com/docs/theming/semantic-tokens) defined in `theme.ts`
- Customize `theme.ts` to add new semantic tokens as needed
- Semantic tokens support light/dark mode automatically

Example of using semantic tokens:
```typescript
// ❌ Bad - hardcoded colors
<Box bg="blue.500" color="#ffffff">

// ✅ Good - semantic tokens
<Box bg="brand.solid" color="brand.contrast">
```

Available semantic token categories in theme.ts:
- `bg.*` - Background colors (e.g., `bg.info`)
- `border.*` - Border colors
- `brand.*` - Brand colors (solid, contrast, fg, muted, subtle, emphasized, focusRing)
- `primary.*` - Primary palette
- `error.*` - Error states
- `code.*` - Code highlighting


### File Organization
```
src/
├── app/              # Application routes and pages
├── components/       # Reusable UI components
├── config/           # Configuration files (lang, gdpr, etc.)
├── features/         # Feature-specific modules
├── lib/              # Shared libraries and utilities
│   ├── authentication/
│   ├── errorHandler/
│   ├── i18n/
│   ├── mocks/
│   └── rtk/
├── locales/          # Translation files
└── siteMap/          # Site navigation structure
```

## Authentication

### Flexible Provider System
The project supports multiple authentication providers through a common interface. Choose provider in `index.tsx`:

```typescript
// Auth0
const authProvider = new Auth0AuthProvider(env);

// OR MSAL (Azure AD B2C)
const authProvider = new MsalAuthProvider(env);
```

### AuthProvider Interface
All authentication providers must implement:
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

### Environment Configuration
Use `AppSettingsType` for auth configuration:
```typescript
type AppSettingsType = {
  clientID: string;
  domain: string;
  scopes: string;
  knownAuthorities: string;
  signUpSignInPolicyId: string;
  serviceUrl: string;
  redirectUri: string;
  authority: string;
  audience: string;
};
```

### Protected Routes
```typescript
import { ProtectedRoute } from "@/lib/authentication/components/protectedRoute";

<ProtectedRoute permission="required.permission">
  <YourComponent />
</ProtectedRoute>
```

## Localization (i18n)

### Configuration
- Configure supported locales in `src/config/lang.ts`
- Translation files in `src/locales/{lang}/translation.json`
- Auto-detect based on browser settings
- Use vscode i18n-ally extension for development

### Translation Namespace Organization

**CRITICAL RULES** for organizing translations:

1. **All UI text must be translated**:
   - All labels, placeholders, aria-labels, titles, and button text must use translation keys
   - Never use hardcoded English (or any other language) strings in UI components

2. **Namespace separation by component location**:
   - Components in `src/lib/components/` **MUST** use the `libComponents` namespace
   - Components in `src/components/` or `src/features/` **MUST** use the default `translation` namespace
   - This separation ensures reusable lib components don't pollute the application namespace

3. **Translation file structure**:
   ```
   src/locales/
   ├── en/
   │   ├── translation.json      # For src/components and src/features
   │   ├── libComponents.json    # For src/lib/components
   │   ├── gdpr.json
   │   ├── zodCustom.json
   │   └── template.json
   └── it/
       └── (same structure)
   ```

4. **Using the libComponents namespace**:
   ```typescript
   // In src/lib/components/AppDatePicker/appDatePicker.tsx
   import { useTranslation } from "react-i18next";
   
   const { t } = useTranslation();
   // Use libComponents namespace prefix
   const label = t("libComponents:appDatePicker_openDatePicker");
   ```

5. **Using the default namespace**:
   ```typescript
   // In src/features/movies/moviePage.tsx
   import { useTranslation } from "react-i18next";
   
   const { t } = useTranslation();
   // No namespace prefix needed for default namespace
   const title = t("movies_movies");
   ```

### Usage
```typescript
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
return <p>{t("common.welcome")}</p>;
```

### Zod Integration
Use custom error messages with i18n:
```typescript
const schema = z.object({
  email: z.string().email(),
  customField: z.number().refine(x => x < 3, {
    params: { i18n: { key: "custom_error" } },
  }),
});
```

Use helpers for form validation:
- `zod2FormValidator` - Validate entire form
- `zod2FieldValidator` - Validate individual fields

### Date Formatting

**IMPORTANT**: Date formatting uses i18next custom formatters for proper localization and reactivity.

#### React Components
**ALWAYS** use the `t` function from `useTranslation()` hook in React components:

```typescript
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();
  
  // ISO date (YYYY-MM-DD)
  const isoDate = t('{{val, isoDate}}', { val: new Date() });
  
  // Short date (localized)
  const shortDate = t('{{val, shortDate}}', { val: new Date() });
  
  // Long date with weekday (localized)
  const longDate = t('{{val, longDate}}', { val: new Date() });
  
  // Date with custom format (uses date-fns format strings)
  const customDate = t('{{val, dateFormat}}', { 
    val: new Date(), 
    format: 'dd/MM/yyyy' 
  });
  
  // Date and time (localized)
  const dateTime = t('{{val, dateTime}}', { val: new Date() });
};
```

**Why use the hook?** The `useTranslation()` hook ensures components re-render when the language changes, maintaining proper React reactivity.

#### Non-React Contexts
For utility functions, helper files, or server-side code, use the formatDate.ts helpers:

```typescript
import { formatISODate, formatShortDate } from "@/lib/i18n/formatDate";

// In a utility function
function processDate(date: Date): string {
  return formatISODate(date); // Returns YYYY-MM-DD
}
```

#### Available Formatters
The project provides these i18next custom formatters (defined in `src/lib/i18n/formatters.ts`):
- **`isoDate`**: ISO 8601 format (YYYY-MM-DD)
- **`shortDate`**: Localized short date (e.g., "12/31/2024" or "31/12/2024")
- **`longDate`**: Localized long date with weekday (e.g., "Wednesday, December 31, 2024")
- **`dateTime`**: Localized date and time
- **`dateFormat`**: Custom format using date-fns format strings (e.g., "dd/MM/yyyy", "PPP")

#### Currency Formatting
Currency formatting also uses i18next and **requires** explicit currency code:

```typescript
const { t } = useTranslation();

// ✅ Correct - currency code required
const formatted = t('{{val, currency}}', { 
  val: 123.45, 
  currency: 'EUR' 
});

// ❌ Wrong - no default currency
const formatted = t('{{val, currency}}', { val: 123.45 });
```

#### ESLint Rules
- Direct imports of `format` or `formatDate` from `date-fns` are blocked by ESLint
- Exception: `src/lib/i18n/formatters.ts` (extends i18n functionality)
- React components must use `useTranslation()` hook, not global `i18next.t()`

## State Management

### Redux Toolkit
- Use RTK Query for API calls
- Feature-based slice organization in `src/lib/rtk/`
- Store configuration in application initialization

### API Integration
```typescript
// Define API with RTK Query using arkFetchBaseQuery
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
  }),
});
```

## Components

### Tables
Use `PaginatedSortableTable` component with TanStack Table:
```typescript
<PaginatedSortableTable<T>
  columns={columns}
  useQueryHook={useGetMoviesQuery}
  isDraggable={true}
  disableHeaderFilters={false}
  externalFilters={false}
/>
```

Expected API response format:
```typescript
{
  data: T[],      // Array of items
  count: number,  // Total count
  page: number,   // Current page
  limit: number,  // Page size
}
```

### Forms
- Use React Hook Form with Zod validation
- Integrate with Chakra UI form components
- Use translation keys for error messages

### Drag & Drop
- Use react-dnd with HTML5 backend
- Enable with `isDraggable` prop in tables

## PWA Support

### Configuration
- Configured in `vite.config.ts` with `vite-plugin-pwa`
- Assets generated with `@vite-pwa/assets-generator`
- Service worker for offline support
- Disabled in E2E mode to avoid conflicts with MSW

### Testing PWA Updates
1. Run `npm run build`
2. Run `npm run preview`
3. Stop server, make changes
4. Rebuild and restart preview
5. Update popup should appear
6. Clear site data before returning to development

## GDPR & Cookie Consent

### Configuration
Edit `src/config/gdpr.ts` for cookie consent settings.

### Default Cookies
- **lang**: Language preference
- **dark theme**: Color mode (from Chakra UI)
- **auth**: Authentication tokens (provider-specific)

### Limitations
- Only external policy URLs supported
- Banner is blocking by default
- Use translation files for embedded policies

## Testing

### Cypress E2E
- Tests in `cypress/e2e/`
- Configuration in `cypress.config.ts`
- Code coverage enabled with `@cypress/code-coverage`

### Running Tests
```bash
npm run e2e:start      # Interactive mode
npm run e2e:ci         # CI mode (headless)
npm test               # Alias for e2e:ci
```

### Writing Tests
- Use Testing Library selectors
- Follow existing test patterns in `cypress/e2e/`
- Use custom commands from `cypress/support/`

## Error Handling

### Error Boundary
- Global error boundary in place
- Custom error fallback UI
- Integration with Application Insights

### Application Insights
- Configured for telemetry
- Click analytics enabled
- Error tracking and reporting

## Development

### Prerequisites
- Node.js 24.x
- npm >= 10

### Scripts
```bash
npm start              # Development server
npm run build          # Production build
npm run lint           # Run ESLint
npm test               # Run E2E tests
```

### Environment Setup
1. Create `.env.local` file in project root
2. Add required environment variables for chosen auth provider
3. Configure `public/connectionStrings.cjs` to serve env vars

### Code Quality
- ESLint with TypeScript, React, and accessibility rules
- Prettier for code formatting (configured in `.prettierrc`)
- Strict TypeScript checking enabled
- React Compiler for optimization

## Best Practices

### Performance
- Use React Compiler for automatic optimizations
- Lazy load routes and heavy components
- Optimize images with vite-plugin-image-optimizer
- Enable legacy browser support when needed

### Accessibility
- Use semantic HTML elements
- Follow WCAG guidelines
- Test with screen readers
- Use Chakra UI's accessible components
- Use eslint-plugin-jsx-a11y rules

### Security
- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user inputs with Zod
- Follow OWASP security best practices
- Review auth provider security docs

### Comments
- Only add comments when necessary to explain complex logic
- Match existing comment style in the file
- Prefer self-documenting code

### Dependencies
- Use existing libraries when possible
- Only add new dependencies if absolutely necessary
- Keep dependencies up to date with renovate
- Check compatibility with engines requirement (Node 24.x)

## Common Patterns

### Async Operations
Use custom `useAsyncEffect` hook for async side effects:
```typescript
import { useAsyncEffect } from "@/lib/useAsyncEffect";

useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);
}, [dependency]);
```

### Debouncing
Use `useDebounce` hook for input debouncing:
```typescript
import { useDebounce } from "@/lib/useDebounce";

const debouncedValue = useDebounce(value, 500);
```

### Route Changes
Use `useRouteChanged` hook to detect route changes:
```typescript
import { useRouteChanged } from "@/lib/useRouteChanged";

useRouteChanged((location) => {
  // Handle route change
});
```

### GDPR Consent
Check and manage cookie consent:
```typescript
import { useGDPRConsent } from "@/lib/useGDPRConsent";

const { hasConsent, checkConsent } = useGDPRConsent();

if (checkConsent("analytics")) {
  // Initialize analytics
}
```

## Migration & Updates

### Package Updates
```bash
npm outdated                    # Check outdated packages
npm update package_name         # Update specific package
npx npm-check-updates           # Update all to latest
```

### Breaking Changes
- Test thoroughly after updates
- Check Chakra UI migration guides
- Review React Router changes
- Test authentication flows

## Additional Resources

- [Chakra UI Documentation](https://chakra-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Table](https://tanstack.com/table)
- [i18next](https://www.i18next.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)
