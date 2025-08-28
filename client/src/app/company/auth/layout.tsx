export default function CompanyAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 親レイアウト(company/layout.tsx)でヘッダーとフッターが表示されるため、
  // authページではchildrenのみを返す
  return <>{children}</>;
}