export const JOB_CHANGE_TIMING_OPTIONS = [
  { value: 'immediately', label: 'すぐにでも' },
  { value: 'within_3months', label: '3ヶ月以内' },
  { value: 'within_6months', label: '6ヶ月以内' },
  { value: 'within_1year', label: '1年以内' },
  { value: 'good_opportunity', label: '良いところがあれば' },
  { value: 'not_considering', label: '転職は考えていない' },
] as const;

export const CURRENT_ACTIVITY_STATUS_OPTIONS = [
  { value: 'active_searching', label: '積極的に活動中' },
  { value: 'searching', label: '活動中' },
  { value: 'info_gathering', label: '情報収集中' },
  { value: 'not_active', label: '活動していない' },
] as const;

export const PROGRESS_STATUS_OPTIONS = [
  { value: 'application', label: '応募済み' },
  { value: 'document_screening', label: '書類選考中' },
  { value: 'first_interview', label: '一次面接' },
  { value: 'second_interview', label: '二次面接' },
  { value: 'final_interview', label: '最終面接' },
  { value: 'offer', label: '内定' },
  { value: 'declined', label: '辞退' },
  { value: 'rejected', label: '不合格' },
] as const;

export const DECLINE_REASON_OPTIONS = [
  { value: 'salary', label: '給与・待遇' },
  { value: 'job_content', label: '仕事内容' },
  { value: 'work_location', label: '勤務地' },
  { value: 'company_culture', label: '社風・文化' },
  { value: 'career_path', label: 'キャリアパス' },
  { value: 'work_life_balance', label: 'ワークライフバランス' },
  { value: 'other', label: 'その他' },
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
