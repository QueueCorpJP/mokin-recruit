# サーバーアクションとデータアクセス設計

UI/DOM/文言は不変のまま、サーバーアクション（SA）を安全・一貫・再利用可能にします。

## 1. 共通レスポンス型

- 追加: `lib/server/actions/response.ts`
  - `type Ok<T> = { success: true; data?: T }`
  - `type Fail = { success: false; error: string; code?: string }`
  - 返却はこのどちらかに統一

## 2. バリデーション

- Zod をデフォルト採用。`parse`/`safeParse` を使い分け
- 既存の `reset-password` の実装方針に合わせる

## 3. revalidate 集約

- 追加: `lib/server/actions/revalidate.ts`
  - `revalidateCompanyPaths(...paths)` を提供
  - 現状の `revalidatePath('/company/account')` 等をここに寄せる

## 4. Supabase クライアント

- 既存の `getSupabaseAdminClient`/`getCompanySupabaseClient` を尊重
- Admin 操作（ユーザー作成等）は Admin クライアントに限定
- RLS 前提の読み取りは RLS クライアントを利用

## 5. メール送信

- 追加: `lib/server/mail/sendgrid.ts`
  - Env の存在チェック、バッチ送信、障害時はログのみ
  - 呼び出し側は本文・件名・宛先だけ渡す

## 6. 適用対象（例）

- `src/app/company/account/actions.ts`
  - 招待メール送信: 共通関数に置き換え
  - 権限変換: 共通化
  - レスポンス: Ok/Fail に統一
  - revalidate: 集約関数へ

---

次章: リファクタリング運用手順とチェックリスト（07-refactor-playbook-and-checklists.md）


