# candidate リファクタリング現状調査・分析サーベイ

---

## 1. profile/education/summary 配下の全ファイルリスト

### 1.1 profile

- src/app/candidate/account/profile/edit/ProfileEditForm.tsx
- src/app/candidate/account/profile/edit/fields/BirthDateSelector.tsx
- src/app/candidate/account/profile/edit/fields/IncomeSelect.tsx
- src/app/candidate/account/profile/edit/fields/GenderSelector.tsx
- src/app/candidate/account/profile/edit/fields/PhoneNumberInput.tsx
- src/app/candidate/account/profile/edit/fields/PrefectureSelect.tsx
- src/app/candidate/account/profile/edit/fields/FuriganaField.tsx
- src/app/candidate/account/profile/edit/fields/NameField.tsx
- src/app/candidate/account/profile/page.tsx
- src/app/candidate/account/profile/edit/actions.ts
- src/app/candidate/account/profile/edit/page.tsx
- src/app/candidate/account/profile/edit/ProfileEditClientWrapper.tsx
- src/app/candidate/account/profile/ProfileClient.tsx
- src/app/candidate/account/profile/edit/ProfileEditDesktop.tsx
- src/app/candidate/account/profile/edit/ProfileIcon.tsx
- src/app/candidate/account/profile/edit/ProfileDescription.tsx
- src/app/candidate/account/profile/edit/ProfileActionButtons.tsx
- src/app/candidate/account/profile/edit/ProfileEditMobile.tsx
- src/app/candidate/account/profile/EditButton.tsx

### 1.2 education

- src/app/candidate/account/education/edit/page.tsx
- src/app/candidate/account/education/edit/EducationEditForm.tsx
- src/app/candidate/account/education/edit/actions.ts
- src/app/candidate/account/education/page.tsx

### 1.3 summary

- src/app/candidate/account/summary/edit/actions.ts
- src/app/candidate/account/summary/edit/page.tsx
- src/app/candidate/account/summary/page.tsx

---

## 2. \_shared/schemas 配下のファイル

- src/app/candidate/account/\_shared/schemas/educationSchema.ts
- src/app/candidate/account/\_shared/schemas/profileSchema.ts

---

## 3. \_shared/fields, \_shared/hooks, \_shared/actions 配下

- （現時点で該当ファイルなし。今後の共通化・新規作成候補）

---

## 4. 所見・今後の調査方針

- 各ファイルの役割・依存関係・import/export 構造を順次調査し、カテゴリごと・横断的な課題を明確化する
  。
- 共通部品・型・スキーマの現状と今後の設計方針を整理する。
- サーバーアクション・API 設計、テスト・ビルド・ロールバック戦略も順次調査・記載予定。

---

## 5. profile/education/summary 配下の import/export 構造・依存関係調査

### 5.1 profile

- `ProfileEditForm.tsx`：UI 部品（Button 等）、hooks（useMediaQuery, useRouter, useState, useForm,
  zodResolver）、ローカル actions、zod スキーマ等を import。フォームロジック・バリデーション・サーバ
  ーアクションが密結合。
- `fields/`配下各ファイル：`react-hook-form`の型・props を import し、各フィールド部品を export
  default。FieldError, UseFormRegister 等の型依存が強い。
- `ProfileEditDesktop.tsx`/`ProfileEditMobile.tsx`：各フィールド部品を import し、レイアウトのみ分離
  。props 設計・型の一貫性に課題。
- `ProfileEditClientWrapper.tsx`：フォーム・アクション・UI 部品をまとめて import し、PC/SP 切り替え
  等のラッパー。
- `actions.ts`：サーバーアクション・型定義を export。FormData→ 型変換・CRUD・エラー処理が他アクショ
  ンと重複。
- `page.tsx`/`edit/page.tsx`：ページエントリ。EditButton や ProfileEditForm 等を import。

**所見**：

- 各フィールド部品の型・props 設計が重複・分散。
- サーバーアクション・バリデーション・フォームロジックが密結合。
- 共通化・カスタムフック化・型一元化の余地大。

### 5.2 education

- `EducationEditForm.tsx`/`edit/page.tsx`：UI 部品、hooks、zod、サーバーアクション、業種/職種モーダ
  ル等を import。フォームロジック・バリデーション・モーダル管理が密結合。
- `actions.ts`：サーバーアクション・型定義を export。FormData→ 型変換・CRUD・エラー処理が他アクショ
  ンと重複。
- `page.tsx`：ページエントリ。EditButton 等を import。

**所見**：

- 業種/職種選択・年数管理・モーダル管理ロジックが重複。
- サーバーアクション・バリデーション・フォームロジックが密結合。
- 共通化・カスタムフック化・型一元化の余地大。

### 5.3 summary

- `edit/page.tsx`：UI 部品、hooks、zod、サーバーアクション等を import。フォームロジック・バリデーシ
  ョンが密結合。
