# APIからサーバーコンポーネントへの移行プロセス

## 概要
APIベースのバックエンドからNext.js 13+のサーバーコンポーネントに効率的に移行するための標準プロセスと注意点をまとめます。今回の求人検索機能の失敗体験をもとに、他のページでも同様の失敗を避けるための手順書です。

## 🚀 標準移行プロセス（他のページ用）

### フェーズ1: 事前調査（1時間）

#### 1-1. 既存APIの理解
```bash
# 対象APIエンドポイントを特定
grep -r "api/" src/app/target-page/
```

- [ ] APIエンドポイントのURL確認
- [ ] リクエスト/レスポンスの型定義確認  
- [ ] 認証・認可要件の確認
- [ ] 使用しているデータベーステーブルの特定

#### 1-2. データベーススキーマ検証
```javascript
// test-schema-{feature}.js を作成
const { createClient } = require('@supabase/supabase-js');

async function testSchema() {
  const supabase = createClient(url, key);
  
  // 1. 基本的なテーブル存在確認
  const { data, error } = await supabase
    .from('target_table')
    .select('*')
    .limit(1);
    
  // 2. 関連テーブルとのjoin可能性確認
  // 3. 必要なフィールドの存在確認
}
```

- [ ] メインテーブルのカラム構成確認
- [ ] 外部キー関係の確認（database.md vs 実際のDB）
- [ ] 必要なjoin操作の実行可能性テスト
- [ ] フィルタリング対象カラムのデータ型確認

#### 1-3. コンポーネント構成の分析
- [ ] Client ComponentとServer Componentの分離ポイント特定
- [ ] 状態管理が必要な部分の特定
- [ ] インタラクティブ要素の特定（フォーム、ページネーション等）

### フェーズ2: 設計・実装計画（30分）

#### 2-1. アーキテクチャ設計
```
page.tsx
├── {Feature}ServerComponent
│   ├── 初期データ取得
│   ├── URL params → search conditions 変換
│   └── データベース直接アクセス
└── {Feature}Client
    ├── ユーザーインタラクション
    ├── 状態管理
    └── 動的更新
```

#### 2-2. ファイル構成計画
- [ ] `actions.ts` - サーバーアクション関数
- [ ] `{Feature}ServerComponent.tsx` - サーバーコンポーネント
- [ ] `{Feature}Client.tsx` - クライアントコンポーネント
- [ ] `page.tsx` - ルートコンポーネント（修正）

### フェーズ3: 段階的実装（2-3時間）

#### 3-1. データアクセス層の作成
```typescript
// actions.ts
'use server'

export async function get{Feature}Data(params: Params) {
  try {
    const supabase = getSupabaseAdminClient();
    
    // まずシンプルなクエリでテスト
    const { data, error } = await supabase
      .from('main_table')
      .select('*')
      .limit(5);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**⚠️ 重要**: 最初は複雑なjoinを避け、シンプルなクエリから開始

#### 3-2. サーバーコンポーネントの作成
```typescript
// {Feature}ServerComponent.tsx
export default async function FeatureServerComponent({ searchParams }) {
  // 1. パラメータ解析
  const conditions = parseSearchParams(searchParams);
  
  // 2. データ取得
  const response = await getFeatureData(conditions);
  
  // 3. エラーハンドリング
  if (!response.success) {
    return <ErrorComponent message={response.error} />;
  }
  
  // 4. クライアントコンポーネントに渡す
  return (
    <FeatureClient 
      initialData={response.data}
      initialConditions={conditions}
    />
  );
}
```

#### 3-3. クライアントコンポーネントの作成
```typescript
// {Feature}Client.tsx
'use client'

export default function FeatureClient({ initialData, initialConditions }) {
  const [data, setData] = useState(initialData);
  const [conditions, setConditions] = useState(initialConditions);
  
  // 必須: propsの変更を監視
  useEffect(() => {
    setData(initialData);
    setConditions(initialConditions);
  }, [initialData, initialConditions]);
  
  return (
    // UI実装
  );
}
```

### フェーズ4: テスト・デバッグ（1時間）

#### 4-1. 段階的テスト
```bash
# 1. データアクセスのテスト
node test-{feature}-data.js

