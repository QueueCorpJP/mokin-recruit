# FigmaModal コンポーネント

Figmaデザインに基づいて作成されたモーダルコンポーネントです。既存の`mo-dal.tsx`、`button.tsx`、`select-input.tsx`コンポーネントを使用して構築されています。

## 特徴

- 📱 **レスポンシブデザイン**: モバイルとデスクトップの両方に対応
- ✅ **バリデーション機能**: カスタムバリデーション関数とデフォルトバリデーション
- 🎨 **Figmaデザイン準拠**: 既存のデザインシステムに完全対応
- 🔧 **カスタマイズ可能**: カテゴリーオプションや必須項目の設定が可能
- 🌐 **アクセシビリティ**: キーボードナビゲーションとスクリーンリーダー対応

## 基本的な使用方法

```tsx
import { FigmaModal } from '@/components/ui';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (formData) => {
    console.log('フォームデータ:', formData);
    // フォーム送信処理
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        モーダルを開く
      </button>

      <FigmaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="設定変更"
        description="カテゴリーとサブカテゴリーを選択してください。"
      />
    </>
  );
}
```

## プロパティ

### FigmaModalProps

| プロパティ | 型 | デフォルト値 | 説明 |
|-----------|---|-------------|-----|
| `isOpen` | `boolean` | - | モーダルの表示状態 |
| `onClose` | `() => void` | - | モーダルを閉じる時のコールバック |
| `onSubmit` | `(formData: FormData) => void` | - | フォーム送信時のコールバック |
| `title` | `string` | `"設定"` | モーダルのタイトル |
| `description` | `string` | `"以下の項目を設定してください。"` | 説明文 |
| `categoryOptions` | `SelectOption[]` | デフォルトオプション | カテゴリー選択肢 |
| `subcategoryOptionsMap` | `{ [key: string]: SelectOption[] }` | デフォルトマップ | サブカテゴリーマッピング |
| `required` | `{ category?: boolean; subcategory?: boolean; details?: boolean }` | `{ category: true, subcategory: true, details: false }` | 必須項目の設定 |
| `validation` | `ValidationMap` | - | カスタムバリデーション関数 |

### FormData

```tsx
interface FormData {
  category: string;      // 選択されたカテゴリー
  subcategory: string;   // 選択されたサブカテゴリー
  details: string;       // 詳細情報（テキストエリア）
}
```

### SelectOption

```tsx
interface SelectOption {
  value: string;         // 選択肢の値
  label: string;         // 表示テキスト
  disabled?: boolean;    // 無効状態
}
```

## カスタマイズ例

### カスタムカテゴリーオプション

```tsx
const customCategoryOptions = [
  { value: '', label: 'カテゴリーを選択' },
  { value: 'sales', label: '営業' },
  { value: 'support', label: 'サポート' },
  { value: 'development', label: '開発' }
];

const customSubcategoryMap = {
  sales: [
    { value: '', label: 'サブカテゴリーを選択' },
    { value: 'inside', label: 'インサイドセールス' },
    { value: 'field', label: 'フィールドセールス' }
  ],
  support: [
    { value: '', label: 'サブカテゴリーを選択' },
    { value: 'technical', label: 'テクニカルサポート' },
    { value: 'customer', label: 'カスタマーサポート' }
  ]
  // ...
};

<FigmaModal
  isOpen={isModalOpen}
  onClose={onClose}
  onSubmit={onSubmit}
  categoryOptions={customCategoryOptions}
  subcategoryOptionsMap={customSubcategoryMap}
/>
```

### カスタムバリデーション

```tsx
const customValidation = {
  category: (value: string) => {
    if (!value) return 'カテゴリーを選択してください';
    if (value === 'restricted') return 'このカテゴリーは選択できません';
    return null;
  },
  details: (value: string) => {
    if (value.length > 500) return '詳細情報は500文字以内で入力してください';
    return null;
  }
};

<FigmaModal
  isOpen={isModalOpen}
  onClose={onClose}
  onSubmit={onSubmit}
  validation={customValidation}
  required={{ category: true, subcategory: true, details: true }}
/>
```

## デモ

`FigmaModalExample`コンポーネントを使用して、実際の動作を確認できます：

```tsx
import { FigmaModalExample } from '@/components/ui';

function App() {
  return <FigmaModalExample />;
}
```

## 技術仕様

### 依存関係

- `mo-dal.tsx`: 基本モーダル構造
- `button.tsx`: ボタンコンポーネント  
- `select-input.tsx`: セレクトボックス
- `React.useState`: 状態管理
- `Tailwind CSS`: スタイリング

### ブラウザサポート

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### アクセシビリティ

- ARIA属性の適切な設定
- キーボードナビゲーション対応
- フォーカス管理
- エラーメッセージのスクリーンリーダー対応

## トラブルシューティング

### よくある問題

1. **モーダルが表示されない**
   - `isOpen`プロパティが`true`に設定されているか確認
   - z-indexの競合がないか確認

2. **バリデーションエラーが表示されない**
   - `required`プロパティの設定を確認
   - カスタムバリデーション関数の戻り値を確認

3. **サブカテゴリーが表示されない**
   - `subcategoryOptionsMap`にカテゴリーのキーが存在するか確認
   - カテゴリーの`value`とマップのキーが一致するか確認

### デバッグ

開発者ツールのコンソールで以下を確認：

```javascript
// フォームデータの確認
console.log('Form Data:', formData);

// エラー状態の確認  
console.log('Validation Errors:', errors);

// カテゴリーオプションの確認
console.log('Category Options:', categoryOptions);
```

## 更新履歴

- **v1.0.0** (2024-12-XX)
  - 初回リリース
  - 基本的なフォーム機能
  - バリデーション機能
  - レスポンシブデザイン対応

## ライセンス

このコンポーネントはプロジェクトのライセンスに従います。
