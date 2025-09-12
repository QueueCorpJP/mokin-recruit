# アーキテクチャとフォルダリング設計（UI非変更・後方互換）

本章では、`src/app/company` の内部構成を壊さず、共通化/責務分離/命名一貫性を強化するための構造設計を示します。既存フォルダは維持し、追加ファイルで補強→段階的に参照切替します。

## 1. 原則

- Presentation/UI と Domain/DataAccess を疎結合にする
- 共通モジュールは lib/constants/types 下に集約
- 変更は import 先差し替え中心（DOM/クラス/文言は不変）

## 2. 追加ディレクトリ/ファイル（要点）

```
types/company.ts                    # ドメイン型/UI型
constants/prefectures.ts            # 都道府県マスタ
src/app/company/constants/routes.ts # 認証保護ルート
lib/company/permissions.ts          # 権限変換
lib/company/groups.ts               # グループ取得
lib/server/actions/response.ts      # 成功/失敗型
lib/server/actions/revalidate.ts    # 再検証集約
lib/server/mail/sendgrid.ts         # メール送信共通
```

## 3. 責務分担

- UI層（app/components）: 表示・イベント送出のみ
- アプリケーション層（app/.../actions.ts）: サーバーアクションで入出力の境界を定義（Zod）
- ドメイン/ユースケース（lib/company/**）: 権限/取得ロジックの単一実装
- インフラ（lib/server/**）: Supabase/SendGrid/ログ/revalidate

## 4. 命名規約（抜粋）

- 型: Domain型は名詞、UI表示用は `...View`/`...Display` を付与
- 関数: 動詞から開始（get/update/invite/convert/mapTo...）
- ファイル: 機能ごと（permissions.ts, groups.ts など）

## 5. 依存方向

UI → actions → lib/company → lib/server → 外部（Supabase/SendGrid）

この向きのみを許容。逆依存は作らない。

## 6. 段階移行の順序

1) 追加のみの共通ファイル投入
2) ルートガード・マスタ参照の切替
3) サーバーアクションの入出力統一
4) 重複関数の共通化
5) モーダルの共通化

---

次章: 認証/認可と権限マッピング（03-auth-and-permissions.md）


