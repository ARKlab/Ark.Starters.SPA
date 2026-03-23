/**
 * Centralized API URL configuration
 * All API base URLs should be defined here using environment variables
 */

export const API_URLS = {
  admin: import.meta.env.VITE_ADMIN_API_BASE_URL,
  portal: import.meta.env.VITE_PORTAL_API_BASE_URL,
  artesian: import.meta.env.VITE_ARTESIAN_BASE_URL,
} as const;
