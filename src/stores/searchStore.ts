import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { JobType, Industry, Location, WorkStyle } from '@/types';

export interface SearchFormData {
  // Basic search
  searchGroup: string;
  keyword: string;

  // Experience
  experienceJobTypes: JobType[];
  experienceIndustries: Industry[];
  jobTypeAndSearch: boolean;
  industryAndSearch: boolean;

  // Salary and company
  currentSalaryMin: string;
  currentSalaryMax: string;
  currentCompany: string;

  // Education and qualifications
  education: string;
  englishLevel: string;
  otherLanguage: string;
  otherLanguageLevel: string;
  qualifications: string;

  // Demographics
  ageMin: string;
  ageMax: string;

  // Desired conditions
  desiredJobTypes: JobType[];
  desiredIndustries: Industry[];
  desiredSalaryMin: string;
  desiredSalaryMax: string;
  desiredLocations: Location[];
  transferTime: string;
  workStyles: WorkStyle[];

  // Selection status
  selectionStatus: string;
  similarCompanyIndustry: string;
  similarCompanyLocation: string;
  lastLoginMin: string;
}

export interface SearchState extends SearchFormData {
  // Modal states
  isJobTypeModalOpen: boolean;
  isIndustryModalOpen: boolean;
  isDesiredJobTypeModalOpen: boolean;
  isDesiredIndustryModalOpen: boolean;
  isDesiredLocationModalOpen: boolean;
  isWorkStyleModalOpen: boolean;
  isSaveModalOpen: boolean;

  // Validation states
  searchGroupTouched: boolean;
  searchGroupError: string;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Save modal states
  saveSearchName: string;
  saveError: string;
  isSaveLoading: boolean;

  // Actions
  setSearchGroup: (value: string) => void;
  setKeyword: (value: string) => void;
  setExperienceJobTypes: (jobTypes: JobType[]) => void;
  setExperienceIndustries: (industries: Industry[]) => void;
  updateExperienceJobTypeYears: (id: string, experienceYears: string) => void;
  updateExperienceIndustryYears: (id: string, experienceYears: string) => void;
  updateDesiredJobTypeYears: (id: string, experienceYears: string) => void;
  updateDesiredIndustryYears: (id: string, experienceYears: string) => void;
  setJobTypeAndSearch: (value: boolean) => void;
  setIndustryAndSearch: (value: boolean) => void;
  setCurrentSalaryMin: (value: string) => void;
  setCurrentSalaryMax: (value: string) => void;
  setCurrentCompany: (value: string) => void;
  setEducation: (value: string) => void;
  setEnglishLevel: (value: string) => void;
  setOtherLanguage: (value: string) => void;
  setOtherLanguageLevel: (value: string) => void;
  setQualifications: (value: string) => void;
  setAgeMin: (value: string) => void;
  setAgeMax: (value: string) => void;
  setDesiredJobTypes: (jobTypes: JobType[]) => void;
  setDesiredIndustries: (industries: Industry[]) => void;
  setDesiredSalaryMin: (value: string) => void;
  setDesiredSalaryMax: (value: string) => void;
  setDesiredLocations: (locations: Location[]) => void;
  setTransferTime: (value: string) => void;
  setWorkStyles: (styles: WorkStyle[]) => void;
  setSelectionStatus: (value: string) => void;
  setSimilarCompanyIndustry: (value: string) => void;
  setSimilarCompanyLocation: (value: string) => void;
  setLastLoginMin: (value: string) => void;

  // Modal actions
  setIsJobTypeModalOpen: (open: boolean) => void;
  setIsIndustryModalOpen: (open: boolean) => void;
  setIsDesiredJobTypeModalOpen: (open: boolean) => void;
  setIsDesiredIndustryModalOpen: (open: boolean) => void;
  setIsDesiredLocationModalOpen: (open: boolean) => void;
  setIsWorkStyleModalOpen: (open: boolean) => void;
  setIsSaveModalOpen: (open: boolean) => void;

  // Validation actions
  setSearchGroupTouched: (touched: boolean) => void;
  setSearchGroupError: (error: string) => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSaveSearchName: (name: string) => void;
  setSaveError: (error: string) => void;
  setIsSaveLoading: (loading: boolean) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  getSearchParams: () => URLSearchParams;
}

const initialState: SearchFormData = {
  searchGroup: '',
  keyword: '',
  experienceJobTypes: [],
  experienceIndustries: [],
  jobTypeAndSearch: false,
  industryAndSearch: false,
  currentSalaryMin: '',
  currentSalaryMax: '',
  currentCompany: '',
  education: '',
  englishLevel: '',
  otherLanguage: '',
  otherLanguageLevel: '',
  qualifications: '',
  ageMin: '',
  ageMax: '',
  desiredJobTypes: [],
  desiredIndustries: [],
  desiredSalaryMin: '',
  desiredSalaryMax: '',
  desiredLocations: [],
  transferTime: '',
  workStyles: [],
  selectionStatus: '',
  similarCompanyIndustry: '',
  similarCompanyLocation: '',
  lastLoginMin: '',
};

