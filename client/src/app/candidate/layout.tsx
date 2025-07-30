export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証はルートレイアウトのAuthInitializerで管理
  // ページレベルでの認証制限が必要な場合は個別に実装
  return <>{children}</>;
}