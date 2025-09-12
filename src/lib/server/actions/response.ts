export type Ok<T = undefined> = { success: true; data?: T };
export type Fail = { success: false; error: string; code?: string };

export function ok<T = undefined>(data?: T): Ok<T> {
  return { success: true, ...(data === undefined ? {} : { data }) } as Ok<T>;
}

export function fail(error: string, code?: string): Fail {
  return { success: false, error, ...(code ? { code } : {}) };
}
