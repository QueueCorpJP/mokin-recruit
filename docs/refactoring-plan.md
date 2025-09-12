```markdown
# src/app/company リファクタリング計画書（UI 非変更・後方互換維持）

本ドキュメントはサマリー兼目次です。詳細は章立てドキュメントを参照してください。

## 目次（詳細ドキュメント）

- 00 概要: docs/company-refactor/00-overview.md
- 01 アーキテクチャ/フォルダリング: docs/company-refactor/01-architecture-and-foldering.md
- 03 認証/認可・権限: docs/company-refactor/03-auth-and-permissions.md
- 04 サーバーアクション/データアクセス: docs/company-refactor/04-server-actions-and-data-access.md
- 07 プレイブック/チェックリスト: docs/company-refactor/07-refactor-playbook-and-checklists.md
- 09 移行計画と PR 分割: docs/company-refactor/09-migration-plan-and-prs.md
- 10 テスト計画: docs/company-refactor/10-test-plan.md
- 11 リスクとロールバック: docs/company-refactor/11-risk-and-rollback.md

## 0. リファクタリングの目的・原則

- **UI/UX・URL・DB スキーマ・ルーティング・文言完全不変**を厳守しつつ、**内部品質（可読性・保守性・
  安全性・共通化・テスト容易性・型安全・セキュリティ・運用性）を最大化**する。
- **段階的・小 PR 分割・ロールバック容易性・テスト容易性**を最優先。
- **現状の技術的負債（型の分散・重複、認可/認証の分散、マスタデータの重複、サーバーアクションの型不
  統一、ロギング分散等）を解消**する。

---

## 1. スコープ・非目標

- **スコープ**
  - `src/app/company/**`
  - 密接に関係する `lib/**`, `constants/**`, `components/**` の新規共通化ファイル追加
- **非目標**
  - UI/UX・クラス名・DOM 構造・文言・ルーティング・DB スキーマの変更
  - API 仕様変更・外部連携仕様変更

---

## 2. 現状課題と改善方針

### 2.1. 認証・レイアウト

- `protectedPaths`ハードコード、ガード分散、型不明瞭
- → `constants/company/routes.ts`新設で一元化
- → `lib/auth/company.ts`で認証型/ユーティリティ集約
- → 型明確化・ガード条件見直し

### 2.2. 型の分散・重複

- ドメイン型/UI 型混在・重複
- → `types/company.ts`新設で 2 層構造
- → 権限変換を`lib/company/permissions.ts`に集約

### 2.3. 権限付与・メール送信の重複

- SendGrid/Supabase Admin API 呼び出し重複
- → `lib/server/mail/sendgrid.ts`で共通化
- → クライアント生成関数分離
- → 権限変換共通化

### 2.4. マスタデータの重複

- 都道府県リスト・業種データの重複
- → `constants/prefectures.ts`新設
- → 業種は`constants/industry-data`に統一

### 2.5. サーバーアクションの型・エラー処理

- レスポンス型不統一・バリデーション分散・revalidatePath 点在
- → `lib/server/actions/response.ts`で共通型
- → Zod バリデーション統一
- → `lib/server/actions/revalidate.ts`で revalidate 集約

### 2.6. 重複ユーティリティ・モーダル

- getCompanyGroups 重複・モーダル重複
- → `lib/company/groups.ts`で共通化
- → モーダルは`components/company/common/`に共通化

### 2.7. ロギング一元化

- console.log/error 分散
- → `lib/server/utils/logger.ts`新設で集約

---

## 3. 追加で意識すべき観点（補足）

- E2E テスト自動化の布石（Playwright/Cypress 等）
- Zod スキーマと TS 型の一貫性担保
- API/DB 障害時の Fail-Safe 設計・監視
- RLS/認可のセキュリティ監査・自動テスト
- キャッシュ設計・revalidate 最適化
- i18n/L10n・文言共通化の布石
- 新規共通化ファイルの README/利用ガイド整備
- 将来的な UI/API 刷新時の拡張性設計

---

## 4. 新規ファイル/ディレクトリ構成（追加のみ）
```

constants/ prefectures.ts

lib/ auth/company.ts company/permissions.ts company/groups.ts server/actions/revalidate.ts
server/actions/response.ts server/mail/sendgrid.ts server/utils/logger.ts

types/ company.ts

src/app/company/ constants/routes.ts

components/company/common/ DeleteConfirmModal.tsx EditNameModal.tsx

```

---

## 5. ファイル別リファクタリング計画（UI非変更）

- 各ファイルの詳細なリファクタリング内容は下記を参照。
  - Zodスキーマ/型一貫性
  - 例外ハンドリング
  - ロギング粒度
  - API障害時のFail-Safe設計
- 新規共通化ファイルにはREADME/利用例を付与。

---

## 6. マイグレーション戦略

1. 追加のみの共通ファイル群導入（ビルド影響なし）
2. 依存の少ない箇所から差し替え
3. サーバーアクションの型/バリデーション統一
4. 重複関数の共通化
5. モーダルの共通化
6. 各ステップで型チェック・ビルド・E2E/手動テスト・差分テストを実施、PR小分割・ロールバック容易性担保

---

## 7. 検証・テスト計画

- 型チェック: `pnpm build`で型エラーゼロ
- E2E/手動テスト: 主要ユーザーフロー全網羅（ログイン/編集/権限/求人/検索/スカウト/メッセージ/タスク）
- 重点リグレッション: 権限変換・revalidatePath・例外時のFail-Safe
- E2E自動化の導入検討

---

## 8. リスク・緩和策

- 型エラー拡散: PR小分割・型エラー即修正
- 認可ロジック副作用: 既存条件式保持・ユーティリティは単純委譲から開始
- メール送信共通化: APIキー存在チェック・障害時はFail-Safe（ログのみ）
- revalidatePath副作用: 影響範囲限定・パフォーマンス監視

---

## 9. 実施タスク一覧（PR粒度）

- 追加のみ（基盤）
- 低影響差し替え
- サーバーアクション統一
- モーダル共通化
- README/利用例・運用手順整備
- E2Eテスト自動化のPoC

---

## 10. 受け入れ条件（Doneの定義）

- UI/UX・DOM・文言・遷移先完全不変
- 型重複の主要箇所が`types/company.ts`へ集約
- 重複関数・権限変換・メール送信・再検証・都道府県の重複解消
- 主要フローのリグレッションで差異なし
- 新規共通化ファイルのREADME/利用例・障害時運用手順整備

---

## 11. 付録：主要変換マッピング・補足

- 権限変換:
  - UI: `admin`→DB: `ADMINISTRATOR`
  - UI: `scout`/`recruiter`→`SCOUT_STAFF`
- ルートガード: `constants/routes.ts`の`protectedPaths`を参照
- マスタ:
  - 都道府県:`constants/prefectures.ts`
  - 業種:`constants/industry-data`
- ZodスキーマとTS型の一貫性担保方法例:
  - Zodスキーマ→型自動生成（zod-to-ts等）
  - バリデーション失敗時の例外伝播・ユーザー通知設計

---
```
