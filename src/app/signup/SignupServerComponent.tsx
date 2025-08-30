import { SignupClient } from './SignupClient';

export default async function SignupServerComponent() {
  // サーバーサイドでの初期データ処理があればここで実行
  // 現在は会員登録フォームなので特別な初期データ取得は不要
  
  return (
    <SignupClient />
  );
}