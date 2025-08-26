// 動的レンダリングを強制してプリフェッチを防ぐ
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CandidateJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}