/**
 * 業種型
 */
export type Industry = {
  id: string;
  name: string;
  experienceYears?: string;
};

/**
 * 職種型
 */
export type JobType = {
  id: string;
  name: string;
  experienceYears?: string;
};

/**
 * 学歴・経験業種/職種編集フォームの型
 */
export type EducationFormData = {
  finalEducation: string;
  schoolName: string;
  department: string;
  graduationYear: string;
  graduationMonth: string;
  industries: Industry[];
  jobTypes: JobType[];
};

import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

export interface EducationEditFormProps {
  register: UseFormRegister<EducationFormData>;
  handleSubmit: UseFormHandleSubmit<EducationFormData>;
  errors: FieldErrors<EducationFormData>;
  watch: UseFormWatch<EducationFormData>;
  setValue: UseFormSetValue<EducationFormData>;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  isIndustryModalOpen: boolean;
  setIsIndustryModalOpen: (v: boolean) => void;
  isJobTypeModalOpen: boolean;
  setIsJobTypeModalOpen: (v: boolean) => void;
  selectedIndustries: EducationFormData['industries'];
  selectedJobTypes: EducationFormData['jobTypes'];
  yearOptions: string[];
  monthOptions: string[];
  handleIndustryConfirm: (ids: string[]) => void;
  removeIndustry: (id: string) => void;
  updateIndustryExperience: (id: string, years: string) => void;
  handleJobTypeConfirm: (ids: string[]) => void;
  removeJobType: (id: string) => void;
  updateJobTypeExperience: (id: string, years: string) => void;
  onSubmit: () => Promise<void>;
  handleCancel: () => void;
}
