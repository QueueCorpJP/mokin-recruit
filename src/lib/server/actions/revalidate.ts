import { revalidatePath } from 'next/cache';

const companyPaths = [
  '/company/account',
  '/company/job',
  '/company/message',
  '/company/task',
  '/company/mypage',
];

export function revalidateCompanyPaths(...paths: string[]) {
  const targets = paths.length > 0 ? paths : companyPaths;
  for (const p of targets) {
    try {
      revalidatePath(p);
    } catch (e) {
      // Non-fatal: best-effort
      console.warn('revalidatePath failed:', p, e);
    }
  }
}
