export const PREFECTURES = [
  { value: '', label: '未選択' },
  { value: 'hokkaido', label: '北海道' },
  { value: 'aomori', label: '青森' },
  { value: 'iwate', label: '岩手' },
  { value: 'miyagi', label: '宮城' },
  { value: 'akita', label: '秋田' },
  { value: 'yamagata', label: '山形' },
  { value: 'fukushima', label: '福島' },
  { value: 'ibaraki', label: '茨城' },
  { value: 'tochigi', label: '栃木' },
  { value: 'gunma', label: '群馬' },
  { value: 'saitama', label: '埼玉' },
  { value: 'chiba', label: '千葉' },
  { value: 'tokyo', label: '東京' },
  { value: 'kanagawa', label: '神奈川' },
  { value: 'niigata', label: '新潟' },
  { value: 'toyama', label: '富山' },
  { value: 'ishikawa', label: '石川' },
  { value: 'fukui', label: '福井' },
  { value: 'yamanashi', label: '山梨' },
  { value: 'nagano', label: '長野' },
  { value: 'gifu', label: '岐阜' },
  { value: 'shizuoka', label: '静岡' },
  { value: 'aichi', label: '愛知' },
  { value: 'mie', label: '三重' },
  { value: 'shiga', label: '滋賀' },
  { value: 'kyoto', label: '京都' },
  { value: 'osaka', label: '大阪' },
  { value: 'hyogo', label: '兵庫' },
  { value: 'nara', label: '奈良' },
  { value: 'wakayama', label: '和歌山' },
  { value: 'tottori', label: '鳥取' },
  { value: 'shimane', label: '島根' },
  { value: 'okayama', label: '岡山' },
  { value: 'hiroshima', label: '広島' },
  { value: 'yamaguchi', label: '山口' },
  { value: 'tokushima', label: '徳島' },
  { value: 'kagawa', label: '香川' },
  { value: 'ehime', label: '愛媛' },
  { value: 'kochi', label: '高知' },
  { value: 'fukuoka', label: '福岡' },
  { value: 'saga', label: '佐賀' },
  { value: 'nagasaki', label: '長崎' },
  { value: 'kumamoto', label: '熊本' },
  { value: 'oita', label: '大分' },
  { value: 'miyazaki', label: '宮崎' },
  { value: 'kagoshima', label: '鹿児島' },
  { value: 'okinawa', label: '沖縄' },
  { value: 'overseas', label: '海外' },
] as const;

export const INCOME_RANGES = [
  { value: '', label: '未選択' },
  { value: 'under-500', label: '500万未満' },
  { value: '500-600', label: '500~600万' },
  { value: '600-700', label: '600~700万' },
  { value: '700-800', label: '700~800万' },
  { value: '800-900', label: '800~900万' },
  { value: '900-1000', label: '900~1000万' },
  { value: '1000-1100', label: '1000~1100万' },
  { value: '1100-1200', label: '1100~1200万' },
  { value: '1200-1300', label: '1200~1300万' },
  { value: '1300-1400', label: '1300~1400万' },
  { value: '1400-1500', label: '1400~1500万' },
  { value: 'over-1500', label: '1500万~' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'unspecified', label: '未回答' },
] as const;

export const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [{ value: '', label: '未選択' }];

  // 1955年から現在の年 - 18歳まで
  for (let year = currentYear - 18; year >= 1955; year--) {
    years.push({ value: year.toString(), label: `${year}` });
  }

  return years;
};

export const generateMonthOptions = () => {
  const months = [{ value: '', label: '未選択' }];

  for (let month = 1; month <= 12; month++) {
    months.push({ value: month.toString(), label: `${month}` });
  }

  return months;
};

export const generateDayOptions = (year?: string, month?: string) => {
  const days = [{ value: '', label: '未選択' }];

  if (!year || !month) {
    // 年月が選択されていない場合は1-31日まで表示
    for (let day = 1; day <= 31; day++) {
      days.push({ value: day.toString(), label: `${day}` });
    }
    return days;
  }

  // 年月に基づいて適切な日数を計算
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ value: day.toString(), label: `${day}` });
  }

  return days;
};
