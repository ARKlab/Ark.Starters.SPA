export function generateUniqueKey(
  fallbackKeyPrefix: string = "fallback"
): string {
  const randomSuffix = Math.random().toString(36).substring(7);
  return `${fallbackKeyPrefix}_${randomSuffix}`;
}
