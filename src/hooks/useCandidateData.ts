import { useCallback } from 'react';
import { useCandidateContext, CandidateFormData } from '@/contexts/CandidateContext';
import { checkEmailDuplication } from '@/app/admin/candidate/new/actions';

// 候補者データの変換とビジネスロジックを処理するhook
export function useCandidateData() {
  const context = useCandidateContext();

  // フォームデータから確認用データに変換
  const prepareConfirmationData = useCallback(() => {
    const { formData, education, skills, selectionEntries } = context;
    
    return {
      updateData: {
        // Basic info (snake_case for API)
        email: formData.email,
        password: formData.password,
        last_name: formData.lastName,
        first_name: formData.firstName,
        last_name_kana: formData.lastNameKana,
        first_name_kana: formData.firstNameKana,
        gender: formData.gender,
        birth_date: formData.birthYear && formData.birthMonth && formData.birthDay ? 
          `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}` : null,
        prefecture: formData.prefecture,
        phone_number: formData.phoneNumber,
        current_income: formData.currentIncome,
        
        // Career status
        has_career_change: formData.hasCareerChange,
        job_change_timing: formData.jobChangeTiming,
        current_activity_status: formData.currentActivityStatus,
        
        // Recent job
        recent_job_company_name: formData.recentJobCompanyName,
        recent_job_department_position: formData.recentJobDepartmentPosition,
        recent_job_start_year: formData.recentJobStartYear,
        recent_job_start_month: formData.recentJobStartMonth,
        recent_job_end_year: formData.recentJobEndYear,
        recent_job_end_month: formData.recentJobEndMonth,
        recent_job_is_currently_working: formData.recentJobIsCurrentlyWorking,
        recent_job_description: formData.recentJobDescription,
        recent_job_industries: formData.recentJobIndustries,
        recent_job_types: formData.recentJobTypes,
        
        // Summary
        job_summary: formData.jobSummary,
        self_pr: formData.selfPr,
        
        // Desired conditions
        desired_work_styles: formData.desiredWorkStyles || [],
      },
      education,
      workExperience: [],
      jobTypeExperience: [],
      skills,
      selectionEntries: selectionEntries.filter(entry => entry.companyName),
      memo: context.memo,
      expectations: {
        desired_income: formData.desiredSalary,
        desired_industries: formData.desiredIndustries,
        desired_job_types: formData.desiredJobTypes,
        desired_work_locations: formData.desiredLocations,
        desired_work_styles: formData.desiredWorkStyles,
      }
    };
  }, [context]);

  // 既存候補者データからフォームデータに変換
  const loadFromCandidateDetail = useCallback((candidateData: any) => {
    const birthDate = candidateData.birth_date ? new Date(candidateData.birth_date) : null;
    
    const formData: CandidateFormData = {
      email: candidateData.email || '',
      lastName: candidateData.last_name || '',
      firstName: candidateData.first_name || '',
      lastNameKana: candidateData.last_name_kana || '',
      firstNameKana: candidateData.first_name_kana || '',
      gender: candidateData.gender || 'unspecified',
      birthYear: birthDate ? birthDate.getFullYear().toString() : '',
      birthMonth: birthDate ? (birthDate.getMonth() + 1).toString() : '',
      birthDay: birthDate ? birthDate.getDate().toString() : '',
      prefecture: candidateData.prefecture || '',
      phoneNumber: candidateData.phone_number || '',
      currentIncome: candidateData.current_income || '',
      hasCareerChange: candidateData.has_career_change || 'no',
      jobChangeTiming: candidateData.job_change_timing || '',
      currentActivityStatus: candidateData.current_activity_status || '',
      recentJobCompanyName: candidateData.recent_job_company_name || '',
      recentJobDepartmentPosition: candidateData.recent_job_department_position || '',
      recentJobStartYear: candidateData.recent_job_start_year || '',
      recentJobStartMonth: candidateData.recent_job_start_month || '',
      recentJobEndYear: candidateData.recent_job_end_year || '',
      recentJobEndMonth: candidateData.recent_job_end_month || '',
      recentJobIsCurrentlyWorking: candidateData.recent_job_is_currently_working || false,
      recentJobDescription: candidateData.recent_job_description || '',
      recentJobIndustries: candidateData.recent_job_industries || [],
      recentJobTypes: candidateData.recent_job_types || [],
      jobSummary: candidateData.job_summary || '',
      selfPr: candidateData.self_pr || '',
    };

    const education = candidateData.education || {
      final_education: '',
      school_name: '',
      department: '',
      graduation_year: null,
      graduation_month: null,
    };

    const skills = candidateData.skills || {
      english_level: 'none',
      qualifications: '',
      skills_tags: [],
    };

    const selectionEntries = candidateData.selectionEntries || [];

    context.loadCandidateData({
      formData,
      education,
      skills,
      selectionEntries: selectionEntries.length > 0 ? selectionEntries : [
        {
          id: '1',
          isPrivate: false,
          industries: [],
          companyName: '',
          department: '',
          progressStatus: '',
          declineReason: '',
        }
      ],
    });
  }, [context]);

  // バリデーション
  const validateFormData = useCallback(async () => {
    const { formData, skills } = context;
    const errors: string[] = [];

    // メールアドレスのバリデーション（VALIDATION_ERRORS.mdに準拠）
    if (!formData.email) {
      errors.push('メールアドレスを入力してください。');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('メールアドレスの形式が正しくありません。');
    } else {
      // メール重複チェック
      try {
        const result = await checkEmailDuplication(formData.email);
        if (result.isDuplicate) {
          errors.push('このメールアドレスはすでに登録されています。');
        }
      } catch (error) {
        console.error('Email duplication check failed:', error);
        // ネットワークエラーなどの場合は重複チェックをスキップ
      }
    }

    // パスワードのバリデーション（signupに準拠）
    if (formData.password && formData.password.trim()) {
      if (formData.password.length < 8) {
        errors.push('パスワードは8文字以上で入力してください');
      }
      if (formData.password !== formData.passwordConfirm) {
        errors.push('パスワードが一致しません');
      }
    }

    // 必須フィールドのチェック（VALIDATION_ERRORS.mdに準拠）
    if (!formData.lastName) errors.push('姓を入力してください');
    if (!formData.firstName) errors.push('名を入力してください');
    
    // スキルタグの最低3個チェック（VALIDATION_ERRORS.mdに準拠）
    if (skills.skills_tags.length < 3) {
      errors.push('スキルは最低3つ以上入力してください');
    }
    
    // 希望の働き方のバリデーション（VALIDATION_ERRORS.mdに準拠）
    if (!formData.desiredWorkStyles || formData.desiredWorkStyles.length === 0) {
      errors.push('興味のある働き方を選択してください');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [context]);

  // フォームリセット
  const resetForm = useCallback(() => {
    context.resetState();
  }, [context]);

  return {
    ...context,
    prepareConfirmationData,
    loadFromCandidateDetail,
    validateFormData,
    resetForm,
  };
}