export default async function CompanyDashboardLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  // 親レイアウト（CompanyLayoutClient）で認証処理が統一されているため、
  // ここではchildrenのみを返す
  return <>{children}</>;
}