- `actions.ts`：サーバーアクション・型定義を export。FormData→ 型変換・CRUD・エラー処理が他アクショ
  ンと重複。
- `page.tsx`：ページエントリ。EditButton 等を import。

**所見**：

- フォームロジック・バリデーション・初期化の重複。
- サーバーアクションの重複。
- 共通化・カスタムフック化・型一元化の余地大。

---

## 6. \_shared/schemas 配下の型・スキーマ現状調査

### 6.1 profileSchema

- ファイル: src/app/candidate/account/\_shared/schemas/profileSchema.ts
- 内容:
  - zod でプロフィール編集用のバリデーションスキーマを定義。
  - gender, prefecture, birthYear, birthMonth, birthDay, phoneNumber, currentIncome などの必須/任意
    項目。
  - エラーメッセージも日本語で明示。
  - `export type ProfileFormData = z.infer<typeof profileSchema>` で型も同時にエクスポート。
- 現状:
  - profile 編集フォームでの型・バリデーション共通化の基礎として利用。
  - ただし、他カテゴリやフィールド部品との型一貫性・再利用性は限定的。

### 6.2 educationSchema

- ファイル: src/app/candidate/account/\_shared/schemas/educationSchema.ts
- 内容:
  - zod で学歴編集用のバリデーションスキーマを定義。
  - finalEducation, schoolName, department, graduationYear, graduationMonth, industries, jobTypes な
    ど。
  - industries, jobTypes は配列＋各要素のサブバリデーション・refine で経験年数必須等も担保。
  - `export type EducationFormData = z.infer<typeof educationSchema>` で型も同時にエクスポート。
- 現状:
  - education 編集フォームでの型・バリデーション共通化の基礎として利用。
  - 業種/職種のサブ構造・バリデーションも一部共通化。
  - ただし、他カテゴリやフィールド部品との型一貫性・再利用性は限定的。

### 6.3 所見・課題

- profile/education で zod スキーマ・型の共通化は進みつつあるが、
  - 各フィールド部品・フォーム・サーバーアクション間での型一貫性や再利用性はまだ限定的。
  - summary や他カテゴリへの展開、横断的な型・バリデーション共通化設計が今後の課題。
- \_shared/fields, \_shared/hooks, \_shared/actions 等の共通部品は現時点で未整備。
  - 今後、型・バリデーション・エラー表示・初期化・保存・モーダル管理・CRUD 操作の共通化/一元化が必要
    。

---

## 7. サーバーアクション・API 設計・エラーハンドリング現状調査

### 7.1 profile/edit/actions.ts

- `updateCandidateProfile` サーバーアクションで FormData→ 型変換・バリデーション・DB 更新・エラー処
  理を一括実装。
- 認証チェック、必須項目バリデーション、日付変換、Supabase 経由での DB 更新、エラー時は
  console.error ＋ ActionState で返却。
- 型定義（ProfileUpdateData, ActionState）も同ファイル内で export。
- **課題**：
  - FormData→ 型変換・バリデーション・エラー処理が密結合。
  - 型・バリデーション・エラー処理の共通化が不十分。
  - 他カテゴリと重複実装が多い。

### 7.2 education/edit/actions.ts

- `getEducationData`, `updateEducationData` サーバーアクションで取得・更新を実装。
- 認証チェック、FormData→ 型変換、JSON パース、Supabase 経由での DB 更新、業種/職種テーブルの更新も
  含む。
- エラー時は console.error ＋ throw/返却値でエラー内容を返す。
- **課題**：
  - FormData→ 型変換・バリデーション・エラー処理が密結合。
  - 型・バリデーション・エラー処理の共通化が不十分。
  - 業種/職種の配列処理・DB 更新ロジックが重複。
  - 他カテゴリと重複実装が多い。

### 7.3 summary/edit/actions.ts

- `getSummaryData`, `updateSummaryData` サーバーアクションで取得・更新を実装。
- 認証チェック、FormData→ 型変換、Supabase 経由での DB 更新、エラー時は console.error ＋ throw/返却
  値でエラー内容を返す。
- **課題**：
  - FormData→ 型変換・バリデーション・エラー処理が密結合。
  - 型・バリデーション・エラー処理の共通化が不十分。
  - 他カテゴリと重複実装が多い。

### 7.4 横断的な所見・課題

- 各カテゴリで FormData→ 型変換・バリデーション・エラー処理・DB 更新ロジックが重複・密結合。
- 型・バリデーション・エラー処理・DB 操作の共通化/ユーティリティ化が急務。
- エラーハンドリングも console.error ＋返却値/throw で分散しており、統一的なエラー管理が必要。
- サーバーアクションの型安全性・テスト容易性・保守性向上のため、共通化設計が必須。

---

## 8. テスト・ビルド・ロールバック戦略の現状調査

### 8.1 テストコード・自動テストの現状

