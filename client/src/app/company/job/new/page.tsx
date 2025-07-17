'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import NewJobHeader from '@/components/company/job/NewJobHeader';
import LocationModal from '@/components/company/job/LocationModal';
import JobTypeModal from '@/components/company/job/JobTypeModal';
import IndustryModal from '@/components/company/job/IndustryModal';

// 企業グループの型定義
interface CompanyGroup {
  id: string;
  group_name: string;
}

export default function JobNewPage() {
  const router = useRouter();
  
  // 各項目の状態
  const [group, setGroup] = useState('');
  const [companyGroups, setCompanyGroups] = useState<CompanyGroup[]>([]);
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [positionSummary, setPositionSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [otherRequirements, setOtherRequirements] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryNote, setSalaryNote] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [locationNote, setLocationNote] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [employmentTypeNote, setEmploymentTypeNote] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [overtime, setOvertime] = useState('');
  const [holidays, setHolidays] = useState('');
  const [selectionProcess, setSelectionProcess] = useState('');
  const [appealPoints, setAppealPoints] = useState<string[]>([]);
  const [smoke, setSmoke] = useState('');
  const [smokeNote, setSmokeNote] = useState('');
  const [resumeRequired, setResumeRequired] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  
  // モーダルの状態
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isJobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);

  // 確認モードの状態
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  // バリデーション状態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  // 企業グループ情報を取得
  useEffect(() => {
    const fetchCompanyGroups = async () => {
      try {
        const token = localStorage.getItem('auth-token') || 
                     localStorage.getItem('auth_token') || 
                     localStorage.getItem('supabase-auth-token');
        
        console.log('Token found for groups API:', !!token);
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        
        const response = await fetch('/api/company/groups', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Groups API response status:', response.status);
        const result = await response.json();
        console.log('Groups API result:', result);
        
        if (result.success) {
          setCompanyGroups(result.data);
          // ユーザーのグループが1つの場合は自動選択
          if (result.data.length === 1) {
            setGroup(result.data[0].id);
          }
        } else {
          console.error('Failed to fetch company groups:', result.error);
          alert(`グループ取得エラー: ${result.error}`);
        }
      } catch (error) {
        console.error('Error fetching company groups:', error);
        alert(`通信エラー: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    fetchCompanyGroups();
  }, []);

  // 選択肢追加・削除
  const removeJobType = (val: string) => setJobTypes(jobTypes.filter(v => v !== val));
  const removeIndustry = (val: string) => setIndustries(industries.filter(v => v !== val));
  const removeLocation = (val: string) => setLocations(locations.filter(v => v !== val));

  // チェックボックス
  const toggleAppealPoint = (val: string) => setAppealPoints(ap => ap.includes(val) ? ap.filter(v => v !== val) : ap.length < 6 ? [...ap, val] : ap);
  const toggleResumeRequired = (val: string) => setResumeRequired(rq => rq.includes(val) ? rq.filter(v => v !== val) : [...rq, val]);

  // バリデーション関数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!group) newErrors.group = 'グループを選択してください';
    if (!title.trim()) newErrors.title = '求人タイトルを入力してください';
    if (!jobDescription.trim()) newErrors.jobDescription = '仕事内容を入力してください';
    if (!employmentType) newErrors.employmentType = '雇用形態を選択してください';
    if (locations.length === 0) newErrors.locations = '勤務地を選択してください';
    if (jobTypes.length === 0) newErrors.jobTypes = '職種を選択してください';
    if (industries.length === 0) newErrors.industries = '業種を選択してください';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 確認モードに切り替え
  const handleConfirm = () => {
    if (validateForm()) {
      setIsConfirmMode(true);
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  // 編集モードに戻る
  const handleBack = () => {
    setIsConfirmMode(false);
    setShowErrors(false);
  };

  // 送信処理
  const handleSubmit = async () => {
    const data = {
      company_group_id: group,
      title: title || '未設定',
      job_type: jobTypes[0] || '未設定',
      industry: industries[0] || '未設定', 
      job_description: jobDescription || '未設定',
      required_skills: skills || '',
      preferred_skills: otherRequirements || '',
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      employment_type: employmentType || '未設定',
      work_location: locations[0] || '未設定',
      remote_work_available: false,
      status: 'DRAFT',
      application_deadline: null,
      published_at: null
    };
    
    const token = localStorage.getItem('auth-token') || 
                 localStorage.getItem('auth_token') || 
                 localStorage.getItem('supabase-auth-token');
    
    try {
      const res = await fetch('/api/job/new', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (result.success) {
        // 完了ページにリダイレクト
        router.push('/company/job/complete');
      } else {
        console.error('API Error:', result);
        alert(`エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('Request Error:', error);
      alert('通信エラーが発生しました');
    }
  };

  // 確認モード用の表示コンポーネント
  const ConfirmField = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
    <div className="flex flex-row gap-6 items-start justify-start w-full">
      <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
          {label}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2.5 items-start justify-center px-0 py-6">
        {children || (
          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
            {value || '未設定'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <NewJobHeader />
      <div className="flex min-h-[577px] pt-10 pr-20 pb-20 pl-20 flex-col items-center gap-10 self-stretch bg-[#F9F9F9]">
        <div className="w-full max-w-5xl space-y-8">
          <div className="flex p-10 flex-col items-start gap-2 self-stretch rounded-[10px] bg-white">
            {isConfirmMode ? (
              /* 確認モード */
              <>
                <ConfirmField 
                  label="グループ" 
                  value={companyGroups.find(g => g.id === group)?.group_name || '未設定'} 
                />
                <ConfirmField label="求人タイトル" value={title} />
                <ConfirmField label="写真">
                  <div className="flex flex-wrap gap-4 items-center justify-start w-full">
                    {images.map((image, idx) => {
                      const url = URL.createObjectURL(image);
                      return (
                        <div key={idx} className="relative w-40 h-28 border rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img src={url} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                        </div>
                      );
                    })}
                    {images.length === 0 && (
                      <div className="text-[#666666] text-sm">写真が選択されていません</div>
                    )}
                  </div>
                </ConfirmField>
                <ConfirmField label="職種">
                  <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                    {jobTypes.map(type => (
                      <div key={type} className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]">
                        <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                          {type}
                        </span>
                      </div>
                    ))}
                  </div>
                </ConfirmField>
                <ConfirmField label="業種">
                  <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                    {industries.map(type => (
                      <div key={type} className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]">
                        <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                          {type}
                        </span>
                      </div>
                    ))}
                  </div>
                </ConfirmField>
                <ConfirmField label="業務内容" value={jobDescription} />
                <ConfirmField label="想定年収（最小）" value={salaryMin ? `${salaryMin}万円` : ''} />
                <ConfirmField label="想定年収（最大）" value={salaryMax ? `${salaryMax}万円` : ''} />
                <ConfirmField label="概要" value={positionSummary} />
                <ConfirmField label="勤務地">
                  <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                    {locations.map(loc => (
                      <div key={loc} className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]">
                        <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                          {loc}
                        </span>
                      </div>
                    ))}
                  </div>
                </ConfirmField>
                <ConfirmField label="必須条件" value={skills} />
                <ConfirmField label="歓迎条件" value={otherRequirements} />
                <ConfirmField label="福利厚生" value={salaryNote} />
                <ConfirmField label="選考フロー" value={selectionProcess} />
                <ConfirmField label="雇用形態" value={employmentType} />
                <ConfirmField label="雇用形態備考" value={employmentTypeNote} />
                <ConfirmField label="勤務地備考" value={locationNote} />
                <ConfirmField label="勤務時間" value={workingHours} />
                <ConfirmField label="残業" value={overtime} />
                <ConfirmField label="休日・休暇" value={holidays} />
                <ConfirmField label="アピールポイント">
                  <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                    {appealPoints.map(point => (
                      <div key={point} className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]">
                        <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </ConfirmField>
                <ConfirmField label="受動喫煙防止措置" value={smoke} />
                <ConfirmField label="喫煙備考" value={smokeNote} />
                <ConfirmField label="応募時のレジュメ提出">
                  <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                    {resumeRequired.map(item => (
                      <div key={item} className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]">
                        <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </ConfirmField>
                <ConfirmField label="社内メモ" value={memo} />
              </>
            ) : (
              /* 編集モード */
              <>
                {/* グループ */}
                <div className="flex flex-row gap-6 items-start justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      グループ
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-center px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-center w-[400px]">
                      <div className="relative w-full">
                        <select 
                          className={`w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] appearance-none ${showErrors && errors.group ? 'border-red-500 bg-red-50' : ''}`}
                          value={group} 
                          onChange={e => setGroup(e.target.value)}
                        >
                          <option value="">未選択</option>
                          {companyGroups.map(group => (
                            <option key={group.id} value={group.id}>{group.group_name}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-3.5 h-[9.333px]" fill="none" viewBox="0 0 14 10">
                            <path
                              d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                              fill="#0F9058"
                            />
                          </svg>
                        </div>
                      </div>
                      {showErrors && errors.group && <span className="text-red-500 text-sm">{errors.group}</span>}
                    </div>
                  </div>
                </div>
                
                {/* 求人タイトル */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      求人タイトル
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-center px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <input 
                        className={`w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] ${showErrors && errors.title ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="求人タイトルを入力" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                      />
                      {showErrors && errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                    </div>
                  </div>
                </div>

                {/* 写真 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      写真
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <ImageUpload
                        images={images}
                        onChange={setImages}
                        maxImages={5}
                      />
                    </div>
                  </div>
                </div>

                {/* 職種 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      職種
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <div className="flex flex-row gap-6 items-center justify-start w-full">
                        <button
                          type="button"
                          onClick={() => setJobTypeModalOpen(true)}
                          className={`flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] ${showErrors && errors.jobTypes ? 'border-red-500 bg-red-50' : ''}`}
                        >
                          <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            職種を選択
                          </span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                        {jobTypes.map(type => (
                          <div
                            key={type}
                            className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                            onClick={() => removeJobType(type)}
                          >
                            <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                              {type}
                            </span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                              <path
                                d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                                fill="#0F9058"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                      {showErrors && errors.jobTypes && <span className="text-red-500 text-sm">{errors.jobTypes}</span>}
                    </div>
                  </div>
                </div>

                {/* 業種 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      業種
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <div className="flex flex-row gap-6 items-center justify-start w-full">
                        <button
                          type="button"
                          onClick={() => setIndustryModalOpen(true)}
                          className={`flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] ${showErrors && errors.industries ? 'border-red-500 bg-red-50' : ''}`}
                        >
                          <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            業種を選択
                          </span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                        {industries.map(industry => (
                          <div
                            key={industry}
                            className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                            onClick={() => removeIndustry(industry)}
                          >
                            <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                              {industry}
                            </span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                              <path
                                d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                                fill="#0F9058"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                      {showErrors && errors.industries && <span className="text-red-500 text-sm">{errors.industries}</span>}
                    </div>
                  </div>
                </div>

                {/* 業務内容 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      業務内容
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className={`w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[147px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none ${showErrors && errors.jobDescription ? 'border-red-500 bg-red-50' : ''}`}
                        placeholder="具体的な業務内容を入力してください。" 
                        value={jobDescription} 
                        onChange={e => setJobDescription(e.target.value)} 
                      />
                      {showErrors && errors.jobDescription && <span className="text-red-500 text-sm">{errors.jobDescription}</span>}
                    </div>
                  </div>
                </div>

                {/* 想定年収 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      想定年収
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-center px-0 py-6">
                    <div className="flex flex-col gap-4 items-start justify-start w-full">
                      <div className="flex gap-4 items-center w-full">
                        <div className="flex items-center gap-2">
                          <input 
                            className="w-32 bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999]"
                            placeholder="300" 
                            type="number"
                            value={salaryMin} 
                            onChange={e => setSalaryMin(e.target.value)} 
                          />
                          <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">万円</span>
                        </div>
                        <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">〜</span>
                        <div className="flex items-center gap-2">
                          <input 
                            className="w-32 bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999]"
                            placeholder="500" 
                            type="number"
                            value={salaryMax} 
                            onChange={e => setSalaryMax(e.target.value)} 
                          />
                          <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">万円</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 概要 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      概要
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="求人の概要を入力してください。" 
                        value={positionSummary} 
                        onChange={e => setPositionSummary(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 勤務地 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      勤務地
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <div className="flex flex-row gap-6 items-center justify-start w-full">
                        <button
                          type="button"
                          onClick={() => setLocationModalOpen(true)}
                          className={`flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] ${showErrors && errors.locations ? 'border-red-500 bg-red-50' : ''}`}
                        >
                          <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            勤務地を選択
                          </span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                        {locations.map(loc => (
                          <div
                            key={loc}
                            className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                            onClick={() => removeLocation(loc)}
                          >
                            <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                              {loc}
                            </span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                              <path
                                d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                                fill="#0F9058"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                      {showErrors && errors.locations && <span className="text-red-500 text-sm">{errors.locations}</span>}
                    </div>
                  </div>
                </div>

                {/* 必須条件 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      必須条件
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="必須条件を入力してください。" 
                        value={skills} 
                        onChange={e => setSkills(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 歓迎条件 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      歓迎条件
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="歓迎条件を入力してください。" 
                        value={otherRequirements} 
                        onChange={e => setOtherRequirements(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 福利厚生 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      福利厚生
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="福利厚生を入力してください。" 
                        value={salaryNote} 
                        onChange={e => setSalaryNote(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 選考フロー */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      選考フロー
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="選考プロセスを入力してください。" 
                        value={selectionProcess} 
                        onChange={e => setSelectionProcess(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 雇用形態 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      雇用形態
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-center px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-center w-[400px]">
                      <div className="relative w-full">
                        <select 
                          className={`w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] appearance-none ${showErrors && errors.employmentType ? 'border-red-500 bg-red-50' : ''}`}
                          value={employmentType} 
                          onChange={e => setEmploymentType(e.target.value)}
                        >
                          <option value="">未選択</option>
                          <option value="正社員">正社員</option>
                          <option value="契約社員">契約社員</option>
                          <option value="派遣社員">派遣社員</option>
                          <option value="アルバイト・パート">アルバイト・パート</option>
                          <option value="業務委託">業務委託</option>
                          <option value="インターン">インターン</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-3.5 h-[9.333px]" fill="none" viewBox="0 0 14 10">
                            <path
                              d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                              fill="#0F9058"
                            />
                          </svg>
                        </div>
                      </div>
                      {showErrors && errors.employmentType && <span className="text-red-500 text-sm">{errors.employmentType}</span>}
                    </div>
                  </div>
                </div>

                {/* 雇用形態備考 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      雇用形態備考
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="雇用形態の詳細を入力してください。" 
                        value={employmentTypeNote} 
                        onChange={e => setEmploymentTypeNote(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 勤務地備考 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      勤務地備考
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="勤務地の詳細を入力してください。" 
                        value={locationNote} 
                        onChange={e => setLocationNote(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 勤務時間 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      勤務時間
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="勤務時間を入力してください。" 
                        value={workingHours} 
                        onChange={e => setWorkingHours(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 残業 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      残業
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="残業について入力してください。" 
                        value={overtime} 
                        onChange={e => setOvertime(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 休日・休暇 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      休日・休暇
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="休日・休暇を入力してください。" 
                        value={holidays} 
                        onChange={e => setHolidays(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* アピールポイント */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      アピールポイント
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-4 items-start justify-start w-full">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {['リモートワーク可', '残業少なめ', '副業OK', '服装自由', '年間休日120日以上', '未経験歓迎'].map(point => (
                          <label key={point} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={appealPoints.includes(point)}
                              onChange={() => toggleAppealPoint(point)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${appealPoints.includes(point) ? 'bg-[#0F9058] border-[#0F9058]' : 'border-[#999999]'}`}>
                              {appealPoints.includes(point) && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 9">
                                  <path
                                    d="M11.2071 1.20711C11.5976 0.816607 11.5976 0.183386 11.2071 -0.207113C10.8166 -0.597613 10.1834 -0.597613 9.79289 -0.207113L4.5 4.08579L2.20711 1.79289C1.81658 1.40237 1.18337 1.40237 0.792893 1.79289C0.402369 2.18342 0.402369 2.81658 0.792893 3.20711L3.79289 6.20711C4.18342 6.59763 4.81658 6.59763 5.20711 6.20711L11.2071 1.20711Z"
                                    fill="white"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                              {point}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                        {appealPoints.map(point => (
                          <div
                            key={point}
                            className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                            onClick={() => toggleAppealPoint(point)}
                          >
                            <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                              {point}
                            </span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                              <path
                                d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                                fill="#0F9058"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 受動喫煙防止措置 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      受動喫煙防止措置
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-center px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-center w-[400px]">
                      <div className="relative w-full">
                        <select 
                          className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] appearance-none"
                          value={smoke} 
                          onChange={e => setSmoke(e.target.value)}
                        >
                          <option value="">未選択</option>
                          <option value="禁煙">禁煙</option>
                          <option value="分煙">分煙</option>
                          <option value="喫煙可">喫煙可</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-3.5 h-[9.333px]" fill="none" viewBox="0 0 14 10">
                            <path
                              d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                              fill="#0F9058"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 喫煙備考 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      喫煙備考
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="喫煙に関する詳細を入力してください。" 
                        value={smokeNote} 
                        onChange={e => setSmokeNote(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 応募時のレジュメ提出 */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      応募時のレジュメ提出
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-4 items-start justify-start w-full">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {['履歴書', '職務経歴書', 'ポートフォリオ', '志望動機書', '自己PR書', 'その他'].map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={resumeRequired.includes(item)}
                              onChange={() => toggleResumeRequired(item)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${resumeRequired.includes(item) ? 'bg-[#0F9058] border-[#0F9058]' : 'border-[#999999]'}`}>
                              {resumeRequired.includes(item) && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 9">
                                  <path
                                    d="M11.2071 1.20711C11.5976 0.816607 11.5976 0.183386 11.2071 -0.207113C10.8166 -0.597613 10.1834 -0.597613 9.79289 -0.207113L4.5 4.08579L2.20711 1.79289C1.81658 1.40237 1.18337 1.40237 0.792893 1.79289C0.402369 2.18342 0.402369 2.81658 0.792893 3.20711L3.79289 6.20711C4.18342 6.59763 4.81658 6.59763 5.20711 6.20711L11.2071 1.20711Z"
                                    fill="white"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center justify-start w-full">
                        {resumeRequired.map(item => (
                          <div
                            key={item}
                            className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px] cursor-pointer"
                            onClick={() => toggleResumeRequired(item)}
                          >
                            <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                              {item}
                            </span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                              <path
                                d="M0.207031 0.207031C0.482709 -0.0685565 0.929424 -0.0685933 1.20508 0.207031L6.00098 5.00195L10.7949 0.208984C11.0706 -0.0666642 11.5173 -0.0666642 11.793 0.208984C12.0685 0.48464 12.0686 0.931412 11.793 1.20703L6.99902 6L11.793 10.7939L11.8184 10.8203C12.0684 11.0974 12.0599 11.5251 11.793 11.792C11.5259 12.0589 11.0984 12.0667 10.8213 11.8164L10.7949 11.792L6.00098 6.99805L1.20508 11.7939L1.17871 11.8193C0.9016 12.0693 0.473949 12.0608 0.207031 11.7939C-0.0598942 11.527 -0.0683679 11.0994 0.181641 10.8223L0.207031 10.7959L5.00195 6L0.207031 1.20508C-0.0686416 0.929435 -0.0686416 0.482674 0.207031 0.207031Z"
                                fill="#0F9058"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 社内メモ */}
                <div className="flex flex-row gap-6 items-center justify-start w-full">
                  <div className="bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center min-h-[50px] px-6 py-0 rounded-[5px] w-[200px]">
                    <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                      社内メモ
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6">
                    <div className="flex flex-col gap-2 items-start justify-start w-full">
                      <textarea 
                        className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] h-[100px] font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] placeholder:text-[#999999] resize-none"
                        placeholder="社内メモを入力してください。" 
                        value={memo} 
                        onChange={e => setMemo(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>


              </>
            )}
          </div>
        
          {/* ボタンエリア */}
          <div className="flex justify-center items-center gap-4 mt-8 w-full">
            {isConfirmMode ? (
              <>
                <Button 
                  type="button" 
                  onClick={handleBack}
                  style={{
                    borderRadius: '32px',
                    background: 'transparent',
                    border: '2px solid #198D76',
                    color: '#198D76',
                    fontWeight: 'bold',
                    padding: '10px 40px',
                    minWidth: '160px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  戻る
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  style={{
                    borderRadius: '32px',
                    background: 'linear-gradient(83deg, #198D76 0%, #1CA74F 100%)',
                    boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '10px 40px',
                    minWidth: '160px',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  この投稿を確認する
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="button" 
                  style={{
                    borderRadius: '32px',
                    background: 'transparent',
                    border: '2px solid #198D76',
                    color: '#198D76',
                    fontWeight: 'bold',
                    padding: '10px 40px',
                    minWidth: '160px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  下書き保存
                </Button>
                <Button 
                  type="button" 
                  onClick={handleConfirm}
                  style={{
                    borderRadius: '32px',
                    background: 'linear-gradient(83deg, #198D76 0%, #1CA74F 100%)',
                    boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '10px 40px',
                    minWidth: '160px',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  確認する
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* モーダル */}
      {!isConfirmMode && (
        <>
          <LocationModal
            isOpen={isLocationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            selectedLocations={locations}
            setSelectedLocations={setLocations}
          />
          <JobTypeModal
            isOpen={isJobTypeModalOpen}
            onClose={() => setJobTypeModalOpen(false)}
            selectedJobTypes={jobTypes}
            setSelectedJobTypes={setJobTypes}
          />
          <IndustryModal
            isOpen={isIndustryModalOpen}
            onClose={() => setIndustryModalOpen(false)}
            selectedIndustries={industries}
            setSelectedIndustries={setIndustries}
          />
        </>
      )}
    </div>
  );
}
