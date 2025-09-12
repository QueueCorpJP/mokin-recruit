# 段階的移行計画とPR分割方針

UI/UX不変を担保しつつ、ロールバック容易性とレビュアビリティを高めるPR戦略を定義します。

## 1. フェーズ構成

### Phase 0: 基盤投入（追加のみ）
- 追加: `types/company.ts`, `constants/prefectures.ts`, `lib/company/permissions.ts`, `lib/company/groups.ts`, `lib/server/actions/{response,revalidate}.ts`, `lib/server/mail/sendgrid.ts`, `src/app/company/constants/routes.ts`
- リスク: 低（既存参照なし）

### Phase 1: 低影響差し替え
- `CompanyLayoutClient.tsx` → `protectedPaths` の参照切替
- `edit/EditClient.tsx`, `edit/actions.ts` → 都道府県/業種参照の統一

### Phase 2: サーバーアクション統一（順次）
- `account/actions.ts` → レスポンス/権限変換/メール送信/revalidate の集約
- `job/actions.ts` → `getCompanyGroups` を共通実装へ
- `search/**`, `scout-template/**` → 同上

### Phase 3: モーダル共通化
- `DeleteSearchConditionModal`, `EditSearchConditionModal` 等を `components/company/common/` に移行（UIクラス・文言は完全踏襲）

## 2. PRテンプレート（提案）

- 目的: 何を共通化/集約し、どの責務を移動したか
- 変更範囲: 追加/差し替えファイル一覧
- 影響箇所: 実行パス・RLS・メール送信
- 確認手順: 主要フローのチェックリスト
- ロールバック: import を従来に戻す/新規ファイルを未使用にする

## 3. ロールバック戦略

- 追加のみPRはそのまま保持可能
- 参照切替PRは、import 差し戻しの 1 commit で戻せるように

## 4. スケジュール（例）

- 週次で 1〜2PR を目安。Phase 0 は一括、以降は画面群単位で進行

---

次章: テスト計画（10-test-plan.md）


