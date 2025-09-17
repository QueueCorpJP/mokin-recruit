'use client';

import React, { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import JobEditHeader from './JobEditHeader';
import { Modal } from '@/components/ui/mo-dal';
import { CompanyGroup } from '@/app/company/job/types';
import { LocationModal } from '@/app/company/job/LocationModal';
import { JobTypeModal } from '@/app/company/job/JobTypeModal';
import { IndustryModal } from '@/app/company/job/IndustryModal';
import { FormFields } from '@/app/company/job/FormFields';
import { updateJob } from '../../actions';
import AttentionBanner from '@/components/ui/AttentionBanner';

interface JobData {
  id: string;
  title: string;
  jobDescription: string;
  positionSummary: string;
  requiredSkills: string;
  preferredSkills: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNote: string;
  employmentType: string;
  workLocation: string[];
  locationNote: string;
  employmentTypeNote: string;
  workingHours: string;
  overtimeInfo: string;
  holidays: string;
  remoteWorkAvailable: boolean;
  jobType: string[];
  industry: string[];
  selectionProcess: string;
  appealPoints: string[];
  smokingPolicy: string;
  smokingPolicyNote: string;
  requiredDocuments: string[];
  internalMemo: string;
  publicationType: string;
  imageUrls: string[];
  groupName: string;
  groupId: string;
  status: string;
  applicationDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface JobEditClientProps {
  initialCompanyGroups: CompanyGroup[];
  jobData: JobData;
  jobId: string;
  currentUserId?: string;
}

export default function JobEditClient({
  initialCompanyGroups,
  jobData,
  jobId,
  currentUserId,
}: JobEditClientProps) {
  const router = useRouter();

  // Encryption key for demonstration; in production, securely manage this!
  const ENCRYPTION_KEY = 'YOUR_SECURE_KEY_HERE';

  // AES encryption for sensitive data
  function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }

  // 確認画面の表示制御

  // 各項目の状態（jobDataから初期値を設定）
  const [group, setGroup] = useState(jobData.groupId || '');
  const [companyGroups, setCompanyGroups] =
    useState<CompanyGroup[]>(initialCompanyGroups);
  const [title, setTitle] = useState(jobData.title || '');
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    (jobData.imageUrls || []).filter(url => url && url.trim() !== '')
  );

  const handleRemoveExistingImage = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };
  const [jobTypes, setJobTypes] = useState<string[]>(jobData.jobType || []);
  const [industries, setIndustries] = useState<string[]>(
    jobData.industry || []
  );
  const [jobDescription, setJobDescription] = useState(
    jobData.jobDescription || ''
  );
  const [positionSummary, setPositionSummary] = useState(
    jobData.positionSummary || ''
  );
  const [skills, setSkills] = useState(jobData.requiredSkills || '');
  const [otherRequirements, setOtherRequirements] = useState(
    jobData.preferredSkills || ''
  );
  const [salaryMin, setSalaryMin] = useState(
    jobData.salaryMin ? jobData.salaryMin.toString() : ''
  );
  const [salaryMax, setSalaryMax] = useState(
    jobData.salaryMax ? jobData.salaryMax.toString() : ''
  );
  const [salaryNote, setSalaryNote] = useState(jobData.salaryNote || '');
  const [locations, setLocations] = useState<string[]>(
    jobData.workLocation || []
  );
  const [locationNote, setLocationNote] = useState(jobData.locationNote || '');
  const [employmentType, setEmploymentType] = useState(
    jobData.employmentType || '正社員'
  );
  const [employmentTypeNote, setEmploymentTypeNote] = useState(
    jobData.employmentTypeNote || ''
  );
  const [workingHours, setWorkingHours] = useState(jobData.workingHours || '');
  const [overtime, setOvertime] = useState('あり'); // デフォルト値
  const [holidays, setHolidays] = useState(jobData.holidays || '');
  const [selectionProcess, setSelectionProcess] = useState(
    jobData.selectionProcess || ''
  );
  const [appealPoints, setAppealPoints] = useState<string[]>(
    jobData.appealPoints || []
  );
  const [smoke, setSmoke] = useState(jobData.smokingPolicy || '屋内禁煙');
  const [smokeNote, setSmokeNote] = useState(jobData.smokingPolicyNote || '');
  const [resumeRequired, setResumeRequired] = useState<string[]>(
    jobData.requiredDocuments || []
  );
  const [overtimeMemo, setOvertimeMemo] = useState(jobData.overtimeInfo || '');
  const [memo, setMemo] = useState(jobData.internalMemo || '');
  const [publicationType, setPublicationType] = useState(
    jobData.publicationType || 'public'
  );

  // データ復元のためのuseEffect
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined' || !jobId) {
      return;
    }

    // sessionStorageからデータを復元
    try {
      const savedEditData = sessionStorage.getItem(`editData-${jobId}`);
      if (savedEditData) {
        const editData = JSON.parse(savedEditData);

        // 保存されたデータで状態を更新
        setTitle(editData.title || jobData.title || '');
        setJobDescription(
          editData.jobDescription || jobData.jobDescription || ''
        );
        setPositionSummary(
          editData.positionSummary || jobData.positionSummary || ''
        );
        setSkills(editData.requiredSkills || jobData.requiredSkills || '');
        setOtherRequirements(
          editData.preferredSkills || jobData.preferredSkills || ''
        );
        setSalaryMin(
          editData.salaryMin?.toString() ||
            (jobData.salaryMin ? jobData.salaryMin.toString() : '')
        );
        setSalaryMax(
          editData.salaryMax?.toString() ||
            (jobData.salaryMax ? jobData.salaryMax.toString() : '')
        );
        setSalaryNote(editData.salaryNote || jobData.salaryNote || '');
        setEmploymentType(
          editData.employmentType || jobData.employmentType || '正社員'
        );
        setLocations(editData.work_locations || jobData.workLocation || []);
        setLocationNote(editData.location_note || jobData.locationNote || '');
        setEmploymentTypeNote(
          editData.employment_type_note || jobData.employmentTypeNote || ''
        );
        setWorkingHours(editData.working_hours || jobData.workingHours || '');
        setOvertimeMemo(editData.overtime_info || jobData.overtimeInfo || '');
        setHolidays(editData.holidays || jobData.holidays || '');
        setJobTypes(editData.job_types || jobData.jobType || []);
        setIndustries(editData.industries || jobData.industry || []);
        setSelectionProcess(
          editData.selection_process || jobData.selectionProcess || ''
        );
        setAppealPoints(editData.appeal_points || jobData.appealPoints || []);
        setSmoke(
          editData.smoking_policy || jobData.smokingPolicy || '屋内禁煙'
        );
        setSmokeNote(
          editData.smoking_policy_note || jobData.smokingPolicyNote || ''
        );
        setResumeRequired(
          editData.required_documents || jobData.requiredDocuments || []
        );
        setMemo(editData.internal_memo || jobData.internalMemo || '');
        setPublicationType(
          editData.publication_type || jobData.publicationType || 'public'
        );
        setGroup(editData.groupId || jobData.groupId || '');

        // 既存画像を復元（編集データに保存されている場合はそれを使用、なければ元のデータを使用）
        if (editData._existingImages !== undefined) {
          setExistingImages(editData._existingImages);
        }

        console.log('Edit data restored from sessionStorage');
      }
    } catch (error) {
      console.error('Failed to restore edit data from sessionStorage:', error);
    }
  }, [jobId, jobData]);

  // モーダルの状態
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isJobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);

  // モーダル用のref
  const jobTypeModalRef = useRef<{ handleConfirm: () => void }>(null);
  const industryModalRef = useRef<{ handleConfirm: () => void }>(null);

  // バリデーション状態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  // 年収のリアルタイムバリデーション
  useEffect(() => {
    validateSalary(salaryMin, salaryMax);
  }, [salaryMin, salaryMax]);

  // 必須項目が全て入力されているかチェックする関数
  const isFormValid = () => {
    // 編集モードではグループはチェックしない（変更できないため）

    // 求人タイトル
    if (!title.trim()) return false;

    // 職種（1つ以上）
    if (jobTypes.length === 0) return false;

    // 業種（1つ以上）
    if (industries.length === 0) return false;

    // 業務内容
    if (!jobDescription.trim()) return false;

    // 当ポジションの魅力
    if (!positionSummary.trim()) return false;

    // スキル・経験
    if (!skills.trim()) return false;

    // その他・求める人物像
    if (!otherRequirements.trim()) return false;

    // 想定年収
    if (!salaryMin || !salaryMax) return false;
    const minValue = parseInt(salaryMin);
    const maxValue = parseInt(salaryMax);
    if (minValue > maxValue) return false;

    // 勤務地（1つ以上）
    if (locations.length === 0) return false;

    // 就業時間
    if (!workingHours.trim()) return false;

    // 休日・休暇
    if (!holidays.trim()) return false;

    // 選考情報
    if (!selectionProcess.trim()) return false;

    // アピールポイント（1つ以上）
    if (!appealPoints || appealPoints.length === 0) return false;

    return true;
  };

  // バリデーション関数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 編集モードではグループは必須チェックしない（変更できないため）
    if (!title.trim()) newErrors.title = '求人タイトルを入力してください。';
    if (!jobDescription.trim())
      newErrors.jobDescription = '業務内容を入力してください。';
    if (!positionSummary.trim())
      newErrors.positionSummary = '当ポジションの魅力を入力してください。';
    if (!skills.trim())
      newErrors.skills = '必要または歓迎するスキル・経験を入力してください。';
    if (!otherRequirements.trim())
      newErrors.otherRequirements =
        '求める人物像や価値観などを入力してください。';
    if (locations.length === 0)
      newErrors.locations = '勤務地を1つ以上選択してください。';
    if (jobTypes.length === 0)
      newErrors.jobTypes = '職種を1つ以上選択してください。';
    if (industries.length === 0)
      newErrors.industries = '業種を1つ以上選択してください。';
    // 想定年収
    if (!salaryMin || !salaryMax) {
      newErrors.salary = '想定年収を選択してください。';
    } else {
      const minValue = parseInt(salaryMin);
      const maxValue = parseInt(salaryMax);
      if (minValue > maxValue) {
        newErrors.salary = '最大年収は最小年収よりも高く設定してください';
      }
    }
    if (!workingHours.trim())
      newErrors.workingHours = '就業時間を入力してください。';
    if (!holidays.trim())
      newErrors.holidays = '休日・休暇について入力してください。';
    if (!selectionProcess.trim())
      newErrors.selectionProcess = '選考情報を入力してください。';
    if (!appealPoints || appealPoints.length === 0)
      newErrors.appealPoints = 'アピールポイントを1つ以上選択してください。';

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
        setErrors(prev => ({
          ...prev,
          salary: '最大年収は最小年収よりも高く設定してください',
        }));
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

  // 画像をBase64エンコードする関数
  const encodeImagesToBase64 = async (files: File[]): Promise<any[]> => {
    const encodedImages: any[] = [];

    for (const file of files) {
      await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          const result = e.target?.result as string;
          // data:image/jpeg;base64, の部分を除去してBase64データのみ抽出
          const base64Data = result.split(',')[1];

          encodedImages.push({
            data: base64Data,
            contentType: file.type,
            fileName: file.name,
            size: file.size,
          });
          resolve(void 0);
        };
        reader.readAsDataURL(file);
      });
    }

    return encodedImages;
  };

  // 確認処理（バリデーション後にconfirmページに遷移）
  const handleConfirm = async () => {
    if (!validateForm()) {
      setShowErrors(true);
      return;
    }

    // 画像をBase64エンコード
    let encodedImages: any[] = [];
    if (images.length > 0) {
      try {
        encodedImages = await encodeImagesToBase64(images);
      } catch (error) {
        console.error('Image encoding failed:', error);
        alert('画像の処理に失敗しました');
        return;
      }
    }

    // 既存の画像URLと新しい画像を組み合わせる
    const allImages = [...existingImages, ...encodedImages];

    // confirmページに送信するデータ
    const editData = {
      title: title || '未設定',
      jobDescription: jobDescription || '未設定',
      positionSummary: positionSummary || '',
      requiredSkills: skills || '',
      preferredSkills: otherRequirements || '',
      salaryMin: encrypt(salaryMin),
      salaryMax: encrypt(salaryMax),
      salaryNote: encrypt(salaryNote || ''),
      employmentType: employmentType || '未設定',
      work_locations: locations || [],
      location_note: locationNote || '',
      employment_type_note: employmentTypeNote || '',
      working_hours: workingHours || '',
      overtime_info: overtimeMemo || '',
      holidays: holidays || '',
      remote_work_available: false,
      job_types: jobTypes || [],
      industries: industries || [],
      selection_process: selectionProcess || '',
      appeal_points: appealPoints || [],
      smoking_policy: smoke || '',
      smoking_policy_note: smokeNote || '',
      required_documents: resumeRequired || [],
      internal_memo: memo || '',
      publication_type: publicationType || 'public',
      images: allImages,
      _existingImages: existingImages, // UI用の一時データ（データベースに送信されない）
      groupId: group,
      applicationDeadline: '',
    };

    // 確認画面にリダイレクト（データをsessionStorageに保存）
    try {
      sessionStorage.setItem(`editData-${jobId}`, JSON.stringify(editData));
      router.push(`/company/job/${jobId}/edit/confirm`);
    } catch (error) {
      console.error('Failed to save edit data:', error);
      alert('データの保存に失敗しました');
    }
  };

  return (
    <>
      <JobEditHeader jobId={jobId} />
      <div className='bg-[#f9f9f9] px-20 pt-10 pb-20'>
        <div className='w-full max-w-[1280px] mx-auto mb-10'>
          <AttentionBanner
            title='求人内容の編集についてのご注意'
            content='この求人は現在公開中です。すでに応募・スカウト済みの候補者がいる場合、内容変更により誤解やトラブルが発生する可能性があります。
変更内容は慎重にご確認の上、必要に応じて応募者へのご連絡をお願いいたします。'
          />
        </div>
        <div className='w-full w-full max-w-[1280px] mx-auto bg-white rounded-[10px] p-10'>
          <FormFields
            group={group}
            setGroup={(value: string) => {
              setGroup(value);
              clearFieldError('group');
            }}
            companyGroups={companyGroups}
            title={title}
            setTitle={(value: string) => {
              setTitle(value);
              clearFieldError('title');
            }}
            images={images}
            setImages={(images: File[]) => {
              setImages(images);
              clearFieldError('images');
            }}
            existingImages={existingImages}
            onRemoveExistingImage={handleRemoveExistingImage}
            jobTypes={jobTypes}
            setJobTypes={(types: string[]) => {
              setJobTypes(types);
              clearFieldError('jobTypes');
            }}
            industries={industries}
            setIndustries={(industries: string[]) => {
              setIndustries(industries);
              clearFieldError('industries');
            }}
            jobDescription={jobDescription}
            setJobDescription={(value: string) => {
              setJobDescription(value);
              clearFieldError('jobDescription');
            }}
            positionSummary={positionSummary}
            setPositionSummary={(value: string) => {
              setPositionSummary(value);
              clearFieldError('positionSummary');
            }}
            skills={skills}
            setSkills={(value: string) => {
              setSkills(value);
              clearFieldError('skills');
            }}
            otherRequirements={otherRequirements}
            setOtherRequirements={(value: string) => {
              setOtherRequirements(value);
              clearFieldError('otherRequirements');
            }}
            salaryMin={salaryMin}
            setSalaryMin={setSalaryMin}
            salaryMax={salaryMax}
            setSalaryMax={setSalaryMax}
            salaryNote={salaryNote}
            setSalaryNote={setSalaryNote}
            locations={locations}
            setLocations={(locations: string[]) => {
              setLocations(locations);
              clearFieldError('locations');
            }}
            locationNote={locationNote}
            setLocationNote={setLocationNote}
            selectionProcess={selectionProcess}
            setSelectionProcess={(value: string) => {
              setSelectionProcess(value);
              clearFieldError('selectionProcess');
            }}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            employmentTypeNote={employmentTypeNote}
            setEmploymentTypeNote={setEmploymentTypeNote}
            workingHours={workingHours}
            setWorkingHours={setWorkingHours}
            overtime={overtime}
            setOvertime={setOvertime}
            holidays={holidays}
            setHolidays={setHolidays}
            appealPoints={appealPoints}
            setAppealPoints={(points: string[]) => {
              setAppealPoints(points);
              clearFieldError('appealPoints');
            }}
            smoke={smoke}
            setSmoke={setSmoke}
            smokeNote={smokeNote}
            setSmokeNote={setSmokeNote}
            resumeRequired={resumeRequired}
            setResumeRequired={setResumeRequired}
            overtimeMemo={overtimeMemo}
            setOvertimeMemo={setOvertimeMemo}
            memo={memo}
            setMemo={setMemo}
            setLocationModalOpen={setLocationModalOpen}
            setJobTypeModalOpen={setJobTypeModalOpen}
            setIndustryModalOpen={setIndustryModalOpen}
            errors={errors}
            showErrors={showErrors}
            isEditMode={true}
          />

          {/* ボタンエリア */}
        </div>
        <div className='flex flex-col items-center gap-4 mt-[40px] w-full'>
          <div className='flex justify-center items-center gap-4 w-full'>
            <button
              type='button'
              disabled={showErrors && !isFormValid()}
              className={`rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 transition-all duration-200 ease-in-out ${
                !showErrors || isFormValid()
                  ? 'bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white hover:from-[#12614E] hover:to-[#1A8946] cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleConfirm}
            >
              確認する
            </button>
          </div>
        </div>

        {/* モーダル */}
        <>
          {isLocationModalOpen && (
            <Modal
              title='勤務地を選択'
              isOpen={isLocationModalOpen}
              onClose={() => setLocationModalOpen(false)}
              selectedCount={locations.length}
              totalCount={47}
              primaryButtonText='決定'
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
              title='職種を選択'
              isOpen={isJobTypeModalOpen}
              onClose={() => setJobTypeModalOpen(false)}
              selectedCount={jobTypes.length}
              totalCount={3}
              primaryButtonText='決定'
              onPrimaryAction={() => {
                jobTypeModalRef.current?.handleConfirm();
                setJobTypeModalOpen(false);
                clearFieldError('jobTypes');
              }}
            >
              <JobTypeModal
                ref={jobTypeModalRef}
                selectedJobTypes={jobTypes}
                setSelectedJobTypes={setJobTypes}
                onClose={() => setJobTypeModalOpen(false)}
              />
            </Modal>
          )}
          {isIndustryModalOpen && (
            <Modal
              title='業種を選択'
              isOpen={isIndustryModalOpen}
              onClose={() => setIndustryModalOpen(false)}
              selectedCount={industries.length}
              totalCount={3}
              primaryButtonText='決定'
              industries='true'
              onPrimaryAction={() => {
                industryModalRef.current?.handleConfirm();
                setIndustryModalOpen(false);
                clearFieldError('industries');
              }}
            >
              <IndustryModal
                ref={industryModalRef}
                selectedIndustries={industries}
                onIndustriesChange={setIndustries}
                onClose={() => setIndustryModalOpen(false)}
              />
            </Modal>
          )}
        </>
      </div>
    </>
  );
}
