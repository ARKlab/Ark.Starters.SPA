# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- API mocking uses MSW v3 and its built-in Vite plugin (`msw/vite`) instead of `@iodigital/vite-plugin-msw`.

### Fixed

- `AppConfirmationDialog`: the Close button now closes the dialog.
- `AppDatePicker`: the calendar popup has a solid, theme-aware background and opens above sticky table headers.
