export function getNonce(): string {
  if (globalThis.crypto && 'randomUUID' in globalThis.crypto) {
    try {
      return globalThis.crypto.randomUUID();
    } catch {}
  }
  return Math.random().toString(36).slice(2);
}
