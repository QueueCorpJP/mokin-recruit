'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import NewJobHeader from '@/app/company/company/job/NewJobHeader';
import { Modal } from '@/components/ui/mo-dal';
import { CompanyGroup } from '@/app/company/company/job/types';
import { LocationModal } from '@/app/company/company/job/LocationModal';
import { JobTypeModal } from '@/app/company/company/job/JobTypeModal';
import { IndustryModal } from '@/app/company/company/job/IndustryModal';
import { FormFields } from '@/app/company/company/job/FormFields';
import { ConfirmView } from '@/app/company/company/job/ConfirmView';

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
  const [employmentType, setEmploymentType] = useState('正社員');
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
  const [publicationType, setPublicationType] = useState('public');
  
  // モーダルの状態
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isJobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);

  // 確認モードの状態
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  // バリデーション状態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  // 下書き保存用のキー
  const DRAFT_KEY = 'job_draft_data';

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

  // 下書きデータを復元
  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          
          // 各状態を復元
          if (draftData.group) setGroup(draftData.group);
          if (draftData.title) setTitle(draftData.title);
          if (draftData.jobTypes) setJobTypes(draftData.jobTypes);
          if (draftData.industries) setIndustries(draftData.industries);
          if (draftData.jobDescription) setJobDescription(draftData.jobDescription);
          if (draftData.positionSummary) setPositionSummary(draftData.positionSummary);
          if (draftData.skills) setSkills(draftData.skills);
          if (draftData.otherRequirements) setOtherRequirements(draftData.otherRequirements);
          if (draftData.salaryMin) setSalaryMin(draftData.salaryMin);
          if (draftData.salaryMax) setSalaryMax(draftData.salaryMax);
          if (draftData.salaryNote) setSalaryNote(draftData.salaryNote);
          if (draftData.locations) setLocations(draftData.locations);
          if (draftData.locationNote) setLocationNote(draftData.locationNote);
          if (draftData.employmentType) setEmploymentType(draftData.employmentType);
          if (draftData.employmentTypeNote) setEmploymentTypeNote(draftData.employmentTypeNote);
          if (draftData.workingHours) setWorkingHours(draftData.workingHours);
          if (draftData.overtime) setOvertime(draftData.overtime);
          if (draftData.holidays) setHolidays(draftData.holidays);
          if (draftData.selectionProcess) setSelectionProcess(draftData.selectionProcess);
          if (draftData.appealPoints) setAppealPoints(draftData.appealPoints);
          if (draftData.smoke) setSmoke(draftData.smoke);
          if (draftData.smokeNote) setSmokeNote(draftData.smokeNote);
          if (draftData.resumeRequired) setResumeRequired(draftData.resumeRequired);
          if (draftData.memo) setMemo(draftData.memo);
          if (draftData.publicationType) setPublicationType(draftData.publicationType);
          
          console.log('下書きデータを復元しました');
        }
      } catch (error) {
        console.error('下書きデータの復元に失敗しました:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    };

    loadDraft();
  }, []);

  // 年収のリアルタイムバリデーション
  useEffect(() => {
    validateSalary(salaryMin, salaryMax);
  }, [salaryMin, salaryMax]);

  // バリデーション関数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!group) newErrors.group = 'グループを選択してください';
    if (!title.trim()) newErrors.title = '求人タイトルを入力してください';
    if (images.length === 0) newErrors.images = '画像を選択してください';
    if (!jobDescription.trim()) newErrors.jobDescription = '仕事内容を入力してください';
    if (!employmentType || employmentType === '') newErrors.employmentType = '雇用形態を選択してください';
    if (locations.length === 0) newErrors.locations = '勤務地を選択してください';
    if (jobTypes.length === 0) newErrors.jobTypes = '職種を選択してください';
    if (industries.length === 0) newErrors.industries = '業種を選択してください';
    
    // 年収バリデーション
    if (salaryMin && salaryMax) {
      const minValue = parseInt(salaryMin);
      const maxValue = parseInt(salaryMax);
      if (minValue > maxValue) {
        newErrors.salary = '最大年収は最小年収よりも高く設定してください';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // エラーをクリアする関数
  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // 年収バリデーション関数
  const validateSalary = (minValue: string, maxValue: string) => {
    if (minValue && maxValue && minValue !== '' && maxValue !== '') {
      const min = parseInt(minValue);
      const max = parseInt(maxValue);
      if (min > max) {
        setErrors(prev => ({ ...prev, salary: '最大年収は最小年収よりも高く設定してください' }));
        return;
      }
    }
    // エラーをクリア
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.salary;
      return newErrors;
    });
  };

  // 下書き保存関数
  const saveDraft = () => {
    try {
      const draftData = {
        group,
        title,
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
        employmentType,
        employmentTypeNote,
        workingHours,
        overtime,
        holidays,
        selectionProcess,
        appealPoints,
        smoke,
        smokeNote,
        resumeRequired,
        memo,
        publicationType,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      alert('下書きを保存しました');
      console.log('下書きを保存しました');
    } catch (error) {
      console.error('下書きの保存に失敗しました:', error);
      alert('下書きの保存に失敗しました');
    }
  };

  // 下書きデータを削除
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      console.log('下書きデータを削除しました');
    } catch (error) {
      console.error('下書きデータの削除に失敗しました:', error);
    }
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
        // 下書きデータを削除
        clearDraft();
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

  // エラーサマリーコンポーネント
  const ErrorSummary: React.FC<{ errors: Record<string, string> }> = ({ errors }) => {
    const errorEntries = Object.entries(errors);
    if (errorEntries.length === 0) return null;

    const getFieldLabel = (field: string) => {
      const labels: Record<string, string> = {
        group: 'グループ',
        title: '求人タイトル',
        images: '画像',
        jobDescription: '業務内容',
        employmentType: '雇用形態',
        locations: '勤務地',
        jobTypes: '職種',
        industries: '業種',
        salary: '年収'
      };
      return labels[field] || field;
    };

    const scrollToField = (field: string) => {
      // フィールドまでスクロールする
      const element = document.querySelector(`[data-field="${field}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    return (
      <div className="mb-6 p-4 border-2 border-red-500 rounded-lg bg-red-50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-red-700 mb-2">
              入力に不備があります
            </h3>
            <p className="font-['Noto_Sans_JP'] font-medium text-[14px] text-red-600 mb-3">
              以下の項目を確認してください：
            </p>
            <ul className="space-y-2">
              {errorEntries.map(([field, message]) => (
                <li key={field} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToField(field)}
                    className="font-['Noto_Sans_JP'] font-medium text-[14px] text-red-700 hover:text-red-900 underline hover:no-underline cursor-pointer text-left"
                  >
                    • {getFieldLabel(field)}: {message}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <NewJobHeader />
      <div className="mx-[76px]">
        <div className="w-full my-[37px] p-[37px] rounded-[10px] bg-white">
          {isConfirmMode ? (
            <ConfirmView
              group={group}
              companyGroups={companyGroups}
              title={title}
              images={images}
              jobTypes={jobTypes}
              industries={industries}
              jobDescription={jobDescription}
              positionSummary={positionSummary}
              skills={skills}
              otherRequirements={otherRequirements}
              salaryMin={salaryMin}
              salaryMax={salaryMax}
              salaryNote={salaryNote}
              locations={locations}
              locationNote={locationNote}
              selectionProcess={selectionProcess}
              employmentType={employmentType}
              employmentTypeNote={employmentTypeNote}
              workingHours={workingHours}
              overtime={overtime}
              holidays={holidays}
              appealPoints={appealPoints}
              smoke={smoke}
              smokeNote={smokeNote}
              resumeRequired={resumeRequired}
              memo={memo}
              publicationType={publicationType}
              setPublicationType={setPublicationType}
            />
          ) : (
            <FormFields
              group={group}
              setGroup={(value: string) => { setGroup(value); clearFieldError('group'); }}
              companyGroups={companyGroups}
              title={title}
              setTitle={(value: string) => { setTitle(value); clearFieldError('title'); }}
              images={images}
              setImages={(images: File[]) => { setImages(images); clearFieldError('images'); }}
              jobTypes={jobTypes}
              setJobTypes={(types: string[]) => { setJobTypes(types); clearFieldError('jobTypes'); }}
              industries={industries}
              setIndustries={(industries: string[]) => { setIndustries(industries); clearFieldError('industries'); }}
              jobDescription={jobDescription}
              setJobDescription={(value: string) => { setJobDescription(value); clearFieldError('jobDescription'); }}
              positionSummary={positionSummary}
              setPositionSummary={setPositionSummary}
              skills={skills}
              setSkills={setSkills}
              otherRequirements={otherRequirements}
              setOtherRequirements={setOtherRequirements}
              salaryMin={salaryMin}
              setSalaryMin={setSalaryMin}
              salaryMax={salaryMax}
              setSalaryMax={setSalaryMax}
              salaryNote={salaryNote}
              setSalaryNote={setSalaryNote}
              locations={locations}
              setLocations={(locations: string[]) => { setLocations(locations); clearFieldError('locations'); }}
              locationNote={locationNote}
              setLocationNote={setLocationNote}
              selectionProcess={selectionProcess}
              setSelectionProcess={setSelectionProcess}
              employmentType={employmentType}
              setEmploymentType={(value: string) => { setEmploymentType(value); clearFieldError('employmentType'); }}
              employmentTypeNote={employmentTypeNote}
              setEmploymentTypeNote={setEmploymentTypeNote}
              workingHours={workingHours}
              setWorkingHours={setWorkingHours}
              overtime={overtime}
              setOvertime={setOvertime}
              holidays={holidays}
              setHolidays={setHolidays}
              appealPoints={appealPoints}
              setAppealPoints={setAppealPoints}
              smoke={smoke}
              setSmoke={setSmoke}
              smokeNote={smokeNote}
              setSmokeNote={setSmokeNote}
              resumeRequired={resumeRequired}
              setResumeRequired={setResumeRequired}
              memo={memo}
              setMemo={setMemo}
              setLocationModalOpen={setLocationModalOpen}
              setJobTypeModalOpen={setJobTypeModalOpen}
              setIndustryModalOpen={setIndustryModalOpen}
              errors={errors}
              showErrors={showErrors}
            />
          )}
        
          {/* ボタンエリア */}
          <div className="flex flex-col items-center gap-4 mt-[40px] w-full">
            {/* エラーサマリー */}
            {showErrors && <ErrorSummary errors={errors} />}
            
            <div className="flex justify-center items-center gap-4 w-full">
              {isConfirmMode ? (
                <>
                  <Button
                    type="button"
                    variant="green-outline"
                    size="lg"
                    className="rounded-[32px] min-w-[260px] font-bold px-10 py-6.5 bg-white text-[#198D76] font-['Noto_Sans_JP']"
                    onClick={handleBack}
                  >
                    修正する
                  </Button>
                  <button
                    type="button"
                    className="rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white"
                    onClick={handleSubmit}
                  >
                    この内容で掲載申請をする
                  </button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="green-outline"
                    size="lg"
                    className="rounded-[32px] min-w-[160px] font-bold px-10 py-6.5 bg-white text-[#198D76] font-['Noto_Sans_JP']"
                    onClick={saveDraft}
                  >
                    下書き保存
                  </Button>
                  <button
                    type="button"
                    className="rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white"
                    onClick={handleConfirm}
                  >
                    確認する
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* モーダル */}
        {!isConfirmMode && (
          <>
            {isLocationModalOpen && (
              <Modal
                title="勤務地を選択"
                isOpen={isLocationModalOpen}
                onClose={() => setLocationModalOpen(false)}
                selectedCount={locations.length}
                totalCount={47}
                primaryButtonText="決定"
                onPrimaryAction={() => {
                  setLocationModalOpen(false);
                  clearFieldError('locations');
                }}
              >
                <LocationModal
                  selectedLocations={locations}
                  setSelectedLocations={setLocations}
                />
              </Modal>
            )}
            {isJobTypeModalOpen && (
              <Modal
                title="職種を選択"
                isOpen={isJobTypeModalOpen}
                onClose={() => setJobTypeModalOpen(false)}
                selectedCount={jobTypes.length}
                totalCount={3}
                primaryButtonText="決定"
                onPrimaryAction={() => {
                  setJobTypeModalOpen(false);
                  clearFieldError('jobTypes');
                }}
              >
                <JobTypeModal
                  selectedJobTypes={jobTypes}
                  setSelectedJobTypes={setJobTypes}
                />
              </Modal>
            )}
            {isIndustryModalOpen && (
              <Modal
                title="業種を選択"
                isOpen={isIndustryModalOpen}
                onClose={() => setIndustryModalOpen(false)}
                selectedCount={industries.length}
                totalCount={3}
                primaryButtonText="決定"
                industries="true"
                onPrimaryAction={() => {
                  setIndustryModalOpen(false);
                  clearFieldError('industries');
                }}
              >
                <IndustryModal 
                  selectedIndustries={industries} 
                  setSelectedIndustries={setIndustries} 
                />
              </Modal>
            )}
          </>
        )}
      </div>
    </>
  );
}

