# Candidate State Management Migration Guide

## 概要

candidate配下のコンポーネントでReduxを使わずに軽量な状態管理を実現するための移行ガイドです。React Context + useReducer + カスタムhooksを使用して、共通の状態管理を実装します。

## 改善されるポイント

### Before (問題点)
- 各ページ（new, edit, detail）で同じような状態管理を個別実装
- 重複したコードが大量発生
- データ変換ロジックの重複
- メモリ使用量の増加
- 保守性の低下

### After (改善後)
- 共通の状態管理で重複を削減
- 一つの状態で複数のページをカバー
- 軽量かつ高性能
- タイプセーフ
- 保守性向上

## アーキテクチャ

```
src/
├── contexts/
│   └── CandidateContext.tsx     # メインの状態管理
├── hooks/
│   ├── useCandidateData.ts      # データ操作・変換
│   └── useCandidateModals.ts    # モーダル操作
└── app/admin/candidate/
    ├── layout.tsx               # Providerの設定
    ├── CandidateClient.tsx      # 一覧ページ
    ├── new/
    │   └── CandidateNewClient.tsx
    └── [id]/edit/
        └── CandidateEditClient.tsx
```

## 主要なファイル説明

### 1. CandidateContext.tsx
- 候補者データの全状態管理
- useReducerによる効率的な更新
- TypeScript完全対応

### 2. useCandidateData.ts
- フォームデータ操作
- API用データ変換
- バリデーション
- 既存データの読み込み

### 3. useCandidateModals.ts
- モーダル操作の集約
- 業界・職種選択の管理
- タグ削除機能

## 移行手順

### Step 1: Context Provider設定

既存の`layout.tsx`がない場合は作成:
```tsx
// src/app/admin/candidate/layout.tsx
import { CandidateProvider } from '@/contexts/CandidateContext';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return <CandidateProvider>{children}</CandidateProvider>;
}
```

### Step 2: コンポーネントのリファクタリング

#### Before (従来の書き方)
```tsx
export default function CandidateNewClient() {
  const [formData, setFormData] = useState({...});
  const [education, setEducation] = useState({...});
  const [skills, setSkills] = useState({...});
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // ... 大量の重複コード
}
```

#### After (新しい書き方)
```tsx
import { useCandidateData } from '@/hooks/useCandidateData';
import { useCandidateModals } from '@/hooks/useCandidateModals';

export default function CandidateNewClient() {
  const {
    formData,
    education,
    skills,
    updateFormData,
    updateEducation,
    updateSkills,
    // ... その他必要な関数
  } = useCandidateData();

  const {
    modalState,
    handleIndustryConfirm,
    openIndustryModal,
    // ... その他モーダル関数
  } = useCandidateModals();

  // コンポーネント固有のロジックのみに集中
}
```

### Step 3: 各コンポーネントの移行

#### 新規作成ページ (CandidateNewClient)
```tsx
// 状態管理の取得
const { 
  formData, 
  updateFormData, 
  prepareConfirmationData,
  validateFormData,
  resetForm 
} = useCandidateData();

// 送信処理
const handleSubmit = async () => {
  const validation = validateFormData();
  if (!validation.isValid) {
    alert(validation.errors.join('\n'));
    return;
  }
  
  const confirmData = prepareConfirmationData();
  // 確認ページへ遷移
};
```

#### 編集ページ (CandidateEditClient)
```tsx
// 既存データの読み込み
const { loadFromCandidateDetail } = useCandidateData();

useEffect(() => {
  if (candidate) {
    loadFromCandidateDetail(candidate);
  }
}, [candidate]);
```

## パフォーマンス最適化

### 1. メモ化された更新関数
全ての更新関数は`useCallback`でメモ化され、不要な再レンダリングを防止

### 2. 効率的な状態更新
useReducerによる複数状態の一括更新で、レンダリング回数を最小化

### 3. 選択的な状態購読
必要な状態のみを取得し、無駄なデータ転送を削減

## 使用例

### フォーム入力の処理
```tsx
// シンプルな入力フィールド
<input
  value={formData.email}
  onChange={(e) => updateFormData('email', e.target.value)}
/>

// 複雑なオブジェクト更新
<input
  value={education.school_name}
  onChange={(e) => updateEducation('school_name', e.target.value)}
/>
```

### モーダル操作
```tsx
// 業界選択モーダル
<button onClick={() => openIndustryModal(-1)}>
  業界を選択
</button>

// 職種選択モーダル  
<button onClick={() => openJobTypeModal(-2)}>
  職種を選択
</button>
```

### スキルタグ管理
```tsx
// スキル追加
<button onClick={addSkillTag}>追加</button>

// スキル削除
<button onClick={() => removeSkillTag(skill)}>削除</button>
```

## 注意点

### 1. 状態の初期化
ページ遷移時に状態をリセットしたい場合は`resetForm()`を使用

### 2. データ変換
API送信前のデータ変換は`prepareConfirmationData()`で統一

### 3. バリデーション
フォーム送信前は必ず`validateFormData()`でチェック

### 4. メモリ管理
大量データを扱う場合は適切なクリーンアップを実装

## 段階的移行

### Phase 1: Context追加 (現在完了)
- CandidateContext.tsx作成
- カスタムhooks作成
- layout.tsx設定

### Phase 2: 一つのコンポーネント移行
- CandidateNewClientを移行
- 動作確認
- パフォーマンス測定

### Phase 3: 全コンポーネント移行
- CandidateEditClient移行
- その他関連コンポーネント移行
- 旧コードの削除

## トラブルシューティング

### Q: Context not found エラー
A: CandidateProviderでラップされているか確認

### Q: 状態が更新されない
A: updateFormDataなどの関数を正しく使用しているか確認

### Q: パフォーマンスが改善しない
A: React DevTools Profilerで再レンダリングを確認

## 次のステップ

1. 現在のCandidateNewClientRefactored.tsxを参考に移行開始
2. 段階的にテスト
3. パフォーマンス測定
4. 他のページへ適用拡大

この構成により、Reduxを使わずとも効率的で保守しやすい状態管理が実現できます。