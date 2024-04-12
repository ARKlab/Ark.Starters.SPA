# ARK Starters Single Page Application

# Introduction

In this project, we've curated a collection of UI elements, layouts, and interactions to demonstrate best practices in user interface design. Each section focuses on a specific aspect of UI.

## Packages

In order to mantain this project with the most updated version of LTS's packages:

Run `npm outdated` to see a table of packages with the current version, wanted version, and latest version.

To update a specific package, you can use `npm update package_name` This will update the package to the 'wanted' version, which is the maximum version that satisfies the versioning range specified in package.json.

In order to Update all packages you can also use the command `npx npm-check-updates` that upgrades your package.json dependencies to the latest versions, ignoring specified versions.

# Features

- **Flexible Authentication Provider:** This project include the authentication provider library that supports multiple authentication providers. You can easily support the providers you need.

- **Diverse Examples:** From simple buttons to complex navigation menus, the project covers a wide range of UI elements commonly found in web and mobile applications.

- **Accessible Components:** Explore implementations that prioritize accessibility, making your UIs inclusive and usable for everyone.

- **Code Snippets:** Each example comes with corresponding code snippets, making it easy for developers to integrate these UI patterns into their projects.

# Getting Started

TODO: this section would provide examples on how to run the template and how to use it

## Design Guidelines

When styling components, we follow these guidelines:

### Support for Light and Dark mode

The application supports natively both light and dark mode.
The way this works is that chackra save a variable in the localStorage with either 'Light' or 'Dark'.
On a deployed environment this do not rapresent any problem but, locally, having multiple chackra projects could mess with this setting and leading to unwanted bheaviour such as having the swith reversed (having light theme when Dark mode is selected).
To avoid this ensure to set a custom name to this variable in the **index.tsx** file:

```typescript
const colorModeManager = createLocalStorageManager("appName-ColorMode");
```

and then pass it in the **Provider**:

```jsx
<ChakraProvider  theme={theme}  colorModeManager={colorModeManager}>
```

### Z-Index usage

For any need of z-Index, we refer to the zIndices guideline of Chackra UI

the only accepted values for any zIndex property across the project would be one of the followings:

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

### Distancing

1.  **Use `em` units for font sizes and other measurements related to text**: This makes the design more flexible and accessible, as `em` units adjust automatically to the user's default font size. For example, instead of `fontSize="16px"`, use `fontSize="1em"`.

2.  **Use `px` units for margins and padding**: These measurements are often not related to text size, so it's okay to use `px` units for them. For example, `mx="5px"`.

Remember to test your design at different browser font sizes to make sure it looks good and is easy to read for all users.

## Tables

Tables are implemented with Tanstack (react tables v8)

In the template there is a component (PaginatedSortableTable) ready for the most common use, completely compatible with standard ARK APIs.

**Ex:**

```jsx

<PaginatedSortableTable<T>
columns={columns}
useQueryHook={useGetMoviesQuery}
isDraggable
/>

```

**Props:**

```Typescript

type  PaginatedSortableTableProps<T>  =  {
columns:  ColumnDef<T>[];
useQueryHook:  (args:  {
	pageIndex:  number;
	pageSize:  number;
	sorting:  SortingState;
	filters:  ColumnFiltersState;
})  =>  any;
isDraggable?:  boolean;
disableHeaderFilters?:  boolean;
externalFilters?:  boolean;
externalFiltersState?:  ColumnFiltersState;

};

```

**columns:** an Array of ColumnDef<T> that specify the columns with all the props needed (see Tanstack docs)

**useQueryHook:** The query hook generated by your Redux Toolkit Query API for fetching table data that should return an object like this

```json
data: {
	data: retData.data,
	count: retData.count,
	page: page,
	limit: pageSize,
}
```

**isDraggable:** Enables column sorting trough drag & drop

