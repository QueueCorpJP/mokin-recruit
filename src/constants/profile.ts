export const PREFECTURES = [
  '未選択',
  '北海道',
  '青森',
  '岩手',
  '宮城',
  '秋田',
  '山形',
  '福島',
  '茨城',
  '栃木',
  '群馬',
  '埼玉',
  '千葉',
  '東京',
  '神奈川',
  '新潟',
  '富山',
  '石川',
  '福井',
  '山梨',
  '長野',
  '岐阜',
  '静岡',
  '愛知',
  '三重',
  '滋賀',
  '京都',
  '大阪',
  '兵庫',
  '奈良',
  '和歌山',
  '鳥取',
  '島根',
  '岡山',
  '広島',
  '山口',
  '徳島',
  '香川',
  '愛媛',
  '高知',
  '福岡',
  '佐賀',
  '長崎',
  '熊本',
  '大分',
  '宮崎',
  '鹿児島',
  '沖縄',
  '海外',
];

export const INCOME_RANGES = [
  { value: '', label: '未選択' },
  { value: '500万未満', label: '500万未満' },
  { value: '500~600万', label: '500~600万' },
  { value: '600~700万', label: '600~700万' },
  { value: '700~800万', label: '700~800万' },
  { value: '800~900万', label: '800~900万' },
  { value: '900~1000万', label: '900~1000万' },
  { value: '1000~1100万', label: '1000~1100万' },
  { value: '1100~1200万', label: '1100~1200万' },
  { value: '1200~1300万', label: '1200~1300万' },
  { value: '1300~1400万', label: '1300~1400万' },
  { value: '1400~1500万', label: '1400~1500万' },
  { value: '1500~2000万', label: '1500~2000万' },
  { value: '2000~3000万', label: '2000~3000万' },
  { value: '3000~5000万', label: '3000~5000万' },
  { value: '5000万~', label: '5000万~' },
];

export const GENDER_OPTIONS = [
  { value: '男性', label: '男性' },
  { value: '女性', label: '女性' },
  { value: '未回答', label: '未回答' },
];

export const generateYearOptions = (startYear?: number) => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  const minYear = startYear || 1955;

  // startYear（デフォルト1955年）から現在の年まで
  for (let year = currentYear; year >= minYear; year--) {
    years.push(year.toString());
  }

  return years;
};

export const generateMonthOptions = () => {
  const months: string[] = [];

  for (let month = 1; month <= 12; month++) {
    months.push(month.toString());
  }

  return months;
};

export const generateDayOptions = (year?: string, month?: string) => {
  const days: string[] = [];

  if (!year || !month) {
    // 年月が選択されていない場合は1-31日まで表示
    for (let day = 1; day <= 31; day++) {
      days.push(day.toString());
    }
    return days;
  }

  // 年月に基づいて適切な日数を計算
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day.toString());
  }

  return days;
};
