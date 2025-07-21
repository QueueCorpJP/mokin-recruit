import React from 'react';
import { CompanyGroup } from './types';

interface ConfirmViewProps {
  group: string;
  companyGroups: CompanyGroup[];
  title: string;
  images: File[];
  jobTypes: string[];
  industries: string[];
  jobDescription: string;
  positionSummary: string;
  skills: string;
  otherRequirements: string;
  salaryMin: string;
  salaryMax: string;
  salaryNote: string;
  locations: string[];
  locationNote: string;
  selectionProcess: string;
  employmentType: string;
  employmentTypeNote: string;
  workingHours: string;
  overtime: string;
  holidays: string;
  appealPoints: string[];
  smoke: string;
  smokeNote: string;
  resumeRequired: string[];
  memo: string;
  publicationType: string;
  setPublicationType: (value: string) => void;
}

export const ConfirmView: React.FC<ConfirmViewProps> = ({
  group,
  companyGroups,
  title,
  images,
  jobTypes,
  industries,
  jobDescription,
  positionSummary,
  skills,
  otherRequirements,
  salaryMin,
  salaryMax,
  salaryNote,
  locations,
  locationNote,
  selectionProcess,
  employmentType,
  employmentTypeNote,
  workingHours,
  overtime,
  holidays,
  appealPoints,
  smoke,
  smokeNote,
  resumeRequired,
  memo,
  publicationType,
  setPublicationType
}) => {
  const getGroupName = () => {
    const selectedGroup = companyGroups.find(g => g.id === group);
    return selectedGroup ? selectedGroup.group_name : '未選択';
  };

  const formatSalary = () => {
    if (salaryMin && salaryMax) {
      return `${salaryMin}万円〜${salaryMax}万円`;
    } else if (salaryMin) {
      return `${salaryMin}万円〜`;
    } else if (salaryMax) {
      return `〜${salaryMax}万円`;
    }
    return '未選択';
  };

  const TagDisplay: React.FC<{ items: string[] }> = ({ items }) => (
    <div className="flex flex-wrap gap-2 items-center justify-start w-full">
      {items.map(item => (
        <div
          key={item}
          className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]"
        >
          <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
            {item}
          </span>
        </div>
      ))}
    </div>
  );

  const DisplayValue: React.FC<{ value: string; className?: string }> = ({ value, className = "" }) => (
    <div className={`font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] ${className}`}>
      {value || '未入力'}
    </div>
  );

  return (
    <>
      {/* グループ */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            グループ
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-center w-[400px]">
            <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
              {getGroupName()}
            </div>
          </div>
        </div>
      </div>
      
      {/* 求人タイトル */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            求人タイトル
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <DisplayValue value={title} />
          </div>
        </div>
      </div>

      {/* 写真 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
          イメージ画像
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <div className="flex flex-wrap gap-4 items-center justify-start w-full">
              {images.map((image, idx) => {
                const url = URL.createObjectURL(image);
                return (
                  <div key={idx} className="relative w-40 h-28 border border-[#e9ecef] rounded-[5px] overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img src={url} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                  </div>
                );
              })}
              {images.length === 0 && (
                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#999999]">
                  写真が選択されていません
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 職種 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            職種
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            {jobTypes.length > 0 ? (
              <TagDisplay items={jobTypes} />
            ) : (
              <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#999999]">
                職種が選択されていません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 業種 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            業種
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            {industries.length > 0 ? (
              <TagDisplay items={industries} />
            ) : (
              <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#999999]">
                業種が選択されていません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ポジション概要（業務内容＋魅力） */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            ポジション概要
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6">
          {/* 業務内容 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">業務内容</label>
            <DisplayValue value={jobDescription} className="whitespace-pre-wrap" />
          </div>
          {/* 当ポジションの魅力 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">当ポジションの魅力</label>
            <DisplayValue value={positionSummary} className="whitespace-pre-wrap" />
          </div>
        </div>
      </div>

      {/* 求める人物像 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            求める人物像
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6">
          {/* スキル・経験 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">スキル・経験</label>
            <DisplayValue value={skills} className="whitespace-pre-wrap" />
          </div>
          {/* その他・求める人物像など */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">その他・求める人物像など</label>
            <DisplayValue value={otherRequirements} className="whitespace-pre-wrap" />
          </div>
        </div>
      </div>

      {/* 条件・待遇 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            条件・待遇
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8 items-start justify-start px-0 py-6">
          {/* 想定年収 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">想定年収</label>
            <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
              {formatSalary()}
            </div>
          </div>
          {/* 年収補足 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">年収補足</label>
            <DisplayValue value={salaryNote} className="whitespace-pre-wrap" />
          </div>
          {/* 勤務地 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">勤務地</label>
            <div className="flex flex-col gap-2 items-start justify-start w-full">
              {locations.length > 0 ? (
                <TagDisplay items={locations} />
              ) : (
                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#999999]">
                  勤務地が選択されていません
                </div>
              )}
            </div>
          </div>
          {/* 勤務地補足 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">勤務地補足</label>
            <DisplayValue value={locationNote} className="whitespace-pre-wrap" />
          </div>
          {/* 雇用形態 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">雇用形態</label>
            <div className="flex flex-col gap-2 items-start justify-center w-[400px]">
              <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                {employmentType || '正社員'}
              </div>
            </div>
          </div>
          {/* 雇用形態補足 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">雇用形態補足</label>
            <DisplayValue value={employmentTypeNote} className="whitespace-pre-wrap" />
          </div>
          {/* 就業時間 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">就業時間</label>
            <DisplayValue value={workingHours} className="whitespace-pre-wrap" />
          </div>
          {/* 所定外労働の有無 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">所定外労働の有無</label>
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
              {overtime || '未選択'}
            </div>
          </div>
          {/* 備考 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">備考</label>
            <DisplayValue value={memo} className="whitespace-pre-wrap" />
          </div>
          {/* 休日・休暇 */}
          <div className="w-full">
            <label className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] mb-2 block">休日・休暇</label>
            <DisplayValue value={holidays} className="whitespace-pre-wrap" />
          </div>
        </div>
      </div>

      {/* 選考フロー */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            選考情報
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <DisplayValue value={selectionProcess} className="whitespace-pre-wrap" />
          </div>
        </div>
      </div>

      {/* アピールポイント */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            アピールポイント
          </div>
          <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
            最大6つまで選択可能
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-6 items-start justify-start w-full">
            {appealPoints.length > 0 ? (
              <TagDisplay items={appealPoints} />
            ) : (
              <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#999999]">
                アピールポイントが選択されていません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 受動喫煙防止措置 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            受動喫煙防止措置
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
              {smoke || '未選択'}
            </div>
            <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#999999] w-full">
              就業場所が屋外である、就業場所によって対策内容が異なる、対策内容を断言できないなどの場合は、「その他」を選択し、面談・面接時に候補者にお伝えください。
            </div>
          </div>
        </div>
      </div>

      {/* 応募時のレジュメ提出 */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            応募時のレジュメ提出
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-4 items-start justify-start w-full">
            <div className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#999999] w-full">
              ※ 応募後に別途提出を依頼することも可能です。
            </div>
            {resumeRequired.length > 0 ? (
              <TagDisplay items={resumeRequired} />
            ) : (
              <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#999999]">
                レジュメ提出項目が選択されていません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 社内メモ */}
      <div className="flex flex-row gap-8 items-stretch justify-start w-full mb-2">
        <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]">
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            社内メモ
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            <DisplayValue value={memo} className="whitespace-pre-wrap" />
          </div>
        </div>
      </div>

      {/* 公開範囲選択セクション */}
      <div className="mt-10 w-full">
        <div className="border-2 border-[#0f9058] border-solid rounded-[10px] bg-white p-[40px]">
          <div className="flex flex-col gap-6 items-start justify-start w-full">
            {/* タイトル */}
            <div className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[2px] text-[#0f9058] w-full">
              求人内容を確認の上、公開範囲を選択してください。
            </div>
            
            {/* 一般公開 */}
            <div className="flex flex-row gap-6 items-center justify-start w-full">
              <div className="flex flex-row gap-2 items-center justify-start w-[120px]">
                <div className="relative w-5 h-5">
                  <input
                    type="radio"
                    name="publicationType"
                    value="public"
                    checked={publicationType === 'public'}
                    onChange={(e) => setPublicationType(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    publicationType === 'public' ? 'border-[#0f9058]' : 'border-[#dcdcdc]'
                  }`}>
                    {publicationType === 'public' && (
                      <div className="w-3 h-3 rounded-full bg-[#0f9058]"></div>
                    )}
                  </div>
                </div>
                <label 
                  htmlFor="public"
                  className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] cursor-pointer"
                >
                  一般公開
                </label>
              </div>
              <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                すべての候補者（サービス未登録者含む）に求人票が公開され、求人検索からも閲覧可能になります。<br />
                より幅広い層からの応募を募りたい場合におすすめです。
              </div>
            </div>

            {/* 登録会員限定 */}
            <div className="flex flex-row gap-6 items-center justify-start w-full">
              <div className="flex flex-row gap-2 items-center justify-start w-[120px]">
                <div className="relative w-5 h-5">
                  <input
                    type="radio"
                    name="publicationType"
                    value="members"
                    checked={publicationType === 'members'}
                    onChange={(e) => setPublicationType(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    publicationType === 'members' ? 'border-[#0f9058]' : 'border-[#dcdcdc]'
                  }`}>
                    {publicationType === 'members' && (
                      <div className="w-3 h-3 rounded-full bg-[#0f9058]"></div>
                    )}
                  </div>
                </div>
                <label 
                  htmlFor="members"
                  className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] cursor-pointer"
                >
                  登録会員限定
                </label>
              </div>
              <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                サービスに登録している候補者にのみ求人票が表示され、会員向けの求人検索からも閲覧可能になります。<br />
                登録済みの信頼できるユーザーのみに求人を届けたい場合におすすめです。
              </div>
            </div>

            {/* スカウト限定 */}
            <div className="flex flex-row gap-6 items-center justify-start w-full">
              <div className="flex flex-row gap-2 items-center justify-start w-[120px]">
                <div className="relative w-5 h-5">
                  <input
                    type="radio"
                    name="publicationType"
                    value="scout"
                    checked={publicationType === 'scout'}
                    onChange={(e) => setPublicationType(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    publicationType === 'scout' ? 'border-[#0f9058]' : 'border-[#dcdcdc]'
                  }`}>
                    {publicationType === 'scout' && (
                      <div className="w-3 h-3 rounded-full bg-[#0f9058]"></div>
                    )}
                  </div>
                </div>
                <label 
                  htmlFor="scout"
                  className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] cursor-pointer"
                >
                  スカウト限定
                </label>
              </div>
              <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                貴社からのスカウトを受け取った候補者のみに求人票が表示されます。<br />
                特定のターゲット人材にのみ求人内容を見せたい場合におすすめです。
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 