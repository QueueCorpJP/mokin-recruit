'use client';

export default function CompanyAuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // 親レイアウト（CompanyLayoutClient）でヘッダー・フッターが既に表示されているため、
  // ここではchildrenのみを返す
  return <>{children}</>;
}