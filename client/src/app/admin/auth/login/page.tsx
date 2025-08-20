// サーバーサイドコンポーネント: 管理画面ログインページ
// LoginForm を呼び出し、サーバーアクションからのエラー情報を searchParams で受け取って渡す
import LoginForm from './LoginForm';

// searchParams: URLパラメータからエラーや入力値を受け取る
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  // Next.js 15以降: searchParamsはPromiseなのでawaitしてから使う
  const params = await searchParams;
  // サーバーアクションで失敗した場合、URLパラメータにエラー情報が載る
  // それをLoginFormにpropsで渡してエラー表示を実現
  return (
    <LoginForm
      error={params?.error}
      errorDetail={params?.errorDetail}
      errorStage={params?.errorStage}
      email={params?.email}
    />
  );
}
