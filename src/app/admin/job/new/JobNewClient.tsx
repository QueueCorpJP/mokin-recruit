'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
// import NewJobHeader from '@/app/company/job/NewJobHeader';
import { Modal } from '@/components/ui/mo-dal';
import { CompanyGroup } from '@/app/company/job/types';
import { LocationModal } from '@/app/company/job/LocationModal';
import { JobTypeModal } from '@/app/company/job/JobTypeModal';
import { IndustryModal } from '@/app/company/job/IndustryModal';
import { FormFields } from '@/app/company/job/FormFields';
import { ConfirmView } from '@/app/company/job/ConfirmView';
// Note: Auth is now handled server-side, user info passed as props
import { createJob } from '../pending/actions';

interface JobNewClientProps {
  initialCompanyGroups: CompanyGroup[];
  currentUserId?: string;
}

export default function AdminJobNewClient({
  initialCompanyGroups,
  currentUserId,
}: JobNewClientProps) {
  const router = useRouter();

  // 各項目の状態
  const [group, setGroup] = useState('');
  const [companyGroups, _setCompanyGroups] =
    useState<CompanyGroup[]>(initialCompanyGroups);
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
  const [employmentTypeNote, setEmploymentTypeNote] = useState(
    '契約期間：期間の定めなし\n試用期間：あり（３か月）'
  );
  const [workingHours, setWorkingHours] = useState(
    '9:00～18:00（所定労働時間8時間）\n休憩：60分\nフレックス制：有'
  );
  const [overtime, setOvertime] = useState('あり');
  const [holidays, setHolidays] = useState(
    '完全週休2日制（土・日）、祝日\n年間休日：120日\n有給休暇：初年度10日\nその他休暇：年末年始休暇'
  );
  const [selectionProcess, setSelectionProcess] = useState('');
  const [appealPoints, setAppealPoints] = useState<string[]>([]);
  const [smoke, setSmoke] = useState('屋内禁煙');
  const [smokeNote, setSmokeNote] = useState('');
  const [resumeRequired, setResumeRequired] = useState<string[]>([]);
  const [overtimeMemo, setOvertimeMemo] = useState(
    '月平均20時間程度／固定残業代45時間分を含む'
  );
  const [memo, setMemo] = useState('');
  const [publicationType, setPublicationType] = useState('public');

  // モーダルの状態
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isJobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);

  // モーダルのref
  const jobTypeModalRef = useRef<{ handleConfirm: () => void }>(null);
  const industryModalRef = useRef<{ handleConfirm: () => void }>(null);

  // 確認モードの状態
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  // バリデーション状態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  // 下書き保存用のキー（ユーザー固有）
  const actualCurrentUserId = currentUserId;
  const DRAFT_KEY = `job_draft_data_${actualCurrentUserId || 'anonymous'}`;

  // 初期化時にデフォルトグループを設定
  useEffect(() => {
    if (initialCompanyGroups.length > 0) {
      // 現在のユーザーIDが取得できる場合、そのユーザーをデフォルト選択
      if (actualCurrentUserId) {
        const currentUserGroup = initialCompanyGroups.find(
          (group: any) => group.id === actualCurrentUserId
        );
        if (currentUserGroup) {
          setGroup(currentUserGroup.id);
        }
      }

      // フォールバック：グループが1つの場合は自動選択
      if (initialCompanyGroups.length === 1 && !group) {
        setGroup(initialCompanyGroups[0].id);
      }
    }
  }, [initialCompanyGroups, actualCurrentUserId, group]);

  // 複製データまたは下書きデータを復元
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;

    const loadData = () => {
      try {
        // 複製データがあるかチェック（優先）
        const duplicateData = sessionStorage.getItem('duplicateJobData');
        if (duplicateData) {
          const parsedData = JSON.parse(duplicateData);

          // 複製データを各状態にセット
          if (parsedData.company_group_id)
            setGroup(parsedData.company_group_id);
          if (parsedData.title) setTitle(parsedData.title);

          // 職種の復元（新しい配列形式と古い単一値形式の両方に対応）
          if (parsedData.job_types && Array.isArray(parsedData.job_types)) {
            setJobTypes(parsedData.job_types);
          } else if (parsedData.job_type) {
            setJobTypes([parsedData.job_type]);
          }

          // 業種の復元（新しい配列形式と古い単一値形式の両方に対応）
          if (parsedData.industries && Array.isArray(parsedData.industries)) {
            setIndustries(parsedData.industries);
          } else if (parsedData.industry) {
            setIndustries([parsedData.industry]);
          }

          if (parsedData.job_description)
            setJobDescription(parsedData.job_description);
          if (parsedData.position_summary)
            setPositionSummary(parsedData.position_summary);

          // スキルの復元（配列からテキストに変換対応）
          if (parsedData.required_skills) {
            if (Array.isArray(parsedData.required_skills)) {
              setSkills(parsedData.required_skills.join(', '));
            } else {
              setSkills(parsedData.required_skills);
            }
          }
          if (parsedData.preferred_skills) {
            if (Array.isArray(parsedData.preferred_skills)) {
              setOtherRequirements(parsedData.preferred_skills.join(', '));
            } else {
              setOtherRequirements(parsedData.preferred_skills);
            }
          }

          if (parsedData.salary_min)
            setSalaryMin(parsedData.salary_min.toString());
          if (parsedData.salary_max)
            setSalaryMax(parsedData.salary_max.toString());
          if (parsedData.salary_note) setSalaryNote(parsedData.salary_note);

          // 勤務地の復元（新しい配列形式と古い単一値形式の両方に対応）
          if (
            parsedData.work_locations &&
            Array.isArray(parsedData.work_locations)
          ) {
            setLocations(parsedData.work_locations);
          } else if (parsedData.work_location) {
            setLocations([parsedData.work_location]);
          }

          if (parsedData.location_note)
            setLocationNote(parsedData.location_note);
          if (parsedData.employment_type)
            setEmploymentType(parsedData.employment_type);
          if (parsedData.employment_type_note)
            setEmploymentTypeNote(parsedData.employment_type_note);
          if (parsedData.working_hours)
            setWorkingHours(parsedData.working_hours);
          if (parsedData.overtime_info)
            setOvertimeMemo(parsedData.overtime_info);
          if (parsedData.holidays) setHolidays(parsedData.holidays);
          if (parsedData.selection_process)
            setSelectionProcess(parsedData.selection_process);
          if (parsedData.appeal_points)
            setAppealPoints(parsedData.appeal_points);
          if (parsedData.smoking_policy) setSmoke(parsedData.smoking_policy);
          if (parsedData.smoking_policy_note)
            setSmokeNote(parsedData.smoking_policy_note);
          if (parsedData.required_documents)
            setResumeRequired(parsedData.required_documents);
          if (parsedData.internal_memo) setMemo(parsedData.internal_memo);
          if (parsedData.publication_type)
            setPublicationType(parsedData.publication_type);

          // 複製データ使用後は削除
          sessionStorage.removeItem('duplicateJobData');
          console.log('複製データを復元しました');
          return;
        }

        // 複製データがなければ下書きデータをチェック
        // 注意：ローカル下書き機能は下書き保存APIに移行済みのため、
        // 既存の下書きデータがあれば復元後削除
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);

          // 各状態を復元
          if (draftData.group) setGroup(draftData.group);
          if (draftData.title) setTitle(draftData.title);
          if (draftData.jobTypes) setJobTypes(draftData.jobTypes);
          if (draftData.industries) setIndustries(draftData.industries);
          if (draftData.jobDescription)
            setJobDescription(draftData.jobDescription);
          if (draftData.positionSummary)
            setPositionSummary(draftData.positionSummary);
          if (draftData.skills) setSkills(draftData.skills);
          if (draftData.otherRequirements)
            setOtherRequirements(draftData.otherRequirements);
          if (draftData.salaryMin) setSalaryMin(draftData.salaryMin);
          if (draftData.salaryMax) setSalaryMax(draftData.salaryMax);
          if (draftData.salaryNote) setSalaryNote(draftData.salaryNote);
          if (draftData.locations) setLocations(draftData.locations);
          if (draftData.locationNote) setLocationNote(draftData.locationNote);
          if (draftData.employmentType)
            setEmploymentType(draftData.employmentType);
          if (draftData.employmentTypeNote)
            setEmploymentTypeNote(draftData.employmentTypeNote);
          if (draftData.workingHours) setWorkingHours(draftData.workingHours);
          if (draftData.overtime) setOvertime(draftData.overtime);
          if (draftData.holidays) setHolidays(draftData.holidays);
          if (draftData.selectionProcess)
            setSelectionProcess(draftData.selectionProcess);
          if (draftData.appealPoints) setAppealPoints(draftData.appealPoints);
          if (draftData.smoke) setSmoke(draftData.smoke);
          if (draftData.smokeNote) setSmokeNote(draftData.smokeNote);
          if (draftData.resumeRequired)
            setResumeRequired(draftData.resumeRequired);
          if (draftData.overtimeMemo) setOvertimeMemo(draftData.overtimeMemo);
          if (draftData.memo) setMemo(draftData.memo);
          if (draftData.publicationType)
            setPublicationType(draftData.publicationType);

          console.log('下書きデータを復元しました（旧形式）');
          // 旧形式の下書きデータを削除
          localStorage.removeItem(DRAFT_KEY);
        }
      } catch (error) {
        console.error('データの復元に失敗しました:', error);
        // エラー時はlocalStorageとsessionStorageの両方をクリア
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch (e) {
          console.error('localStorage清理失敗:', e);
        }
        sessionStorage.removeItem('duplicateJobData');
      }
    };

    loadData();
  }, [DRAFT_KEY]);

  // 年収のリアルタイムバリデーション
  useEffect(() => {
    validateSalary(salaryMin, salaryMax);
  }, [salaryMin, salaryMax]);

  // 必須項目が全て入力されているかチェックする関数
  const isFormValid = useCallback(() => {
    // グループ選択
    if (!group) return false;

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
  }, [
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
    locations,
    workingHours,
    holidays,
    selectionProcess,
    appealPoints,
  ]);

  // バリデーション関数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!group) newErrors.group = 'グループを選択してください。';
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

  // 下書き保存関数（Supabaseに保存・バリデーションなし）
  const saveDraft = async () => {
    try {
      // 画像をBase64エンコード（通常の投稿処理と同じ）
      let encodedImages: any[] = [];
      if (images.length > 0) {
        try {
          encodedImages = await encodeImagesToBase64(images);
        } catch (error) {
          console.error('Image encoding failed for draft:', error);
          alert('画像の処理に失敗しました');
          return;
        }
      }

      // 通常の投稿処理と全く同じデータ構造
      const data = {
        company_group_id: group,
        title: title || '未設定',
        job_description: jobDescription || '未設定',
        position_summary: positionSummary || null,
        required_skills: skills || '',
        preferred_skills: otherRequirements || '',
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        salary_note: salaryNote || null,
        employment_type: employmentType || '未設定',
        employment_type_note: employmentTypeNote || null,
        work_locations: locations || [],
        location_note: locationNote || null,
        working_hours: workingHours || null,
        overtime: overtime || null,
        overtime_info: overtimeMemo || null,
        holidays: holidays || null,
        remote_work_available: false,
        job_types: jobTypes || [],
        industries: industries || [],
        selection_process: selectionProcess || null,
        appeal_points: appealPoints || [],
        smoking_policy: smoke || null,
        smoking_policy_note: smokeNote || null,
        required_documents: resumeRequired || [],
        internal_memo: memo || null,
        publication_type: publicationType || 'public',
        images: encodedImages,
        status: 'DRAFT', // 下書き保存時は必ずDRAFTステータス
        application_deadline: null,
        published_at: null,
      };

      const result = await createJob(data);

      if (result.success) {
        alert('下書きを保存しました');
        // 求人一覧ページにリダイレクト（管理画面の場合）
        router.push('/admin/job');
      } else {
        console.error('Draft save API Error:', result);
        alert(`下書き保存エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('Draft save Request Error:', error);
      alert('下書き保存で通信エラーが発生しました');
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
  const handleBack = useCallback(() => {
    setIsConfirmMode(false);
    setShowErrors(false);
  }, []);

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

  // 送信処理
  const handleSubmit = useCallback(async () => {
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

    const data = {
      company_group_id: group,
      title: title || '未設定',
      job_description: jobDescription || '未設定',
      position_summary: positionSummary || null,
      required_skills: skills || '',
      preferred_skills: otherRequirements || '',
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      salary_note: salaryNote || null,
      employment_type: employmentType || '未設定',
      employment_type_note: employmentTypeNote || null,
      work_locations: locations || [],
      location_note: locationNote || null,
      working_hours: workingHours || null,
      overtime: overtime || null,
      overtime_info: overtimeMemo || null,
      holidays: holidays || null,
      remote_work_available: false,
      job_types: jobTypes || [],
      industries: industries || [],
      selection_process: selectionProcess || null,
      appeal_points: appealPoints || [],
      smoking_policy: smoke || null,
      smoking_policy_note: smokeNote || null,
      required_documents: resumeRequired || [],
      internal_memo: memo || null,
      publication_type: publicationType || 'public',
      images: encodedImages,
      status: 'PENDING_APPROVAL',
      application_deadline: null,
      published_at: null,
    };

    try {
      const result = await createJob(data);

      if (result && result.success) {
        router.push('/admin/job/new/complete');
      } else {
        console.error('API Error:', result);
        alert(`エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('Request Error:', error);
      alert('通信エラーが発生しました');
    }
  }, [
    images,
    group,
    title,
    jobDescription,
    positionSummary,
    skills,
    otherRequirements,
    salaryMin,
    salaryMax,
    salaryNote,
    employmentType,
    employmentTypeNote,
    locations,
    locationNote,
    workingHours,
    overtime,
    overtimeMemo,
    holidays,
    jobTypes,
    industries,
    selectionProcess,
    appealPoints,
    smoke,
    smokeNote,
    resumeRequired,
    memo,
    publicationType,
    router,
  ]);

  // AdminPageTitleからのイベントリスナー
  useEffect(() => {
    console.log('JobNewClient: Setting up event listeners');
    const handleJobNewBack = () => {
      console.log(
        'JobNewClient: Received job-new-back event, isConfirmMode:',
        isConfirmMode
      );
      if (isConfirmMode) {
        console.log('JobNewClient: Calling handleBack()');
        handleBack();
      } else {
        console.log(
          'JobNewClient: Not in confirm mode, switching to confirm mode'
        );
        // 確認モードでない場合は確認モードに切り替える
        if (isFormValid()) {
          setIsConfirmMode(true);
        } else {
          setShowErrors(true);
          console.log('JobNewClient: Form validation failed');
        }
      }
    };

    const handleJobNewCreate = () => {
      console.log('JobNewClient: Received job-new-create event');
      handleSubmit();
    };

    window.addEventListener('job-new-back', handleJobNewBack);
    window.addEventListener('job-new-create', handleJobNewCreate);

    return () => {
      window.removeEventListener('job-new-back', handleJobNewBack);
      window.removeEventListener('job-new-create', handleJobNewCreate);
    };
  }, [isConfirmMode, handleBack, handleSubmit, isFormValid]);

  // 確認モード状態をヘッダーに通知
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('job-new-mode-change', { detail: { isConfirmMode } })
    );
  }, [isConfirmMode]);

  return (
    <>
      {/* <NewJobHeader /> */}
      <div className='flex justify-start'>
        <div className='mr-0'>
          {/* 選考メモテーブル - 独立して中央配置（確認ページでは非表示） */}
          {!isConfirmMode && (
            <div className='mb-6 flex justify-center w-full'>
              <table className='border-collapse border border-gray-400'>
                <tbody>
                  <tr>
                    <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]"></td>
                    <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                      スカウト送信数
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                      開封数
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                      返信数(返信率)
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                      応募数(応募率)
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                      過去7日合計
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0 (0%)
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0 (0%)
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                      過去30日合計
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0 (0%)
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0 (0%)
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                      累計
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0 (0%)
                    </td>
                    <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                      0 (0%)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 選考メモセクション */}
          <div className='w-full mb-[37px]'>
            <div className='flex items-start gap-8'>
              <div className='w-[200px] flex-shrink-0'>
                <label className='block text-[16px] font-bold text-gray-900'>
                  選考メモ
                </label>
              </div>
              <div className='flex-1'>
                {isConfirmMode ? (
                  <div className='w-full px-4 py-3 min-h-[100px] text-gray-900 whitespace-pre-wrap'>
                    {memo || 'メモが入力されていません'}
                  </div>
                ) : (
                  <div className='border p-1'>
                    <textarea
                      value={memo}
                      onChange={e => setMemo(e.target.value)}
                      rows={4}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      placeholder='選考に関するメモを入力してください'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='w-full flex flex-col items-start justify-start rounded-[10px]'>
            {/* 求人詳細のヘッダー */}
            <div className='w-full mb-6'>
              <div className='h-0.5 bg-gray-300 mb-4'></div>
              <h2 className='text-2xl font-bold text-gray-900'>求人詳細</h2>
            </div>

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
                overtimeMemo={overtimeMemo}
                memo={memo}
                publicationType={publicationType}
                setPublicationType={setPublicationType}
              />
            ) : (
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
              />
            )}

            {/* ボタンエリア */}
            <div className='flex flex-col items-center gap-4 mt-[40px] w-full'>
              <div className='flex justify-center items-center gap-4 w-full'>
                {isConfirmMode ? (
                  <>
                    <Button
                      type='button'
                      variant='green-outline'
                      size='lg'
                      className="rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-white text-[#198D76] font-['Noto_Sans_JP']"
                      onClick={handleBack}
                    >
                      戻る
                    </Button>
                    <button
                      type='button'
                      className='rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white transition-all duration-200 ease-in-out hover:from-[#12614E] hover:to-[#1A8946]'
                      onClick={handleSubmit}
                    >
                      保存する
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* モーダル */}
        {!isConfirmMode && (
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
        )}
      </div>
    </>
  );
}
