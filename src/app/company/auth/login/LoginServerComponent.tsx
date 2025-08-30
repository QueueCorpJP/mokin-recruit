import { LoginClient } from './LoginClient';

export default async function LoginServerComponent() {
  // サーバーサイドでの初期データ処理があればここで実行
  // 現在はログインフォームなので特別な初期データ取得は不要
  
  return (
    <LoginClient userType="company" />
  );
}