export const useSearchStore = create<SearchState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    ...initialState,

    // Modal states
    isJobTypeModalOpen: false,
    isIndustryModalOpen: false,
    isDesiredJobTypeModalOpen: false,
    isDesiredIndustryModalOpen: false,
    isDesiredLocationModalOpen: false,
    isWorkStyleModalOpen: false,
    isSaveModalOpen: false,

    // Validation states
    searchGroupTouched: false,
    searchGroupError: '',

    // Loading and error states
    isLoading: false,
    error: null,

    // Save modal states
    saveSearchName: '',
    saveError: '',
    isSaveLoading: false,

    // Form field setters
    setSearchGroup: value => set({ searchGroup: value }),
    setKeyword: value => set({ keyword: value }),
    setExperienceJobTypes: jobTypes => {
      console.log('[DEBUG] setExperienceJobTypes called with:', jobTypes);
      set({ experienceJobTypes: jobTypes });
    },
    setExperienceIndustries: industries => {
      console.log('[DEBUG] setExperienceIndustries called with:', industries);
      set({ experienceIndustries: industries });
    },
    updateExperienceJobTypeYears: (id, experienceYears) =>
      set(state => ({
        experienceJobTypes: state.experienceJobTypes.map(jobType =>
          jobType.id === id ? { ...jobType, experienceYears } : jobType
        ),
      })),
    updateExperienceIndustryYears: (id, experienceYears) =>
      set(state => ({
        experienceIndustries: state.experienceIndustries.map(industry =>
          industry.id === id ? { ...industry, experienceYears } : industry
        ),
      })),
    updateDesiredJobTypeYears: (id, experienceYears) =>
      set(state => ({
        desiredJobTypes: state.desiredJobTypes.map(jobType =>
          jobType.id === id ? { ...jobType, experienceYears } : jobType
        ),
      })),
    updateDesiredIndustryYears: (id, experienceYears) =>
      set(state => ({
        desiredIndustries: state.desiredIndustries.map(industry =>
          industry.id === id ? { ...industry, experienceYears } : industry
        ),
      })),
    setJobTypeAndSearch: value => set({ jobTypeAndSearch: value }),
    setIndustryAndSearch: value => set({ industryAndSearch: value }),
    setCurrentSalaryMin: value =>
      set(state => {
        // 最大値が設定されていて、新しい最小値が最大値を超える場合は最大値もクリア
        if (
          state.currentSalaryMax &&
          value &&
          parseInt(value) > parseInt(state.currentSalaryMax)
        ) {
          return { currentSalaryMin: value, currentSalaryMax: '' };
        }
        return { currentSalaryMin: value };
      }),
    setCurrentSalaryMax: value =>
      set(state => {
        // 最小値が設定されていて、新しい最大値が最小値を下回る場合は設定しない
        if (
          state.currentSalaryMin &&
          value &&
          parseInt(value) < parseInt(state.currentSalaryMin)
        ) {
          return state;
        }
        return { currentSalaryMax: value };
      }),
    setCurrentCompany: value => set({ currentCompany: value }),
    setEducation: value => set({ education: value }),
    setEnglishLevel: value => set({ englishLevel: value }),
    setOtherLanguage: value => set({ otherLanguage: value }),
    setOtherLanguageLevel: value => set({ otherLanguageLevel: value }),
    setQualifications: value => set({ qualifications: value }),
    setAgeMin: value =>
      set(state => {
        // 最大値が設定されていて、新しい最小値が最大値を超える場合は最大値もクリア
        if (state.ageMax && value && parseInt(value) > parseInt(state.ageMax)) {
          return { ageMin: value, ageMax: '' };
        }
        return { ageMin: value };
      }),
    setAgeMax: value =>
      set(state => {
        // 最小値が設定されていて、新しい最大値が最小値を下回る場合は設定しない
        if (state.ageMin && value && parseInt(value) < parseInt(state.ageMin)) {
          return state;
        }
        return { ageMax: value };
      }),
    setDesiredJobTypes: jobTypes => set({ desiredJobTypes: jobTypes }),
    setDesiredIndustries: industries => set({ desiredIndustries: industries }),
    setDesiredSalaryMin: value =>
      set(state => {
        // 最大値が設定されていて、新しい最小値が最大値を超える場合は最大値もクリア
        if (
          state.desiredSalaryMax &&
          value &&
          parseInt(value) > parseInt(state.desiredSalaryMax)
        ) {
          return { desiredSalaryMin: value, desiredSalaryMax: '' };
        }
        return { desiredSalaryMin: value };
      }),
    setDesiredSalaryMax: value =>
      set(state => {
        // 最小値が設定されていて、新しい最大値が最小値を下回る場合は設定しない
        if (
          state.desiredSalaryMin &&
          value &&
          parseInt(value) < parseInt(state.desiredSalaryMin)
        ) {
          return state;
        }
        return { desiredSalaryMax: value };
      }),
    setDesiredLocations: locations => set({ desiredLocations: locations }),
    setTransferTime: value => set({ transferTime: value }),
    setWorkStyles: styles => set({ workStyles: styles }),
    setSelectionStatus: value => set({ selectionStatus: value }),
    setSimilarCompanyIndustry: value => set({ similarCompanyIndustry: value }),
    setSimilarCompanyLocation: value => set({ similarCompanyLocation: value }),
    setLastLoginMin: value => set({ lastLoginMin: value }),

    // Modal setters
    setIsJobTypeModalOpen: open => set({ isJobTypeModalOpen: open }),
    setIsIndustryModalOpen: open => set({ isIndustryModalOpen: open }),
    setIsDesiredJobTypeModalOpen: open =>
      set({ isDesiredJobTypeModalOpen: open }),
    setIsDesiredIndustryModalOpen: open =>
      set({ isDesiredIndustryModalOpen: open }),
    setIsDesiredLocationModalOpen: open =>
      set({ isDesiredLocationModalOpen: open }),
    setIsWorkStyleModalOpen: open => set({ isWorkStyleModalOpen: open }),
    setIsSaveModalOpen: open => set({ isSaveModalOpen: open }),

    // Validation setters
    setSearchGroupTouched: touched => set({ searchGroupTouched: touched }),
    setSearchGroupError: error => set({ searchGroupError: error }),

    // Utility setters
    setLoading: loading => set({ isLoading: loading }),
    setError: error => set({ error }),
    setSaveSearchName: name => set({ saveSearchName: name }),
    setSaveError: error => set({ saveError: error }),
    setIsSaveLoading: loading => set({ isSaveLoading: loading }),

    // Reset form
    resetForm: () =>
      set({
        ...initialState,
        searchGroupTouched: false,
        searchGroupError: '',
        isLoading: false,
        error: null,
      }),

    // Validation
    validateForm: () => {
      const { searchGroup } = get();
      return !!searchGroup && searchGroup !== '';
    },

    // Generate search params
    getSearchParams: () => {
      const state = get();
      const params = new URLSearchParams();

      if (state.searchGroup) params.set('search_group', state.searchGroup);
      if (state.keyword) params.set('keyword', state.keyword);

      if (state.experienceJobTypes.length > 0) {
        params.set(
          'experience_job_types',
          state.experienceJobTypes.map(j => j.name).join(',')
        );
      }
      if (state.experienceIndustries.length > 0) {
        params.set(
          'experience_industries',
          state.experienceIndustries.map(i => i.name).join(',')
        );
      }

      if (state.currentSalaryMin)
        params.set('current_salary_min', state.currentSalaryMin);
      if (state.currentSalaryMax)
        params.set('current_salary_max', state.currentSalaryMax);
      if (state.currentCompany)
        params.set('current_company', state.currentCompany);

      if (state.education) params.set('education', state.education);
      if (state.englishLevel) params.set('english_level', state.englishLevel);
      if (state.otherLanguage)
        params.set('other_language', state.otherLanguage);
      if (state.otherLanguageLevel)
        params.set('other_language_level', state.otherLanguageLevel);
      if (state.qualifications)
        params.set('qualifications', state.qualifications);

      if (state.ageMin) params.set('age_min', state.ageMin);
      if (state.ageMax) params.set('age_max', state.ageMax);

      if (state.desiredJobTypes.length > 0) {
        params.set(
          'desired_job_types',
          state.desiredJobTypes.map(j => j.name).join(',')
        );
      }
      if (state.desiredIndustries.length > 0) {
        params.set(
          'desired_industries',
          state.desiredIndustries.map(i => i.name).join(',')
        );
      }
      if (state.desiredSalaryMin)
        params.set('desired_salary_min', state.desiredSalaryMin);
      if (state.desiredSalaryMax)
        params.set('desired_salary_max', state.desiredSalaryMax);
      if (state.desiredLocations.length > 0) {
        params.set(
          'desired_locations',
          state.desiredLocations.map(l => l.name).join(',')
        );
      }

      if (state.transferTime) params.set('transfer_time', state.transferTime);
      if (state.workStyles.length > 0) {
        params.set('work_styles', state.workStyles.map(w => w.name).join(','));
      }
      if (state.selectionStatus)
        params.set('selection_status', state.selectionStatus);
      if (state.similarCompanyIndustry)
        params.set('similar_company_industry', state.similarCompanyIndustry);
      if (state.similarCompanyLocation)
        params.set('similar_company_location', state.similarCompanyLocation);
      if (state.lastLoginMin) params.set('last_login_min', state.lastLoginMin);

      return params;
    },
  }))
);
