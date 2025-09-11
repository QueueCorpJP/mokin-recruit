export function parseJsonField<T>(
  formData: FormData,
  key: string,
  fallback: T
): T {
  const raw = formData.get(key)?.toString();
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`${key} JSON parse error:`, e);
    return fallback;
  }
}