**disableHeaderFilters:** this remove all the column headers filters (if you dont want to specify all _false_ in the **columns** array

**externalFilters:** this enable the use of external filters (external means that filters are not in the columns header)

**externalFiltersState:** _ColumnFiltersState_ object with the state of external filters (this is mandatory if **externalFilters** is true

## Environment (env)

The application initializes itself by reading environmental variables and injecting them into the Redux store (env). Additionally, the Authentication provider constructor receives _env_ as a parameter, containing all the necessary configurations.
_env_ is an object of type **CustomSettingsType** defined as it follows:

```typescript
type CustomSettingsType = {
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

This will be used as globals configuration and can be implemented to support more features (ex: subsidiaries).

## Authentication

This project is implemented with a flexible authentication provider that can support multiple providers.
Now it support **MSAL** and **AUTH0** providers and you can switch between one another easily.
This is how:

1.  Go to the **index.tsx** file
2.  Instantiate the implementation of your choice of AuthProvider interface

```Typescript
const  authProvider  =  new  Auth0AuthProvider(env);
```

in this case we choose the **Auth0** implementation.
_env_ is the enviroment and it must contains all the data needed to authenticate with the provider(all details in the specific implementations below).
For this reason make sure that the **connectionStrings.js** file is aligned with the deploy environments you are using.
In order to make this works locally you must create a **.env.local** file in the root of your project with all the env variables needed by connectionStrings.js and your AuthProvider implementation.

### Auth0:

#### .env.local

```javascript
AUTH0_ClientId = "yourclientId";
AUTH0_Domain = "yourDomain";
AUTH0_Audience = "https://yourAudience.auth0.com/api/v2/";
AUTH0_RedirectUri = "yourRedirectUri";
SERVICE_URL = "yourApi.com";
```

#### connectionStrings.js

```javascript
var http = require("http");
var port = process.env.port;
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.local" });
}
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(`
		window.customSettings = {
		clientID: "${process.env["AUTH0_ClientId"]}",
		domain: "${process.env["AUTH0_Domain"]}",
		audience: "${process.env["AUTH0_Audience"]}",
		redirectUri: "${process.env["AUTH0_RedirectUri"]}",
		serviceUrl: "${process.env["SERVICE_URL"]}",
		};
	`);
  })
  .listen(port);
```

### MSAL

#### .env.local

```javascript
PORT = 4000;
MSAL_ClientId = "yourclientId";
MSAL_Domain = "yourDomain";
MSAL_Scopes = "YourScopes";
MSAL_knownAuthorities = "yourKnownAutorities";
MSAL_authority = "YourMsalAutority";
MSAL_RedirectUri = "yourRedirectUri";
SERVICE_URL = "yourApi.com";
```

#### connectionStrings.js

```javascript
var http = require("http");
var port = process.env.port;
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.local" });
}
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(`
		window.customSettings = {
		clientID: "${process.env["MSAL_ClientId"]}",
		domain: "${process.env["MSAL_Domain"]}",
		scopes: "${process.env["MSAL_Scopes"]}",
		authority:"${process.env["MSAL_authority"]}",
		knownAuthorities:"${process.env["MSAL_knownAuthorities"]}",
		redirectUri: "${process.env["MSAL_RedirectUri"]}",
		serviceUrl: "${process.env["SERVICE_URL"]}",
		};
	`);
  })
  .listen(port);
```

### Adding providers

In order to add support for more providers you will implement your own version of the AuthProvider interface.
Here is the interface:

```typescript
export interface AuthProvider {
  /**
   * Initializes the authentication module with configuration data,
   * typically fetched from Azure, and stores it in the Redux store.
   */
  init: () => Promise<void>;
  /**
   * Initiates the login process.
   */
  login: () => void;
  /**
   * Initiates the logout process.
   */
  logout: () => void;
  /**
   * Retrieves the authentication token information
   * if token is not valid token will be refreshed silently
   * @returns The authentication token information.
   */
  handleLoginRedirect: () => Promise<void>;
  getToken: (audience?: string) => TokenResponse;
  /*
   * Checks whether the current user has the specified permission.
   *
   * @param permission - The permission to check.
   * @returns true if the user has the permission, false otherwise.
   */
  hasPermission: (permission: string, audience?: string) => boolean;
  /**
   * Provides information about the current login status,
   * including whether the authentication process is loading, any data retrieved,
   * and any encountered errors.
   */
  getLoginStatus: () => LoginStatus;
  /**
   * Provides information about the current token retrieval status,
   * including whether the process is loading, any data retrieved,
   * and any encountered errors.
   */
  getUserDetail: () => Promise<UserAccountInfo | null>;
}
```

# Build and Test

TODO: Describe and show how to build your code and run the tests.
