export const JOB_CHANGE_TIMING_OPTIONS = [
  { value: '3か月以内に', label: '3か月以内に' },
  { value: '6か月以内に', label: '6か月以内に' },
  { value: '1年以内に', label: '1年以内に' },
  { value: '未定', label: '未定' },
];

export const CURRENT_ACTIVITY_STATUS_OPTIONS = [
  { value: 'まだ始めていない', label: 'まだ始めていない' },
  { value: '情報収集中', label: '情報収集中' },
  {
    value: '書類選考に進んでいる企業がある',
    label: '書類選考に進んでいる企業がある',
  },
  {
    value: '面接・面談を受けている企業がある',
    label: '面接・面談を受けている企業がある',
  },
  { value: '内定をもらっている', label: '内定をもらっている' },
];

export const PROGRESS_STATUS_OPTIONS = [
  { value: '書類選考', label: '書類選考' },
  { value: '一次面接', label: '一次面接' },
  { value: '二次面接', label: '二次面接' },
  { value: '最終面接', label: '最終面接' },
  { value: '内定', label: '内定' },
  { value: '辞退', label: '辞退' },
] as const;

export const DECLINE_REASON_OPTIONS = [
  { value: '業務内容が希望と合致しない', label: '業務内容が希望と合致しない' },
  { value: '事業内容が希望と合致しない', label: '事業内容が希望と合致しない' },
  { value: '給与水準が希望と合致しない', label: '給与水準が希望と合致しない' },
  { value: 'その他の理由', label: 'その他の理由' },
] as const;

// 業種の選択肢（Step1のprofileから流用してカスタマイズ）
export const INDUSTRY_OPTIONS = [
  { id: '1', name: 'IT・通信' },
  { id: '2', name: 'メーカー' },
  { id: '3', name: '商社' },
  { id: '4', name: '金融' },
  { id: '5', name: 'コンサルティング' },
  { id: '6', name: '不動産・建設' },
  { id: '7', name: '小売・流通' },
  { id: '8', name: '広告・メディア' },
  { id: '9', name: '医療・福祉' },
  { id: '10', name: '教育' },
  { id: '11', name: 'サービス' },
  { id: '12', name: 'その他' },
] as const;
