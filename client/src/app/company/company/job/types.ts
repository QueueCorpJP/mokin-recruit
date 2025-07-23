// 企業グループの型定義
export interface CompanyGroup {
  id: string;
  group_name: string;
}

// 地域と都道府県の型定義
export type Region = {
  name: string;
  prefectures: string[];
};

export const regions: Region[] = [
  { name: '関東', prefectures: ['東京', '茨城', '栃木', '群馬', '埼玉', '千葉', '神奈川', '山梨'] },
  { name: '北海道・東北', prefectures: ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島'] },
  { name: '北陸', prefectures: ['新潟', '富山', '石川', '福井', '長野'] },
  { name: '東海', prefectures: ['愛知', '岐阜', '三重', '静岡'] },
  { name: '関西', prefectures: ['大阪', '京都', '兵庫', '奈良', '和歌山', '滋賀'] },
  { name: '中国', prefectures: ['広島', '岡山', '山口', '鳥取', '島根'] },
  { name: '四国', prefectures: ['香川', '愛媛', '徳島', '高知'] },
  { name: '九州・沖縄', prefectures: ['福岡', '熊本', '鹿児島', '長崎', '大分', '宮崎', '佐賀', '沖縄'] },
];

// 年収の選択肢
export const salaryOptions = [
  { value: '500', label: '500万円' },
  { value: '550', label: '550万円' },
  { value: '600', label: '600万円' },
  { value: '650', label: '650万円' },
  { value: '700', label: '700万円' },
  { value: '750', label: '750万円' },
  { value: '800', label: '800万円' },
  { value: '850', label: '850万円' },
  { value: '900', label: '900万円' },
  { value: '950', label: '950万円' },
  { value: '1000', label: '1000万円' },
];

// 職種カテゴリーの定義
export type JobCategory = {
  name: string;
  jobs: string[];
};

export const jobCategories: JobCategory[] = [
  { name: 'コンサルタント', jobs: ['戦略コンサルタント', 'ITコンサルタント', '組織人事コンサルタント', 'M&Aコンサルタント', '業務改善コンサルタント', 'リスクコンサルタント', 'SCMコンサルタント', '会計コンサルタント'] },
  { name: 'ITコンサルタント', jobs: ['ITストラテジスト', 'システムコンサルタント', 'ERPコンサルタント'] },
  { name: '経営', jobs: ['CEO', 'COO', 'CFO', 'プロダクトマネジャー', '新規事業開発'] },
  { name: 'プロジェクト管理', jobs: ['PM', 'PjM', 'PMO'] },
  { name: '専門職', jobs: ['弁護士', '公認会計士', '税理士'] },
  { name: '管理', jobs: ['経理', '財務', '人事'] },
  { name: '人事', jobs: ['採用', '労務', '制度企画'] },
  { name: 'マーケティング', jobs: ['マーケティングリサーチ', 'プロダクトマーケティング', 'ブランドマーケティング'] },
  { name: 'デジタルマーケティング', jobs: ['SEO/SEM', 'SNSマーケティング', 'Webアナリスト'] },
  { name: '広告', jobs: ['アカウントプランナー', 'メディアプランナー', 'クリエイティブディレクター'] },
  { name: '営業', jobs: ['法人営業', '個人営業', 'インサイドセールス'] },
  { name: '金融', jobs: ['M&A', 'PE', 'VC'] },
  { name: 'サービス', jobs: ['カスタマーサクセス', 'カスタマーサポート'] },
  { name: 'Webサービス・制作', jobs: ['Webディレクター', 'Webプロデューサー'] },
  { name: 'IT技術職', jobs: ['フロントエンドエンジニア', 'バックエンドエンジニア', 'フルスタックエンジニア', 'SRE'] },
  { name: 'デザイン', jobs: ['UIデザイナー', 'UXデザイナー', 'グラフィックデザイナー'] },
  { name: '不動産', jobs: ['アセットマネジメント', 'プロパティマネジメント'] },
  { name: '建築・土木', jobs: ['設計', '施工管理'] },
  { name: '施工管理', jobs: ['建築施工管理', '土木施工管理'] },
  { name: '医療営業', jobs: ['MR', '医療機器営業'] },
  { name: '学術・PMS・薬事', jobs: ['学術', 'PMS', '薬事'] },
  { name: '医療・看護・薬剤', jobs: ['医師', '看護師', '薬剤師'] },
  { name: '生産管理・品質管理', jobs: ['生産管理', '品質管理'] },
  { name: '品質保証', jobs: ['品質保証'] },
  { name: '研究・臨床開発・治験', jobs: ['研究', '臨床開発', '治験'] },
  { name: '化学', jobs: ['化学研究', '化学プラント'] },
  { name: '素材', jobs: ['素材開発', '素材研究'] },
  { name: '食品', jobs: ['商品開発', '品質管理'] },
  { name: '化粧品', jobs: ['商品企画', '研究開発'] },
  { name: '日用品', jobs: ['プロダクトマネージャー', 'マーケティング'] },
  { name: '電気・電子', jobs: ['回路設計', '半導体設計'] },
  { name: '機械', jobs: ['機械設計', '生産技術'] },
  { name: '半導体', jobs: ['プロセスエンジニア', 'デバイスエンジニア'] },
  { name: 'ゲーム', jobs: ['ゲームプログラマー', 'ゲームプランナー'] },
  { name: 'テレビ・放送・映像・音響', jobs: ['プロデューサー', 'ディレクター'] },
  { name: '新聞・出版', jobs: ['編集者', '記者'] },
];

// 業種カテゴリーの定義
export const industryCategories = [
  { 
    name: 'IT・テクノロジー', 
    industries: [
      'IT・インターネット',
      'ソフトウェア',
      'ゲーム・エンタメ',
      'AI・機械学習',
      'データサイエンス',
      'セキュリティ',
      'クラウド・インフラ',
      'モバイル・アプリ'
    ] 
  },
  { 
    name: 'メディア・広告', 
    industries: [
      'マスメディア',
      '広告・マーケティング',
      '出版・印刷',
      'デザイン・クリエイティブ',
      '映像・音響',
      'インターネットメディア'
    ] 
  },
  { 
    name: '金融・保険', 
    industries: [
      '銀行・信託',
      '証券・投資',
      '保険',
      'FinTech',
      '不動産金融',
      'リース・クレジット'
    ] 
  },
  { 
    name: '商社・流通', 
    industries: [
      '総合商社',
      '専門商社',
      '小売・百貨店',
      'EC・通販',
      '卸売',
      '物流・倉庫'
    ] 
  },
  { 
    name: 'メーカー', 
    industries: [
      '自動車・輸送機器',
      '電機・電子',
      '機械・重工業',
      '化学・素材',
      '食品・飲料',
      '医薬品・医療機器',
      '繊維・アパレル',
      '建材・住宅'
    ] 
  },
  { 
    name: 'サービス', 
    industries: [
      'コンサルティング',
      '人材サービス',
      '教育・研修',
      '医療・ヘルスケア',
      '福祉・介護',
      'ホテル・旅行',
      'レストラン・飲食',
      'スポーツ・フィットネス'
    ] 
  }
];

// アピールポイントの選択肢（カテゴリ別）
export interface AppealPointCategory {
  name: string;
  points: string[];
}

export const appealPointCategories: AppealPointCategory[] = [
  {
    name: '業務・ポジション',
    points: [
      'CxO候補',
      '新規事業立ち上げ',
      '経営戦略に関与',
      '裁量が大きい',
      'スピード感がある',
      'グローバル事業に関与'
    ]
  },
  {
    name: '企業・組織',
    points: [
      '成長フェーズ',
      '上場準備中',
      '社会課題に貢献'
    ]
  },
  {
    name: 'チーム・文化',
    points: [
      '少数精鋭',
      '代表と距離が近い',
      '20~30代中心',
      'フラットな組織',
      '多様な人材が活躍'
    ]
  },
  {
    name: '働き方・制度',
    points: [
      'フレックス制度',
      'リモートあり',
      '副業OK',
      '残業少なめ',
      '育児/介護と両立しやすい'
    ]
  }
];

// 後方互換性のため、フラットなリストも保持
export const appealPointOptions = appealPointCategories.flatMap(category => category.points);

// 応募時のレジュメ提出の選択肢
export const resumeRequiredOptions = [
  '履歴書の提出が必須',
  '職務経歴書の提出が必須',
];

// 雇用形態の選択肢
export const employmentTypeOptions = [
  { value: '契約社員', label: '契約社員' },
  { value: '派遣社員', label: '派遣社員' },
  { value: 'アルバイト・パート', label: 'アルバイト・パート' },
  { value: '業務委託', label: '業務委託' },
  { value: 'インターン', label: 'インターン' },
];

// 受動喫煙防止措置の選択肢
export const smokeOptions = [
  { value: '屋内禁煙', label: '屋内禁煙' },
  { value: '喫煙室設置', label: '喫煙室設置' },
  { value: '対策なし', label: '対策なし' },
  { value: 'その他', label: 'その他' },
]; 