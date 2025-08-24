import { redirect } from 'next/navigation';
import { requireCandidateAuth } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import EditButton from './EditButton';

// 候補者データの型定義
interface CandidateData {
  id: string;
  email: string;
  last_name?: string;
  first_name?: string;
  last_name_kana?: string;
  first_name_kana?: string;
  phone_number?: string;
  current_residence?: string;
  prefecture?: string;
  gender?: string;
  birth_date?: string;
  current_income?: string;
}

// 候補者データを取得する関数
async function getCandidateData(candidateId: string): Promise<CandidateData | null> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('candidates')
      .select(`
        id,
        email,
        last_name,
        first_name,
        last_name_kana,
        first_name_kana,
        phone_number,
        current_residence,
        prefecture,
        gender,
        birth_date,
        current_income
      `)
      .eq('id', candidateId)
      .single();

    if (error) {
      console.error('候補者データの取得に失敗しました:', error);
      return null;
    }

    return data as CandidateData;
  } catch (error) {
    console.error('データベースエラー:', error);
    return null;
  }
}

// 基本情報確認ページ
export default async function CandidateBasicInfoPage() {
  // 認証チェック
  const user = await requireCandidateAuth();
  if (!user) {
    redirect('/candidate/auth/login');
  }

  // 候補者データを取得
  const candidateData = await getCandidateData(user.id);
  if (!candidateData) {
    redirect('/candidate/auth/login');
  }

  // 生年月日をフォーマット
  const formatBirthDate = (birthDate?: string) => {
    if (!birthDate) return { year: 'yyyy', month: 'mm', day: 'dd' };
    
    const date = new Date(birthDate);
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0')
    };
  };

  // 性別の表示名を取得
  const getGenderDisplay = (gender?: string) => {
    switch (gender) {
      case 'male': return '男性';
      case 'female': return '女性';
      case 'unspecified': return '未指定';
      default: return '未設定';
    }
  };

  const birthDate = formatBirthDate(candidateData.birth_date);

  return (
    <div className="flex flex-col min-h-screen isolate">
    

      {/* メインコンテンツ */}
      <main className="flex-1 relative z-[2]">
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10">
          {/* パンくずリスト */}
          <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-4">
            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              プロフィール確認・編集
            </span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 1L6 4L3 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              基本情報
            </span>
          </div>

          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8">
              {/* プロフィールアイコン */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 lg:w-8 lg:h-8"
              >
                <path
                  d="M8.34868 0H18.9813H19.8047L20.3871 0.581312L28.4372 8.63138L29.0186 9.21319V10.0366V26.6313C29.0186 29.5911 26.6102 32 23.6498 32H8.34862C5.38936 32 2.98099 29.5911 2.98099 26.6313V5.36763C2.98105 2.40775 5.38937 0 8.34868 0ZM4.96874 26.6313C4.96874 28.4984 6.48199 30.0123 8.34862 30.0123H23.6498C25.517 30.0123 27.0308 28.4984 27.0308 26.6313V10.0367H21.7984C20.2432 10.0367 18.9813 8.77525 18.9813 7.21956V1.98763H8.34862C6.48199 1.98763 4.96874 3.5015 4.96874 5.36756V26.6313Z"
                  fill="white"
                />
                <path
                  d="M10.5803 9.96484C11.0595 10.3003 11.643 10.4984 12.271 10.4984C12.8995 10.4984 13.4825 10.3003 13.9624 9.96484C14.801 10.3258 15.3161 10.9587 15.6304 11.5178C16.0478 12.2593 15.7205 13.309 14.9996 13.309C14.2777 13.309 12.271 13.309 12.271 13.309C12.271 13.309 10.2649 13.309 9.54298 13.309C8.8216 13.309 8.49379 12.2593 8.91173 11.5178C9.22604 10.9587 9.74117 10.3258 10.5803 9.96484Z"
                  fill="white"
                />
                <path
                  d="M12.2711 9.79659C11.0384 9.79659 10.0402 8.79841 10.0402 7.56628V7.03166C10.0402 5.80066 11.0384 4.80078 12.2711 4.80078C13.5032 4.80078 14.5024 5.80066 14.5024 7.03166V7.56628C14.5024 8.79841 13.5031 9.79659 12.2711 9.79659Z"
                  fill="white"
                />
                <path
                  d="M8.87283 16.2734H23.2725V17.6716H8.87283V16.2734Z"
                  fill="white"
                />
                <path
                  d="M8.80008 20.4688H23.1997V21.8675H8.80008V20.4688Z"
                  fill="white"
                />
                <path
                  d="M8.85304 24.6641H18.9331V26.0618H8.85304V24.6641Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]">
              基本情報
            </h1>
          </div>
        </div>

        {/* フォーム部分 */}
        <div className="bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]">
          <div className="bg-white rounded-[24px] lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 lg:p-10 max-w-[728px] mx-auto">
            <div className="space-y-6 lg:space-y-2">
              {/* 氏名 */}
              <div className="lg:flex lg:gap-6">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                  <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                    氏名
                  </div>
                </div>
                <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                  <div className="flex gap-2 text-[16px] text-[#323232] tracking-[1.6px] font-medium">
                    <span>{candidateData.last_name || '未設定'}</span>
                    <span>{candidateData.first_name || '未設定'}</span>
                  </div>
                </div>
              </div>

              {/* フリガナ */}
              <div className="lg:flex lg:gap-6">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                  <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                    フリガナ
                  </div>
                </div>
                <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                  <div className="flex gap-2 text-[16px] font-medium text-[#323232] tracking-[1.6px]">
                    <span>{candidateData.last_name_kana || '未設定'}</span>
                    <span>{candidateData.first_name_kana || '未設定'}</span>
                  </div>
                </div>
              </div>

              {/* 性別 */}
              <div className="lg:flex lg:gap-6">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                  <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                    性別
                  </div>
                </div>
                <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                  <div className="text-[16px] font-medium text-[#323232] tracking-[1.6px]">
                    {getGenderDisplay(candidateData.gender)}
                  </div>
                </div>
              </div>

              {/* 現在の住まい */}
              <div className="lg:flex lg:gap-6">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                  <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                    現在の住まい
                  </div>
                </div>
                <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                  <div className="text-[16px] font-medium text-[#323232] tracking-[1.6px]">
                    {candidateData.prefecture || candidateData.current_residence || '未設定'}
                  </div>
                </div>
              </div>

              {/* 生年月日 */}
              <div className="lg:flex lg:gap-6">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                  <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                    生年月日
                  </div>
                </div>
                <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                  <div className="flex font-medium flex-wrap gap-2 items-center text-[16px] text-[#323232] tracking-[1.6px]">
                    <span>{birthDate.year}</span>
                    <span className="font-bold">年</span>
                    <span>{birthDate.month}</span>
                    <span className="font-bold">月</span>
                    <span>{birthDate.day}</span>
                    <span className="font-bold">日</span>
                  </div>
                </div>
              </div>

              {/* 連絡先電話番号 */}
              <div className="lg:flex lg:gap-6">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                  <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                    連絡先電話番号
                  </div>
                </div>
                <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                  <div className="text-[16px] font-medium text-[#323232] tracking-[1.6px]">
                    {candidateData.phone_number || '未設定'}
                  </div>
                </div>
              </div>

              {/* 現在の年収 */}
              <div className="lg:flex lg:gap-6">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                  <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                    現在の年収
                  </div>
                </div>
                <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                  <div className="text-[16px] font-medium text-[#323232] tracking-[1.6px]">
                    {candidateData.current_income || '未設定'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 編集ボタン */}
          <EditButton />
        </div>
      </main>

      {/* フッター */}
    </div>
  );
}
