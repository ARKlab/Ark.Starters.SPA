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

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages.

#### Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

#### Suggested Scopes
Use these scopes to indicate the area of change:

- **auth**: Authentication related changes (Auth0, MSAL)
- **i18n**: Localization and internationalization
- **ui**: UI components and styling (Chakra UI, theme)
- **routing**: React Router configuration and navigation
- **state**: Redux Toolkit and state management
- **forms**: React Hook Form and form validation
- **tables**: TanStack Table implementations
- **pwa**: PWA configuration and service workers
- **gdpr**: Cookie consent and GDPR compliance
- **api**: API integration and RTK Query
- **config**: Configuration files
- **deps**: Dependency updates
- **dx**: Developer experience (tooling, scripts)
- **a11y**: Accessibility improvements
- **e2e**: End-to-end tests with Cypress

#### Examples
```bash
feat(auth): add support for custom MSAL scopes
fix(i18n): resolve translation key not found error
docs(readme): update authentication setup instructions
style(ui): apply consistent spacing to form components
refactor(tables): extract pagination logic to custom hook
perf(api): add caching to movie list queries
test(e2e): add tests for login flow
build(deps): upgrade React to 19.2.0
ci(workflow): add CodeQL security scanning
chore(config): update ESLint rules
```

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
