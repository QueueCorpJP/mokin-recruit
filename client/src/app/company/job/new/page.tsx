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
import {
  getCurrentUserId,
  getAuthInfo,
  getAuthHeaders,
} from '@/lib/utils/api-client';

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
  const [employmentTypeNote, setEmploymentTypeNote] = useState('契約期間：期間の定めなし\n試用期間：あり（３か月）');
  const [workingHours, setWorkingHours] = useState('9:00～18:00（所定労働時間8時間）\n休憩：60分\nフレックス制：有');
  const [overtime, setOvertime] = useState('あり');
  const [holidays, setHolidays] = useState('完全週休2日制（土・日）、祝日\n年間休日：120日\n有給休暇：初年度10日\nその他休暇：年末年始休暇');
  const [selectionProcess, setSelectionProcess] = useState('');
  const [appealPoints, setAppealPoints] = useState<string[]>([]);
  const [smoke, setSmoke] = useState('屋内禁煙');
  const [smokeNote, setSmokeNote] = useState('');
  const [resumeRequired, setResumeRequired] = useState<string[]>([]);
  const [memo, setMemo] = useState('月平均20時間程度／固定残業代45時間分を含む');
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

  // 下書き保存用のキー（ユーザー固有）
  const currentUserId = getCurrentUserId();
  const DRAFT_KEY = `job_draft_data_${currentUserId || 'anonymous'}`;

  // 企業グループ情報を取得
  useEffect(() => {
    const fetchCompanyGroups = async () => {
      try {
        const authHeaders = getAuthHeaders();
        const currentUserId = getCurrentUserId();

        console.log('Auth headers prepared:', !!authHeaders.Authorization);
        if (!authHeaders.Authorization) {
          console.error('No authentication token found');
          return;
        }

        const response = await fetch('/api/company/groups', {
          headers: authHeaders,
        });

        console.log('Groups API response status:', response.status);
        const result = await response.json();
        console.log('Groups API result:', result);

        if (result.success) {
          setCompanyGroups(result.data);

          // 現在のユーザーIDが取得できる場合、そのユーザーをデフォルト選択
          if (currentUserId) {
            const currentUserGroup = result.data.find(
              (group: any) => group.id === currentUserId
            );
            if (currentUserGroup) {
              setGroup(currentUserGroup.id);
              console.log(
                '✅ Default group set to current user:',
                currentUserGroup.group_name
              );
            }
          }

          // フォールバック：グループが1つの場合は自動選択
          if (result.data.length === 1 && !group) {
            setGroup(result.data[0].id);
          }
        } else {
          console.error('Failed to fetch company groups:', result.error);
          alert(`グループ取得エラー: ${result.error}`);
        }
      } catch (error) {
        console.error('Error fetching company groups:', error);
        alert(
          `通信エラー: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    };

    fetchCompanyGroups();
  }, []);

  // 複製データまたは下書きデータを復元
  useEffect(() => {
    const loadData = () => {
      try {
        // 複製データがあるかチェック（優先）
        const duplicateData = sessionStorage.getItem('duplicateJobData');
        if (duplicateData) {
          const parsedData = JSON.parse(duplicateData);
          
          // 複製データを各状態にセット
          if (parsedData.company_group_id) setGroup(parsedData.company_group_id);
          if (parsedData.title) setTitle(parsedData.title);
          if (parsedData.job_types) setJobTypes(parsedData.job_types);
          if (parsedData.industries) setIndustries(parsedData.industries);
          if (parsedData.job_description) setJobDescription(parsedData.job_description);
          if (parsedData.position_summary) setPositionSummary(parsedData.position_summary);
          if (parsedData.required_skills) setSkills(parsedData.required_skills);
          if (parsedData.preferred_skills) setOtherRequirements(parsedData.preferred_skills);
          if (parsedData.salary_min) setSalaryMin(parsedData.salary_min.toString());
          if (parsedData.salary_max) setSalaryMax(parsedData.salary_max.toString());
          if (parsedData.salary_note) setSalaryNote(parsedData.salary_note);
          if (parsedData.work_locations) setLocations(parsedData.work_locations);
          if (parsedData.location_note) setLocationNote(parsedData.location_note);
          if (parsedData.employment_type) setEmploymentType(parsedData.employment_type);
          if (parsedData.employment_type_note) setEmploymentTypeNote(parsedData.employment_type_note);
          if (parsedData.working_hours) setWorkingHours(parsedData.working_hours);
          if (parsedData.overtime_info) setOvertime(parsedData.overtime_info);
          if (parsedData.holidays) setHolidays(parsedData.holidays);
          if (parsedData.selection_process) setSelectionProcess(parsedData.selection_process);
          if (parsedData.appeal_points) setAppealPoints(parsedData.appeal_points);
          if (parsedData.smoking_policy) setSmoke(parsedData.smoking_policy);
          if (parsedData.smoking_policy_note) setSmokeNote(parsedData.smoking_policy_note);
          if (parsedData.required_documents) setResumeRequired(parsedData.required_documents);
          if (parsedData.internal_memo) setMemo(parsedData.internal_memo);
          if (parsedData.publication_type) setPublicationType(parsedData.publication_type);

          // 複製データ使用後は削除
          sessionStorage.removeItem('duplicateJobData');
          console.log('複製データを復元しました');
          return;
        }

        // 複製データがなければ下書きデータをチェック
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
          if (draftData.memo) setMemo(draftData.memo);
          if (draftData.publicationType)
            setPublicationType(draftData.publicationType);

          console.log('下書きデータを復元しました');
        }
      } catch (error) {
        console.error('データの復元に失敗しました:', error);
        localStorage.removeItem(DRAFT_KEY);
        sessionStorage.removeItem('duplicateJobData');
      }
    };

    loadData();
  }, []);

  // 年収のリアルタイムバリデーション
  useEffect(() => {
    validateSalary(salaryMin, salaryMax);
  }, [salaryMin, salaryMax]);

  // バリデーション関数
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!group) newErrors.group = 'グループを選択してください。';
    if (!title.trim()) newErrors.title = '求人タイトルを入力してください。';
    // imagesは任意項目に変更
    // if (images.length === 0) newErrors.images = '画像を選択してください';
    if (!jobDescription.trim())
      newErrors.jobDescription = '業務内容を入力してください。';
    if (!positionSummary.trim())
      newErrors.positionSummary = '当ポジションの魅力を入力してください。';
    if (!skills.trim()) newErrors.skills = '必要または歓迎するスキル・経験を入力してください。';
    if (!otherRequirements.trim())
      newErrors.otherRequirements = '求める人物像や価値観などを入力してください。';
    if (!employmentType || employmentType === '')
      newErrors.employmentType = '雇用形態を選択してください';
    if (locations.length === 0)
      newErrors.locations = '勤務地を1つ以上選択してください。';
    if (jobTypes.length === 0) newErrors.jobTypes = '職種を1つ以上選択してください。';
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
    // salaryNoteは任意項目に変更
    // if (!salaryNote.trim()) newErrors.salaryNote = '年収補足を入力してください';
    if (!workingHours.trim())
      newErrors.workingHours = '就業時間を入力してください。';
    if (!overtime || overtime === '')
      newErrors.overtime = '所定外労働の有無を選択してください';
    if (!holidays.trim()) newErrors.holidays = '休日・休暇について入力してください。';
    if (!selectionProcess.trim())
      newErrors.selectionProcess = '選考情報を入力してください。';
    if (!appealPoints || appealPoints.length === 0)
      newErrors.appealPoints = 'アピールポイントを1つ以上選択してください。';
    if (!smoke || smoke === '')
      newErrors.smoke = '受動喫煙防止措置を選択してください';

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
      console.log('Encoding images for draft:', images.length);
      let encodedImages: any[] = [];
      if (images.length > 0) {
        try {
          encodedImages = await encodeImagesToBase64(images);
          console.log('Images encoded successfully for draft:', encodedImages.length);
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
        work_location: locations[0] || '未設定',
        work_locations: locations || [],
        location_note: locationNote || null,
        working_hours: workingHours || null,
        overtime_info: overtime || null,
        holidays: holidays || null,
        remote_work_available: false,
        job_type: jobTypes[0] || '未設定',
        job_types: jobTypes || [],
        industry: industries[0] || '未設定',
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

      const authHeaders = getAuthHeaders();

      console.log('Saving draft to Supabase with data:', { ...data, images: '(encoded)' });

      const res = await fetch('/api/company/job/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        // ローカルストレージの下書きデータを削除
        clearDraft();
        alert('下書きを保存しました');
        console.log('下書き保存成功:', result);
        // 求人一覧ページにリダイレクト
        router.push('/company/job');
      } else {
        console.error('Draft save API Error:', result);
        alert(`下書き保存エラー: ${result.error}`);
      }
    } catch (error) {
      console.error('Draft save Request Error:', error);
      alert('下書き保存で通信エラーが発生しました');
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
  const handleSubmit = async () => {
    // 画像をBase64エンコード
    console.log('Encoding images:', images.length);
    let encodedImages: any[] = [];
    if (images.length > 0) {
      try {
        encodedImages = await encodeImagesToBase64(images);
        console.log('Images encoded successfully:', encodedImages.length);
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
      work_location: locations[0] || '未設定',
      work_locations: locations || [],
      location_note: locationNote || null,
      working_hours: workingHours || null,
      overtime_info: overtime || null,
      holidays: holidays || null,
      remote_work_available: false,
      job_type: jobTypes[0] || '未設定',
      job_types: jobTypes || [],
      industry: industries[0] || '未設定',
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

    const authHeaders = getAuthHeaders();
    const currentUserId = getCurrentUserId();

    try {
      const res = await fetch('/api/company/job/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
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
  const ErrorSummary: React.FC<{ errors: Record<string, string> }> = ({
    errors,
  }) => {
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
        salary: '年収',
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
      <div className='mb-6 p-4 border-2 border-red-500 rounded-lg bg-red-50'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center'>
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <div className='flex-1'>
            <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-red-700 mb-2">
              入力に不備があります
            </h3>
            <p className="font-['Noto_Sans_JP'] font-medium text-[14px] text-red-600 mb-3">
              以下の項目を確認してください：
            </p>
            <ul className='space-y-2'>
              {errorEntries.map(([field, message]) => (
                <li key={field} className='flex items-center gap-2'>
                  <button
                    type='button'
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
      <div className='mx-[76px]'>
        <div className='w-full my-[37px] p-[37px] rounded-[10px] bg-white'>
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
              setLocations={(locations: string[]) => {
                setLocations(locations);
                clearFieldError('locations');
              }}
              locationNote={locationNote}
              setLocationNote={setLocationNote}
              selectionProcess={selectionProcess}
              setSelectionProcess={setSelectionProcess}
              employmentType={employmentType}
              setEmploymentType={(value: string) => {
                setEmploymentType(value);
                clearFieldError('employmentType');
              }}
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
          <div className='flex flex-col items-center gap-4 mt-[40px] w-full'>
            {/* エラーサマリー */}
            {showErrors && <ErrorSummary errors={errors} />}

            <div className='flex justify-center items-center gap-4 w-full'>
              {isConfirmMode ? (
                <>
                  <Button
                    type='button'
                    variant='green-outline'
                    size='lg'
                    className="rounded-[32px] min-w-[260px] font-bold px-10 py-6.5 bg-white text-[#198D76] font-['Noto_Sans_JP']"
                    onClick={handleBack}
                  >
                    修正する
                  </Button>
                  <button
                    type='button'
                    className='rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white transition-all duration-200 ease-in-out hover:from-[#12614E] hover:to-[#1A8946]'
                    onClick={handleSubmit}
                  >
                    この内容で掲載申請をする
                  </button>
                </>
              ) : (
                <>
                  <Button
                    type='button'
                    variant='green-outline'
                    size='lg'
                    className="rounded-[32px] min-w-[160px] font-bold px-10 py-6.5 bg-white text-[#198D76] font-['Noto_Sans_JP']"
                    onClick={saveDraft}
                  >
                    下書き保存
                  </Button>
                  <button
                    type='button'
                    className='rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white transition-all duration-200 ease-in-out hover:from-[#12614E] hover:to-[#1A8946]'
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
                title='業種を選択'
                isOpen={isIndustryModalOpen}
                onClose={() => setIndustryModalOpen(false)}
                selectedCount={industries.length}
                totalCount={3}
                primaryButtonText='決定'
                industries='true'
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