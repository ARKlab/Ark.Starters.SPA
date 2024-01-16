# ARK Starters Single Page Application

# Introduction

In this project, we've curated a collection of UI elements, layouts, and interactions to demonstrate best practices in user interface design. Each section focuses on a specific aspect of UI.

## Packages

In order to mantain this project with the most updated version of LTS's packages:

Run `npm outdated` to see a table of packages with the current version, wanted version, and latest version.

To update a specific package, you can use `npm update package_name` This will update the package to the 'wanted' version, which is the maximum version that satisfies the versioning range specified in package.json.

In order to Update all packages you can also use the command `npx npm-check-updates` that upgrades your package.json dependencies to the latest versions, ignoring specified versions.

# Features

- **Diverse Examples:** From simple buttons to complex navigation menus, the project covers a wide range of UI elements commonly found in web and mobile applications.

- **Accessible Components:** Explore implementations that prioritize accessibility, making your UIs inclusive and usable for everyone.

- **Code Snippets:** Each example comes with corresponding code snippets, making it easy for developers to integrate these UI patterns into their projects.

# Getting Started

TODO: this section would provide examples on how to run the template and how to use it

## Design Guidelines

When styling components, we follow these guidelines:

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

```Typescript
<PaginatedSortableTable<T>
columns={columns}
useQueryHook={useGetMoviesQuery}
isDraggable
/>
```

**Props:**

```Typescript
type  PaginatedSortableTableProps<T>  = {
columns:  ColumnDef<T>[];
useQueryHook:  (args: {
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

    data: {
    	data:  retData.data,
    	count:  retData.count,
    	page:  page,
    	limit:  pageSize,
    }

**isDraggable:** Enables column sorting trough drag & drop
**disableHeaderFilters:** this remove all the column headers filters (if you dont want to specify all _false_ in the **columns** array
**externalFilters:** this enable the use of external filters (external means that filters are not in the columns header)
**externalFiltersState:** _ColumnFiltersState_ object with the state of external filters (this is mandatory if **externalFilters** is true

# Build and Test

TODO: Describe and show how to build your code and run the tests.
