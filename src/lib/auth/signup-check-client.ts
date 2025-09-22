'use client';

/**
 * クライアントサイドでサインアップ途中かどうかをチェック
 */
export function isSignupInProgressClient(): boolean {
  if (typeof window === 'undefined') return false;

  const signupUserId = document.cookie
    .split('; ')
    .find(row => row.startsWith('signup_user_id='))
    ?.split('=')[1];

  return !!signupUserId;
}
