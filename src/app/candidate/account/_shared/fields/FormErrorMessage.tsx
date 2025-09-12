import React from 'react';

/**
 * 共通エラー表示部品
 * - error: string または string[] または undefined/null
 * - エラーがあれば赤字＋アクセシブルに表示、なければ何も表示しない
 * - aria-live, role="alert" でA11y対応
 */
export function FormErrorMessage({
  error,
  id,
}: {
  error?: string | string[] | null;
  id?: string;
}) {
  if (!error || (Array.isArray(error) && error.length === 0)) return null;

  // エラーが配列なら複数行で表示、文字列なら1行で表示
  const errors = Array.isArray(error) ? error : [error];

  return (
    <div
      id={id}
      className='text-red-600 text-sm mt-1'
      aria-live='polite'
      role='alert'
    >
      {errors.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </div>
  );
}

export default FormErrorMessage;
