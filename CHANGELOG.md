# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Demo pages for `AppPageTitle` ("Page Title") and `FeatureErrorBoundary` ("Feature Error Boundary") in the main menu.

### Changed

- The "Posts" demo page moved from `/jsonplaceholder` to `/posts`.
- Menu labels of the two table demos describe what they show: "Table: Sort, Filter & Drag" (movies) and "Table with Insert Form" (video games).
- API mocking uses MSW v3 and its built-in Vite plugin (`msw/vite`) instead of `@iodigital/vite-plugin-msw`.

### Fixed

- `AppConfirmationDialog`: the Close button now closes the dialog.
- `AppDatePicker`: the calendar popup has a solid, theme-aware background and opens above sticky table headers.
- `AppFileUpload`: the dropzone icon and text are centered inside the dropzone instead of overflowing it.
