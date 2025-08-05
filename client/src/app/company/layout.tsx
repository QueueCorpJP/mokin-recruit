export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 子レイアウト（auth、job、message、dashboard）がそれぞれの認証とヘッダー・フッターを管理
  return <>{children}</>;
}