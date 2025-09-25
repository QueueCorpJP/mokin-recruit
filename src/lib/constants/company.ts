// 企業関連の定数定義

// プランオプション
export const PLAN_OPTIONS = [
  { value: '', label: 'プランを選択してください' },
  { value: 'none', label: 'プラン加入なし' },
  { value: 'basic', label: 'ベーシック' },
  { value: 'standard', label: 'スタンダード' },
  { value: 'strategic', label: 'ストラテジック' },
] as const;

// 都道府県オプション（表示用）
export const PREFECTURE_OPTIONS = [
  { value: '', label: '都道府県を選択してください' },
  { value: '北海道', label: '北海道' },
  { value: '青森', label: '青森県' },
  { value: '岩手', label: '岩手県' },
  { value: '宮城', label: '宮城県' },
  { value: '秋田', label: '秋田県' },
  { value: '山形', label: '山形県' },
  { value: '福島', label: '福島県' },
  { value: '茨城', label: '茨城県' },
  { value: '栃木', label: '栃木県' },
  { value: '群馬', label: '群馬県' },
  { value: '埼玉', label: '埼玉県' },
  { value: '千葉', label: '千葉県' },
  { value: '東京', label: '東京都' },
  { value: '神奈川', label: '神奈川県' },
  { value: '新潟', label: '新潟県' },
  { value: '富山', label: '富山県' },
  { value: '石川', label: '石川県' },
  { value: '福井', label: '福井県' },
  { value: '山梨', label: '山梨県' },
  { value: '長野', label: '長野県' },
  { value: '岐阜', label: '岐阜県' },
  { value: '静岡', label: '静岡県' },
  { value: '愛知', label: '愛知県' },
  { value: '三重', label: '三重県' },
  { value: '滋賀', label: '滋賀県' },
  { value: '京都', label: '京都府' },
  { value: '大阪', label: '大阪府' },
  { value: '兵庫', label: '兵庫県' },
  { value: '奈良', label: '奈良県' },
  { value: '和歌山', label: '和歌山県' },
  { value: '鳥取', label: '鳥取県' },
  { value: '島根', label: '島根県' },
  { value: '岡山', label: '岡山県' },
  { value: '広島', label: '広島県' },
  { value: '山口', label: '山口県' },
  { value: '徳島', label: '徳島県' },
  { value: '香川', label: '香川県' },
  { value: '愛媛', label: '愛媛県' },
  { value: '高知', label: '高知県' },
  { value: '福岡', label: '福岡県' },
  { value: '佐賀', label: '佐賀県' },
  { value: '長崎', label: '長崎県' },
  { value: '熊本', label: '熊本県' },
  { value: '大分', label: '大分県' },
  { value: '宮崎', label: '宮崎県' },
  { value: '鹿児島', label: '鹿児島県' },
  { value: '沖縄', label: '沖縄県' },
] as const;

// 企業フェーズオプション
export const COMPANY_PHASE_OPTIONS = [
  { value: '', label: '企業フェーズを選択してください' },
  { value: 'スタートアップ', label: 'スタートアップ' },
  {
    value: 'スタートアップ（創業初期・社員数50名規模）',
    label: 'スタートアップ（創業初期・社員数50名規模）',
  },
  {
    value: 'スタートアップ（成長中・シリーズB以降）',
    label: 'スタートアップ（成長中・シリーズB以降）',
  },
  { value: 'アーリーステージ', label: 'アーリーステージ' },
  { value: 'グロースステージ', label: 'グロースステージ' },
  { value: 'レイターステージ', label: 'レイターステージ' },
  { value: '上場企業', label: '上場企業' },
  {
    value: '上場ベンチャー（マザーズ等上場済）',
    label: '上場ベンチャー（マザーズ等上場済）',
  },
  { value: '大手企業', label: '大手企業' },
] as const;

// 資本金単位オプション
export const CAPITAL_UNIT_OPTIONS = [
  { value: '万円', label: '万円' },
  { value: '円', label: '円' },
  { value: '千円', label: '千円' },
  { value: '億円', label: '億円' },
] as const;
