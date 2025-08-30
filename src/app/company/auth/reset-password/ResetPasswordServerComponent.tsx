import { ResetPasswordClient } from './ResetPasswordClient';

export default async function ResetPasswordServerComponent() {
  // サーバーサイドでの初期データ処理があればここで実行
  // 現在はパスワードリセットフォームなので特別な初期データ取得は不要
  
  return (
    <ResetPasswordClient userType="company" />
  );
}