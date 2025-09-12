// Single source of truth for prefectures (JP)
// Keep the structure simple for read-only UI consumption.

export type Prefecture = { code: string; nameJa: string; shortJa: string };

export const prefectures: ReadonlyArray<Prefecture> = [
  { code: '01', nameJa: '北海道', shortJa: '北海道' },
  { code: '02', nameJa: '青森県', shortJa: '青森' },
  { code: '03', nameJa: '岩手県', shortJa: '岩手' },
  { code: '04', nameJa: '宮城県', shortJa: '宮城' },
  { code: '05', nameJa: '秋田県', shortJa: '秋田' },
  { code: '06', nameJa: '山形県', shortJa: '山形' },
  { code: '07', nameJa: '福島県', shortJa: '福島' },
  { code: '08', nameJa: '茨城県', shortJa: '茨城' },
  { code: '09', nameJa: '栃木県', shortJa: '栃木' },
  { code: '10', nameJa: '群馬県', shortJa: '群馬' },
  { code: '11', nameJa: '埼玉県', shortJa: '埼玉' },
  { code: '12', nameJa: '千葉県', shortJa: '千葉' },
  { code: '13', nameJa: '東京都', shortJa: '東京' },
  { code: '14', nameJa: '神奈川県', shortJa: '神奈川' },
  { code: '15', nameJa: '新潟県', shortJa: '新潟' },
  { code: '16', nameJa: '富山県', shortJa: '富山' },
  { code: '17', nameJa: '石川県', shortJa: '石川' },
  { code: '18', nameJa: '福井県', shortJa: '福井' },
  { code: '19', nameJa: '山梨県', shortJa: '山梨' },
  { code: '20', nameJa: '長野県', shortJa: '長野' },
  { code: '21', nameJa: '岐阜県', shortJa: '岐阜' },
  { code: '22', nameJa: '静岡県', shortJa: '静岡' },
  { code: '23', nameJa: '愛知県', shortJa: '愛知' },
  { code: '24', nameJa: '三重県', shortJa: '三重' },
  { code: '25', nameJa: '滋賀県', shortJa: '滋賀' },
  { code: '26', nameJa: '京都府', shortJa: '京都' },
  { code: '27', nameJa: '大阪府', shortJa: '大阪' },
  { code: '28', nameJa: '兵庫県', shortJa: '兵庫' },
  { code: '29', nameJa: '奈良県', shortJa: '奈良' },
  { code: '30', nameJa: '和歌山県', shortJa: '和歌山' },
  { code: '31', nameJa: '鳥取県', shortJa: '鳥取' },
  { code: '32', nameJa: '島根県', shortJa: '島根' },
  { code: '33', nameJa: '岡山県', shortJa: '岡山' },
  { code: '34', nameJa: '広島県', shortJa: '広島' },
  { code: '35', nameJa: '山口県', shortJa: '山口' },
  { code: '36', nameJa: '徳島県', shortJa: '徳島' },
  { code: '37', nameJa: '香川県', shortJa: '香川' },
  { code: '38', nameJa: '愛媛県', shortJa: '愛媛' },
  { code: '39', nameJa: '高知県', shortJa: '高知' },
  { code: '40', nameJa: '福岡県', shortJa: '福岡' },
  { code: '41', nameJa: '佐賀県', shortJa: '佐賀' },
  { code: '42', nameJa: '長崎県', shortJa: '長崎' },
  { code: '43', nameJa: '熊本県', shortJa: '熊本' },
  { code: '44', nameJa: '大分県', shortJa: '大分' },
  { code: '45', nameJa: '宮崎県', shortJa: '宮崎' },
  { code: '46', nameJa: '鹿児島県', shortJa: '鹿児島' },
  { code: '47', nameJa: '沖縄県', shortJa: '沖縄' },
] as const;

export const prefectureFullNames: ReadonlyArray<string> = prefectures.map(
  p => p.nameJa
);
export const prefectureShortNames: ReadonlyArray<string> = prefectures.map(
  p => p.shortJa
);
export const prefectureNamesForMatch: ReadonlyArray<string> = [
  ...prefectureFullNames,
  ...prefectureShortNames,
];
