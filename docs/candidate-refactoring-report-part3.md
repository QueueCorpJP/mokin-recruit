# candidate 配下リファクタリング診断・設計書（第 3 部：キャリア・職務経歴・スキル・期待値）

---

## 1. カテゴリ概要

この部では
、`/candidate/account/career-status/`・`/candidate/account/recent-job/`・`/candidate/account/skills/`・`/candidate/account/expectation/`配
下の**キャリア（転職活動状況）・職務経歴・スキル・期待値**に関する全ページ・ロジックを徹底的に精査し
、**リファクタリング必須箇所とその理由・改善案**を厳密に記述します。

---

## 2. 転職活動状況（キャリアステータス）

### 2.1 対象ファイル

- `career-status/edit/page.tsx`
- `career-status/edit/CompanyStatusEditRow.tsx`
- `career-status/edit/actions.ts`

### 2.2 主な問題点・リファクタリング推奨理由

#### a. フォームロジック・業種/企業管理の重複

- **現状**：useForm, zod, onSubmit, handleCancel, addCompany, removeCompany, モーダル管理などが他編
  集ページと重複。
- **理由**：保守性・拡張性・テスト容易性の低下。
- **改善案**：
  - フォームロジック・業種/企業管理の共通化（カスタムフック化）。

#### b. バリデーション/型定義の分散

- **現状**：zod スキーマと TypeScript 型が混在。
- **理由**：型安全性・保守性の低下。
- **改善案**：
  - 型・バリデーションの一元化。

#### c. UI 部品の props や型の一貫性不足

- **現状**：FormRow, Section, SectionCard 等の props や型が統一されていない。
- **理由**：UI 一貫性・保守性の低下。
- **改善案**：
  - UI 部品の型統一・共通化。

#### d. サーバーアクションの重複

- **現状**：FormData→ 型変換/CRUD/エラー処理が他アクションと重複。
- **理由**：堅牢性・保守性の低下。
- **改善案**：
  - 共通アクションユーティリティ化。

---

## 3. 職務経歴（直近の職歴）

### 3.1 対象ファイル

- `recent-job/edit/page.tsx`
- `recent-job/edit/actions.ts`

### 3.2 主な問題点・リファクタリング推奨理由

#### a. フォームロジック・業種/職種管理の重複

- **現状**：useForm, zod, onSubmit, handleCancel, addJobHistory, removeJobHistory, モーダル管理など
  が他編集ページと重複。
- **理由**：保守性・拡張性・テスト容易性の低下。
- **改善案**：
  - フォームロジック・業種/職種管理の共通化（カスタムフック化）。

#### b. バリデーション/型定義の分散

- **現状**：zod スキーマと TypeScript 型が混在。
- **理由**：型安全性・保守性の低下。
- **改善案**：
  - 型・バリデーションの一元化。

#### c. サーバーアクションの重複

- **現状**：FormData→ 型変換/CRUD/エラー処理が他アクションと重複。
- **理由**：堅牢性・保守性の低下。
- **改善案**：
  - 共通アクションユーティリティ化。

---

## 4. スキル

### 4.1 対象ファイル

- `skills/edit/page.tsx`
- `skills/edit/actions.ts`

### 4.2 主な問題点・リファクタリング推奨理由

#### a. フォームロジック・スキル/言語管理の重複

- **現状**：useForm, zod, onSubmit, handleCancel, addSkill, removeSkill, addOtherLanguage,
  removeOtherLanguage などが他編集ページと重複。
- **理由**：保守性・拡張性・テスト容易性の低下。
- **改善案**：
  - フォームロジック・スキル/言語管理の共通化（カスタムフック化）。

#### b. バリデーション/型定義の分散

- **現状**：zod スキーマと TypeScript 型が混在。
- **理由**：型安全性・保守性の低下。
- **改善案**：
  - 型・バリデーションの一元化。

#### c. サーバーアクションの重複

- **現状**：FormData→ 型変換/CRUD/エラー処理が他アクションと重複。
- **理由**：堅牢性・保守性の低下。
- **改善案**：
  - 共通アクションユーティリティ化。

---

## 5. 期待値（希望条件）

### 5.1 対象ファイル

- `expectation/edit/page.tsx`
- `expectation/edit/actions.ts`

### 5.2 主な問題点・リファクタリング推奨理由

#### a. フォームロジック・各種選択管理の重複

- **現状**：useForm, zod, onSubmit, handleCancel, handleIndustriesConfirm, removeIndustry,
  handleJobTypesConfirm, removeJobType, handleLocationsConfirm, removeLocation,
  handleWorkStylesConfirm, removeWorkStyle などが他編集ページと重複。
- **理由**：保守性・拡張性・テスト容易性の低下。
- **改善案**：
  - フォームロジック・各種選択管理の共通化（カスタムフック化）。

#### b. バリデーション/型定義の分散

- **現状**：zod スキーマと TypeScript 型が混在。
- **理由**：型安全性・保守性の低下。
- **改善案**：
  - 型・バリデーションの一元化。

#### c. サーバーアクションの重複

- **現状**：FormData→ 型変換/CRUD/エラー処理が他アクションと重複。
- **理由**：堅牢性・保守性の低下。
- **改善案**：
  - 共通アクションユーティリティ化。

---

## 6. 横断的な改善方針

- **型・バリデーション・エラー表示・初期化・保存・モーダル管理・CRUD 操作の共通化/一元化**
- **UI 部品（Section, FormRow, ActionButton 等）の props や型の一貫性強化・共通化**
- **カスタムフック化・ロジック共通化**
- **アクセシビリティ・UI/UX 一貫性の強化**

---

**（独り言）** この第 3 部では、キャリア・職務経歴・スキル・期待値カテゴリの「どこを・なぜ・どう直す
べきか」を徹底的に具体化しました。 **次は第 4 部（求人検索・応募・お気に入り・ダッシュボード）に進み
ます。**
