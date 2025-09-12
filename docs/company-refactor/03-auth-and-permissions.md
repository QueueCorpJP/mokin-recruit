# 認証・認可と権限マッピング

UI/UX・ルーティング・表示は変更せず、認証/認可ロジックを型安全に一元化します。

## 1. ルートガード

- 追加: `src/app/company/constants/routes.ts`
  - `export const protectedPaths = ['/company/dashboard', '/company/message', '/company/job', '/company/task', '/company/mypage'];`
- `CompanyLayoutClient.tsx` はこれを参照。ログインページ滞在時の push を防止。

## 2. 権限マッピング

- 追加: `lib/company/permissions.ts`
  - UIロール: `admin | scout | recruiter`
  - DB: `ADMINISTRATOR | SCOUT_STAFF`
  - `toDbPermission(uiRole)`, `toUiRole(permissionLevel)` を提供
- 既存の `account/actions.ts` などは本関数を利用するだけに簡素化。

## 3. 認証ユーティリティ

- 追加: `lib/auth/company.ts`
  - CSR/SSR で会社アカウントIDや会社ユーザーIDの取得を薄い関数で提供
  - 既存の `requireCompanyAuthForAction` はそのまま利用しつつ、呼び出し側の型を強化

## 4. 安全性

- 既存の RLS ポリシーを前提としたまま、境界（actions）でのチェックを強化
- 不正アクセス時は従来同様の失敗レスポンス（文言不変）

## 5. 段階適用

1) ファイル追加のみ
2) 参照を順次差し替え（`account/actions.ts` → `job/actions.ts` → `search/**`）
3) UI 表示/挙動に差異がないことを回帰確認

---

次章: サーバーアクションとデータアクセス（04-server-actions-and-data-access.md）