- profile/education/summary 配下にテストコード（_.test.tsx, _.spec.tsx 等）は現時点で未検出。
- 各フォーム・サーバーアクション・バリデーション・UI 部品の単体/結合テストは未整備。
- テスト自動化（CI/CD 連携等）の記述・設計も現状では確認できず。

### 8.2 ビルド・動作確認の現状

- ビルド・動作確認は手動で行われている可能性が高い。
- ビルドエラー・型エラー・バリデーションエラー等の自動検知・通知体制は未整備。
- サーバーアクション・フォームの変更時に副作用検証やリグレッションテストが不足。

### 8.3 ロールバック戦略の現状

- 重大な不具合発生時のロールバック手順・設計は明示されていない。
- 各フォーム・アクションの段階的移行や元に戻せる設計（feature flag, import 切替等）は一部方針として
  記載があるが、実装レベルでは未整備。

### 8.4 課題・今後の改善方針

- 各カテゴリ・共通部品の単体/結合テストコードの新規作成・自動化が必須。
- サーバーアクション・バリデーション・UI 部品のテスト容易性を考慮した設計・リファクタリングが必要。
- ビルド・型チェック・テストの自動化（CI/CD 連携）を導入し、エラー検知・通知体制を強化。
- 重大な不具合発生時のロールバック手順・feature flag 等の安全策を設計・実装。

---

## 9. 優先度決定と改善アクションプラン（report-part2 要件対応）

### 9.1 優先度決定の観点

- 影響範囲が広く、重複・非効率・バグリスクが高い箇所から優先的に共通化・リファクタリングを実施
- 型安全性・保守性・テスト容易性・UI/UX 一貫性・ロールバック容易性を重視
- テスト・自動化・ロールバック体制の未整備は後工程の品質リスクとなるため、早期に着手

### 9.2 優先度順アクションプラン

#### 1. 型・バリデーション・エラー表示の共通化/一元化

- **目的**: 各フォーム・フィールド部品・サーバーアクション間の型・バリデーション・エラー表示ロジック
  の重複排除と一貫性向上
- **理由**: 型安全性・保守性・テスト容易性・UI/UX 一貫性の根幹。バグ・仕様漏れ・将来の拡張リスクを大
  幅に低減
- **期待効果**: profile/education/summary 全体での型・バリデーション・エラー表示の一元管理、開発効率
  ・品質向上
- **具体策**:
  - \_shared/schemas, \_shared/fields, \_shared/hooks, \_shared/actions 等に共通型・zod スキーマ・エ
    ラー表示部品を新設
  - 各フォーム・アクションで共通型・スキーマ・エラー表示部品を import して利用

#### 2. サーバーアクション・CRUD・DB 操作の共通化/ユーティリティ化

- **目的**: FormData→ 型変換・バリデーション・DB 更新・エラー処理の重複排除と堅牢性向上
- **理由**: サーバーアクションの重複実装・バグリスク・保守コストを削減し、型安全性・テスト容易性を高
  める
- **期待効果**: サーバーアクションの共通化による保守性・堅牢性・テスト容易性向上
- **具体策**:
  - \_shared/actions 等に共通 CRUD/バリデーション/エラーハンドリングユーティリティを新設
  - 各カテゴリの actions.ts で共通ユーティリティを利用する形にリファクタリング

#### 3. UI 部品・props 設計の共通化/一貫性強化

- **目的**: 各フィールド部品・フォームの props 設計・型の一貫性を担保し、UI/UX・アクセシビリティを向
  上
- **理由**: PC/SP 両対応・UI 一貫性・保守性・テスト容易性の向上
- **期待効果**: UI 部品の再利用性・一貫性・アクセシビリティ向上
- **具体策**:
  - \_shared/fields 等に共通 Field/エラー表示部品を新設
  - 各フォームで共通部品を利用し、props 設計・型を統一

#### 4. カスタムフック化・ロジック共通化

- **目的**: useForm, useEffect, 初期化・キャンセル・モーダル管理等のロジック重複排除
- **理由**: 保守性・テスト容易性・拡張性向上
- **期待効果**: ロジックの再利用性・テスト容易性向上
- **具体策**:
  - \_shared/hooks 等に useProfileForm, useEducationForm, useSummaryForm 等のカスタムフックを新設
  - 各フォームでカスタムフックを利用

#### 5. テスト・ビルド・ロールバック体制の整備

- **目的**: 品質保証・安全なリファクタリング・運用リスク低減
- **理由**: テスト・自動化・ロールバック体制が未整備なため、品質・運用リスクが高い
- **期待効果**: 品質向上・安全な段階的移行・障害時の迅速なロールバック
- **具体策**:
  - 各カテゴリ・共通部品の単体/結合テストコード新規作成
  - CI/CD 連携による自動ビルド・型チェック・テスト・エラー通知体制の導入
  - 重大な不具合発生時のロールバック手順・feature flag 等の安全策を設計・実装

---

（以降、各アクションの詳細設計・実装計画・進捗管理に着手）
