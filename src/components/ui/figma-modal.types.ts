/**
 * FigmaModal関連の型定義
 */

export interface FormData {
  category: string;
  subcategory: string;
  details: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FigmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: FormData) => void;
  title?: string;
  description?: string;
  categoryOptions?: SelectOption[];
  subcategoryOptionsMap?: { [key: string]: SelectOption[] };
  required?: {
    category?: boolean;
    subcategory?: boolean;
    details?: boolean;
  };
  validation?: {
    category?: (value: string) => string | null;
    subcategory?: (value: string) => string | null;
    details?: (value: string) => string | null;
  };
}

export interface FigmaModalExampleProps {
  className?: string;
  title?: string;
  description?: string;
}

// カテゴリー別のサブカテゴリーマッピング
export const DEFAULT_CATEGORY_OPTIONS: SelectOption[] = [
  { value: '', label: 'カテゴリーを選択' },
  { value: 'business', label: 'ビジネス' },
  { value: 'technology', label: 'テクノロジー' },
  { value: 'design', label: 'デザイン' },
  { value: 'marketing', label: 'マーケティング' }
];

export const DEFAULT_SUBCATEGORY_OPTIONS_MAP: { [key: string]: SelectOption[] } = {
  business: [
    { value: '', label: 'サブカテゴリーを選択' },
    { value: 'strategy', label: '戦略企画' },
    { value: 'operations', label: '業務改善' },
    { value: 'consulting', label: 'コンサルティング' }
  ],
  technology: [
    { value: '', label: 'サブカテゴリーを選択' },
    { value: 'frontend', label: 'フロントエンド' },
    { value: 'backend', label: 'バックエンド' },
    { value: 'infrastructure', label: 'インフラ' }
  ],
  design: [
    { value: '', label: 'サブカテゴリーを選択' },
    { value: 'ui', label: 'UI設計' },
    { value: 'ux', label: 'UX設計' },
    { value: 'graphic', label: 'グラフィック' }
  ],
  marketing: [
    { value: '', label: 'サブカテゴリーを選択' },
    { value: 'digital', label: 'デジタルマーケティング' },
    { value: 'content', label: 'コンテンツマーケティング' },
    { value: 'analytics', label: '分析・解析' }
  ]
};
