/**
 * JoiningDateModal関連の型定義
 * Figmaデザインに基づく入社日設定モーダル
 */

export interface JoiningDateFormData {
  year: string;
  month: string;
  day: string;
  joiningDate: string; // YYYY-MM-DD format
}

export interface JoiningDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formData: JoiningDateFormData) => void;
  candidateName?: string;
  title?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// バリデーションエラーの型
export interface JoiningDateErrors {
  year?: string;
  month?: string;
  day?: string;
}

// 年の選択肢を生成するヘルパー関数
export const generateYearOptions = (
  startYear?: number,
  yearsCount: number = 6
): SelectOption[] => {
  const currentYear = startYear || new Date().getFullYear();
  return [
    { value: '', label: '年を選択' },
    ...Array.from({ length: yearsCount }, (_, i) => {
      const year = currentYear + i;
      return { value: year.toString(), label: `${year}年` };
    }),
  ];
};

// 月の選択肢を生成するヘルパー関数
export const generateMonthOptions = (): SelectOption[] => {
  return [
    { value: '', label: '月を選択' },
    ...Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return { value: month.toString().padStart(2, '0'), label: `${month}月` };
    }),
  ];
};

// 日の選択肢を生成するヘルパー関数
export const generateDayOptions = (
  year: string,
  month: string
): SelectOption[] => {
  const baseOptions = [{ value: '', label: '日を選択' }];

  if (!year || !month) {
    return baseOptions;
  }

  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return { value: day.toString().padStart(2, '0'), label: `${day}日` };
  });

  return [...baseOptions, ...dayOptions];
};

// 日付バリデーション関数
export const validateJoiningDate = (
  year: string,
  month: string,
  day: string
): JoiningDateErrors => {
  const errors: JoiningDateErrors = {};

  if (!year) {
    errors.year = '年を選択してください';
  }

  if (!month) {
    errors.month = '月を選択してください';
  }

  if (!day) {
    errors.day = '日を選択してください';
  }

  // 過去の日付チェック
  if (year && month && day) {
    const selectedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.day = '本日以降の日付を選択してください';
    }
  }

  return errors;
};

// 日付フォーマット関数
export const formatJoiningDate = (
  year: string,
  month: string,
  day: string
): string => {
  return `${year}-${month}-${day}`;
};

// 日付表示用フォーマット関数
export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-');
};