# 2. サーバーコンポーネントのテスト
# ブラウザでページアクセス、コンソール確認

# 3. 状態同期のテスト
# ページネーション、フィルタリング等の動作確認
```

#### 4-2. 共通エラーパターンと対処法

**❌ エラー1: "Could not find a relationship"**
```typescript
// 対処: join を分離
// 悪い例
.select('*, related_table!inner(*)')

// 良い例
const mainData = await supabase.from('main_table').select('*');
const relatedData = await supabase.from('related_table').select('*').in('id', ids);
```

**❌ エラー2: "TypeError: fetch failed"**
- 原因: サーバーコンポーネントで自分のAPIを呼び出し
- 対処: 直接データベースアクセスに変更

**❌ エラー3: 状態が更新されない**
```typescript
// 対処: useEffectで状態同期
useEffect(() => {
  setState(initialData);
}, [initialData]);
```

## 🎯 成功のための重要ポイント

### 1. **Always Schema First**
- 実装前に必ずデータベーススキーマを確認
- 推測でjoinせず、必ずテストスクリプトで検証

### 2. **Small Steps, Big Wins**
- 最初はシンプルなクエリから開始
- 段階的に機能を追加
- 各段階でテスト・確認

### 3. **State Sync is Critical**
- サーバーとクライアントの状態同期を必ず実装
- `useEffect`でpropsの変更を監視

### 4. **Test Early, Test Often**
- 各フェーズでテストスクリプトを作成
- ブラウザコンソールを活用してデバッグ

## 📋 移行チェックリスト（汎用版）

### 事前準備
- [ ] 対象APIエンドポイントの特定
- [ ] 使用テーブルとスキーマの確認
- [ ] 外部キー関係の検証
- [ ] 認証・認可要件の確認

### 実装
- [ ] テストスクリプトでデータアクセス確認
- [ ] actions.ts でサーバーアクション作成
- [ ] サーバーコンポーネント実装
- [ ] クライアントコンポーネント実装
- [ ] 状態同期の実装

### 検証
- [ ] 基本的なデータ取得の動作確認
- [ ] フィルタリング・検索の動作確認
- [ ] ページネーション動作確認
- [ ] エラーハンドリングの確認
- [ ] パフォーマンステスト

### 完了
- [ ] 旧APIエンドポイントの削除
- [ ] 不要なファイルのクリーンアップ
- [ ] ドキュメント更新

## ⏰ 想定時間配分
- **フェーズ1 (調査)**: 1時間
- **フェーズ2 (設計)**: 30分  
- **フェーズ3 (実装)**: 2-3時間
- **フェーズ4 (テスト)**: 1時間

**合計**: 4.5-5.5時間/ページ

## 📚 今回の事例から学んだ失敗パターン

### ❌ 失敗1: サーバーコンポーネントでのfetch使用
```typescript
// 間違い - サーバーコンポーネントから自分のAPIを呼ぶ
const response = await fetch('/api/jobs/search');
// エラー: TypeError: fetch failed
```

### ❌ 失敗2: データベーススキーマの理解不足
```typescript
// 間違い - 存在しない関係をjoin
company_accounts!inner(id, company_name)
// エラー: Could not find a relationship
```

### ❌ 失敗3: ページネーション状態の非同期問題
```typescript
// 問題: クライアントコンポーネントの状態がサーバーからの新しいpropsと同期されていない
// 解決: useEffectで状態同期
useEffect(() => {
  setPagination(initialPagination);
}, [initialPagination]);
```

## 🎉 成功例
- ✅ 45件の求人データを正常取得
- ✅ 5ページのページネーション動作
- ✅ 実際の企業名表示
- ✅ 検索フィルタリング機能
- ✅ APIレスポンス時間の改善

この手順に従うことで、今回のような試行錯誤を避け、効率的にAPIからサーバーコンポーネントへ移行できます。