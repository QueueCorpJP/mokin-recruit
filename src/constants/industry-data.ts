// 業種グループデータ（Figmaデザインと完全一致）
export const INDUSTRY_GROUPS = [
  {
    id: 'consulting',
    name: 'コンサルティング',
    industries: [
      { id: 'management-consulting', name: '経営コンサルティング' },
      { id: 'it-consulting', name: 'ITコンサルティング' },
      { id: 'hr-consulting', name: '人事コンサルティング' },
      { id: 'financial-consulting', name: '財務コンサルティング' },
    ],
  },
  {
    id: 'finance',
    name: '金融',
    industries: [
      { id: 'bank', name: '銀行' },
      { id: 'securities', name: '証券' },
      { id: 'credit-card', name: 'クレジットカード' },
      { id: 'lease', name: 'リース' },
    ],
  },
  {
    id: 'insurance',
    name: '保険',
    industries: [
      { id: 'insurance-life', name: '生命保険' },
      { id: 'insurance-non-life', name: '損害保険' },
    ],
  },
  {
    id: 'it-internet',
    name: 'IT・インターネット',
    industries: [
      { id: 'web-service', name: 'Webサービス' },
      { id: 'software', name: 'ソフトウェア' },
      { id: 'system-integration', name: 'システムインテグレータ' },
      { id: 'game', name: 'ゲーム' },
      { id: 'e-commerce', name: 'EC' },
      { id: 'fintech', name: 'FinTech' },
    ],
  },
  {
    id: 'real-estate',
    name: '不動産',
    industries: [
      { id: 'real-estate-dev', name: '不動産デベロッパー' },
      { id: 'real-estate-sales', name: '不動産仲介' },
      { id: 'real-estate-management', name: '不動産管理' },
    ],
  },
  {
    id: 'construction',
    name: '建設',
    industries: [
      { id: 'general-construction', name: 'ゼネコン' },
      { id: 'house-maker', name: 'ハウスメーカー' },
      { id: 'architecture', name: '設計' },
      { id: 'civil-engineering', name: '土木' },
    ],
  },
  {
    id: 'manufacturer',
    name: 'メーカー',
    industries: [
      { id: 'automobile', name: '自動車' },
      { id: 'electronics', name: '電機・電子' },
      { id: 'machinery', name: '機械' },
      { id: 'chemical', name: '化学' },
      { id: 'pharmaceutical', name: '医薬品' },
      { id: 'food', name: '食品' },
      { id: 'cosmetics', name: '化粧品' },
      { id: 'apparel', name: 'アパレル' },
    ],
  },
  {
    id: 'trading',
    name: '商社',
    industries: [
      { id: 'general-trading', name: '総合商社' },
      { id: 'specialized-trading', name: '専門商社' },
    ],
  },
  {
    id: 'medical',
    name: 'メディカル',
    industries: [
      { id: 'hospital', name: '病院' },
      { id: 'clinic', name: 'クリニック' },
      { id: 'medical-equipment', name: '医療機器' },
      { id: 'nursing', name: '介護' },
      { id: 'welfare', name: '福祉' },
    ],
  },
  {
    id: 'professional',
    name: '士業',
    industries: [
      { id: 'law-firm', name: '法律事務所' },
      { id: 'accounting-firm', name: '会計事務所' },
      { id: 'tax-accounting', name: '税理士事務所' },
      { id: 'patent-office', name: '特許事務所' },
    ],
  },
  {
    id: 'service',
    name: 'サービス',
    industries: [
      { id: 'hr-service', name: '人材サービス' },
      { id: 'education-service', name: '教育サービス' },
      { id: 'hotel', name: 'ホテル' },
      { id: 'travel', name: '旅行' },
      { id: 'restaurant', name: '外食' },
      { id: 'leisure', name: 'レジャー' },
    ],
  },
  {
    id: 'retail',
    name: '流通・小売',
    industries: [
      { id: 'department-store', name: '百貨店' },
      { id: 'supermarket', name: 'スーパー' },
      { id: 'convenience-store', name: 'コンビニエンスストア' },
      { id: 'specialty-store', name: '専門店' },
    ],
  },
  {
    id: 'energy',
    name: 'エネルギー',
    industries: [
      { id: 'electricity', name: '電力' },
      { id: 'gas', name: 'ガス' },
      { id: 'oil', name: '石油' },
      { id: 'renewable-energy', name: '再生可能エネルギー' },
    ],
  },
  {
    id: 'logistics-warehouse',
    name: '物流・倉庫',
    industries: [
      { id: 'logistics', name: '物流' },
      { id: 'warehouse', name: '倉庫' },
      { id: 'delivery', name: '宅配' },
    ],
  },
  {
    id: 'transport',
    name: '運輸・交通',
    industries: [
      { id: 'railway', name: '鉄道' },
      { id: 'airline', name: '航空' },
      { id: 'shipping', name: '海運' },
      { id: 'bus-taxi', name: 'バス・タクシー' },
    ],
  },
  {
    id: 'media',
    name: 'マスコミ・メディア',
    industries: [
      { id: 'tv-broadcasting', name: 'テレビ・放送' },
      { id: 'newspaper', name: '新聞' },
      { id: 'publishing', name: '出版' },
      { id: 'advertising', name: '広告' },
    ],
  },
  {
    id: 'entertainment',
    name: 'エンターテインメント',
    industries: [
      { id: 'music', name: '音楽' },
      { id: 'movie', name: '映画' },
      { id: 'game-entertainment', name: 'ゲーム' },
      { id: 'amusement', name: 'アミューズメント' },
    ],
  },
  {
    id: 'other',
    name: 'その他（教育・官公庁など）',
    industries: [
      { id: 'school', name: '学校' },
      { id: 'government', name: '官公庁' },
      { id: 'public-corporation', name: '公社・団体' },
      { id: 'npo-ngo', name: 'NPO・NGO' },
      { id: 'other-industry', name: 'その他' },
    ],
  },
];

export type IndustryGroup = (typeof INDUSTRY_GROUPS)[number];
export type Industry = IndustryGroup['industries'][number];
