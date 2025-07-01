# Button Component - 四角いボタン実装

## 概要

FigmaデザインシステムのグリーンスクエアボタンをAtomic DesignとDesign
Tokenの原則に基づいて実装しました。

## 🎨 Figmaデザイン仕様

- **デザイン名**: グリーンスクエア
- **ボーダーラディウス**: 10px
- **グラデーション**: #198D76 → #1CA74F
- **ホバー状態**: #12614E → #1A8946
- **パディング**: 14px 40px
- **シャドウ**: 0px 5px 10px rgba(0,0,0,0.15)
- **フォント**: Noto Sans JP, 700, 16px, 文字間隔10%

## 🔬 Atomic Design構造

### Atoms (原子)

- **Button Component**: 基本的なボタン要素
- **Design Tokens**: CSS変数による統一されたスタイル定義

### Molecules (分子)

- **ButtonShowcase**: ボタンの様々なバリエーションを展示

## 🧩 Design Tokens

### CSS変数定義 (`globals.css`)

```css
/* Design Tokens for Green Square Button */
--green-gradient-start: #198d76;
--green-gradient-end: #1ca74f;
--green-gradient-hover-start: #12614e;
--green-gradient-hover-end: #1a8946;
--green-button-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
--green-button-square-radius: 10px;
--green-button-round-radius: 32px;
```

### 利点

1. **一貫性**: 全体で統一されたデザイン値
2. **保守性**: 色やサイズの変更が容易
3. **拡張性**: 新しいバリアントの追加が簡単
4. **テーマ対応**: ダークモード等への対応が可能

## 📝 使用方法

### 基本的な使用例

```tsx
import { Button } from '@/components/ui/button';

// 四角いボタン
<Button variant="green-square" size="figma-square">
  テキスト
</Button>

// 丸いボタン（既存）
<Button variant="green-gradient" size="figma-default">
  テキスト
</Button>
```

### バリアント一覧

| Variant          | 説明                 | ボーダーラディウス  |
| ---------------- | -------------------- | ------------------- |
| `green-square`   | 四角いグリーンボタン | 10px (Design Token) |
| `green-gradient` | 丸いグリーンボタン   | 32px (固定値)       |

### サイズ一覧

| Size                  | 説明          | パディング | 適用対象       |
| --------------------- | ------------- | ---------- | -------------- |
| `figma-square`        | Figma四角仕様 | 14px 40px  | green-square   |
| `figma-default`       | Figma丸仕様   | 14px 40px  | green-gradient |
| `sm`, `default`, `lg` | 標準サイズ    | 各種       | 全バリアント   |

## 🛠️ 技術実装詳細

### CVA (Class Variance Authority)

```tsx
const buttonVariants = cva(
  // 基本クラス
  'inline-flex items-center justify-center...',
  {
    variants: {
      variant: {
        'green-square':
          'bg-gradient-to-r from-[var(--green-gradient-start)] to-[var(--green-gradient-end)] ...',
      },
      size: {
        'figma-square': 'h-auto px-10 py-3.5 rounded-[var(--green-button-square-radius)] ...',
      },
    },
  }
);
```

### TypeScript型安全性

- `VariantProps<typeof buttonVariants>`により型安全性を確保
- 新しいバリアントは自動的に型に反映

## 🎯 実装のポイント

### 1. Design Token活用

- CSS変数を使用してFigmaデザインの値を抽象化
- 将来的なデザイン変更に柔軟に対応

### 2. Atomic Design原則

- 単一責任の原則に基づくComponent設計
- 再利用可能で組み合わせ可能な構造

### 3. アクセシビリティ

- `data-slot`属性によるセマンティック構造
- フォーカス状態とARIA属性の適切な実装

### 4. パフォーマンス

- TailwindCSSのJITによる最適化
- 不要なCSSの排除

## 🔍 テスト・確認方法

### 開発環境での確認

```bash
cd client
npm run dev
# http://localhost:3000/button-test でShowcaseを確認
```

### 確認項目

- [ ] 四角いボタンの表示（10px radius）
- [ ] グラデーション色の正確性
- [ ] ホバー状態の動作
- [ ] 無効状態の表示
- [ ] レスポンシブ対応
- [ ] アクセシビリティ（キーボード操作等）

## 🚀 今後の拡張予定

### Phase 1: 完了 ✅

- [x] 四角いボタンの基本実装
- [x] Design Token導入
- [x] Showcase作成

### Phase 2: 予定

- [ ] ダークモード対応
- [ ] アニメーション効果の追加
- [ ] サイズバリエーションの拡充
- [ ] アイコン付きボタンの対応

### Phase 3: 予定

- [ ] Storybook統合
- [ ] ユニットテスト追加
- [ ] パフォーマンス最適化
- [ ] A11y準拠の完全対応

## 📚 関連ファイル

- `client/src/components/ui/button.tsx` - メインComponent
- `client/src/components/ui/button-showcase.tsx` - デモ・テスト用
- `client/src/app/globals.css` - Design Tokens定義
- `client/src/app/button-test/page.tsx` - テストページ

---

**実装完了日**: 2024年12月29日  
**実装者**: NEO-Engineer Agent Ω+1  
**バージョン**: v1.0.0
