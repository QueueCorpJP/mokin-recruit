'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import type {
  CandidateFormData,
  EducationFormData as EducationData,
  SkillsFormData as SkillsData,
  SelectionEntry,
  ModalState,
} from '@/types';

// Re-export types for components
export type { CandidateFormData } from '@/types';

interface CandidateState {
  formData: CandidateFormData;
  education: EducationData;
  skills: SkillsData;
  selectionEntries: SelectionEntry[];
  selectedIndustriesMap: { [key: number]: string[] };
  modalState: ModalState;
  skillInput: string;
  memo: string;
  isSubmitting: boolean;
}

type CandidateAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<CandidateFormData> }
  | { type: 'SET_EDUCATION'; payload: Partial<EducationData> }
  | { type: 'SET_SKILLS'; payload: Partial<SkillsData> }
  | { type: 'SET_SELECTION_ENTRIES'; payload: SelectionEntry[] }
  | {
      type: 'UPDATE_SELECTION_ENTRY';
      payload: { index: number; field: keyof SelectionEntry; value: any };
    }
  | { type: 'ADD_SELECTION_ENTRY' }
  | { type: 'REMOVE_SELECTION_ENTRY'; payload: number }
  | {
      type: 'SET_SELECTED_INDUSTRIES_MAP';
      payload: { [key: number]: string[] };
    }
  | {
      type: 'UPDATE_SELECTED_INDUSTRIES';
      payload: { index: number; industries: string[] };
    }
  | { type: 'SET_MODAL_STATE'; payload: ModalState }
  | { type: 'SET_SKILL_INPUT'; payload: string }
  | { type: 'ADD_SKILL_TAG'; payload: string }
  | { type: 'REMOVE_SKILL_TAG'; payload: string }
  | { type: 'SET_MEMO'; payload: string }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_CANDIDATE_DATA'; payload: Partial<CandidateState> };

const initialFormData: CandidateFormData = {
  email: '',
  password: '',
  passwordConfirm: '',
  lastName: '',
  firstName: '',
  lastNameKana: '',
  firstNameKana: '',
  gender: 'unspecified',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  prefecture: '',
  phoneNumber: '',
  currentIncome: '',
  hasCareerChange: 'なし',
  jobChangeTiming: '',
  currentActivityStatus: '',
  recentJobCompanyName: '',
  recentJobDepartmentPosition: '',
  recentJobStartYear: '',
  recentJobStartMonth: '',
  recentJobEndYear: '',
  recentJobEndMonth: '',
  recentJobIsCurrentlyWorking: false,
  recentJobDescription: '',
  recentJobIndustries: [],
  recentJobTypes: [],
  jobSummary: '',
  selfPr: '',
  desiredWorkStyles: [],
  desiredSalary: '',
  desiredIndustries: [],
  desiredJobTypes: [],
  desiredLocations: [],
};

const initialEducation: EducationData = {
  final_education: '',
  school_name: '',
  department: '',
  graduation_year: null,
  graduation_month: null,
};

const initialSkills: SkillsData = {
  english_level: 'none',
  qualifications: '',
  skills_tags: [],
};

const initialState: CandidateState = {
  formData: initialFormData,
  education: initialEducation,
  skills: initialSkills,
  selectionEntries: [
    {
      id: '1',
      isPrivate: false,
      industries: [],
      companyName: '',
      department: '',
      progressStatus: '',
      declineReason: '',
      startYear: '',
      startMonth: '',
      endYear: '',
      endMonth: '',
      isCurrentlyWorking: false,
      jobDescription: '',
      jobTypes: [],
    },
  ],
  selectedIndustriesMap: {},
  modalState: { isOpen: false, targetType: null, targetIndex: null },
  skillInput: '',
  memo: '',
  isSubmitting: false,
};

function candidateReducer(
  state: CandidateState,
  action: CandidateAction
): CandidateState {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    case 'SET_EDUCATION':
      return {
        ...state,
        education: { ...state.education, ...action.payload },
      };
    case 'SET_SKILLS':
      return {
        ...state,
        skills: { ...state.skills, ...action.payload },
      };
    case 'SET_SELECTION_ENTRIES':
      return {
        ...state,
        selectionEntries: action.payload,
      };
    case 'UPDATE_SELECTION_ENTRY':
      return {
        ...state,
        selectionEntries: state.selectionEntries.map((entry, i) =>
          i === action.payload.index
            ? { ...entry, [action.payload.field]: action.payload.value }
            : entry
        ),
      };
    case 'ADD_SELECTION_ENTRY':
      return {
        ...state,
        selectionEntries: [
          ...state.selectionEntries,
          {
            id: `${state.selectionEntries.length + 1}`,
            isPrivate: false,
            industries: [],
            companyName: '',
            department: '',
            progressStatus: '',
            declineReason: '',
            startYear: '',
            startMonth: '',
            endYear: '',
            endMonth: '',
            isCurrentlyWorking: false,
            jobDescription: '',
            jobTypes: [],
          },
        ],
      };
    case 'REMOVE_SELECTION_ENTRY':
      return {
        ...state,
        selectionEntries: state.selectionEntries.filter(
          (_, i) => i !== action.payload
        ),
        selectedIndustriesMap: Object.fromEntries(
          Object.entries(state.selectedIndustriesMap).filter(
            ([key]) => parseInt(key) !== action.payload
          )
        ),
      };
    case 'SET_SELECTED_INDUSTRIES_MAP':
      return {
        ...state,
        selectedIndustriesMap: action.payload,
      };
    case 'UPDATE_SELECTED_INDUSTRIES':
      return {
        ...state,
        selectedIndustriesMap: {
          ...state.selectedIndustriesMap,
          [action.payload.index]: action.payload.industries,
        },
      };
    case 'SET_MODAL_STATE':
      return {
        ...state,
        modalState: action.payload,
      };
    case 'SET_SKILL_INPUT':
      return {
        ...state,
        skillInput: action.payload,
      };
    case 'ADD_SKILL_TAG':
      if (
        action.payload.trim() &&
        !state.skills.skills_tags.includes(action.payload.trim())
      ) {
        return {
          ...state,
          skills: {
            ...state.skills,
            skills_tags: [...state.skills.skills_tags, action.payload.trim()],
          },
          skillInput: '',
        };
      }
      return state;
    case 'REMOVE_SKILL_TAG':
      return {
        ...state,
        skills: {
          ...state.skills,
          skills_tags: state.skills.skills_tags.filter(
            tag => tag !== action.payload
          ),
        },
      };
    case 'SET_MEMO':
      return {
        ...state,
        memo: action.payload,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    case 'RESET_STATE':
      return initialState;
    case 'LOAD_CANDIDATE_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

interface CandidateContextValue extends CandidateState {
  // Form data actions
  updateFormData: (field: keyof CandidateFormData, value: any) => void;
  updateEducation: (field: keyof EducationData, value: any) => void;
  updateSkills: (field: keyof SkillsData, value: any) => void;

  // Selection entries actions
  updateSelectionEntry: (
    index: number,
    field: keyof SelectionEntry,
    value: any
  ) => void;
  addSelectionEntry: () => void;
  removeSelectionEntry: (index: number) => void;
  updateSelectedIndustries: (index: number, industries: string[]) => void;

  // Modal actions
  openModal: (
    targetType: 'industry' | 'jobtype' | 'workstyle',
    targetIndex: number
  ) => void;
  closeModal: () => void;

  // Skills actions
  setSkillInput: (input: string) => void;
  addSkillTag: () => void;
  removeSkillTag: (tag: string) => void;

  // Other actions
  setMemo: (memo: string) => void;
  setSubmitting: (submitting: boolean) => void;
  resetState: () => void;
  loadCandidateData: (data: Partial<CandidateState>) => void;
}

const CandidateContext = createContext<CandidateContextValue | null>(null);

interface CandidateProviderProps {
  children: ReactNode;
}

export function CandidateProvider({ children }: CandidateProviderProps) {
  const [state, dispatch] = useReducer(candidateReducer, initialState);

  // Form data actions
  const updateFormData = useCallback(
    (field: keyof CandidateFormData, value: any) => {
      dispatch({ type: 'SET_FORM_DATA', payload: { [field]: value } });
    },
    []
  );

  const updateEducation = useCallback(
    (field: keyof EducationData, value: any) => {
      dispatch({ type: 'SET_EDUCATION', payload: { [field]: value } });
    },
    []
  );

  const updateSkills = useCallback((field: keyof SkillsData, value: any) => {
    dispatch({ type: 'SET_SKILLS', payload: { [field]: value } });
  }, []);

  // Selection entries actions
  const updateSelectionEntry = useCallback(
    (index: number, field: keyof SelectionEntry, value: any) => {
      dispatch({
        type: 'UPDATE_SELECTION_ENTRY',
        payload: { index, field, value },
      });
    },
    []
  );

  const addSelectionEntry = useCallback(() => {
    dispatch({ type: 'ADD_SELECTION_ENTRY' });
  }, []);

  const removeSelectionEntry = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_SELECTION_ENTRY', payload: index });
  }, []);

  const updateSelectedIndustries = useCallback(
    (index: number, industries: string[]) => {
      dispatch({
        type: 'UPDATE_SELECTED_INDUSTRIES',
        payload: { index, industries },
      });
      dispatch({
        type: 'UPDATE_SELECTION_ENTRY',
        payload: { index, field: 'industries', value: industries },
      });
    },
    []
  );

  // Modal actions
  const openModal = useCallback(
    (targetType: 'industry' | 'jobtype' | 'workstyle', targetIndex: number) => {
      dispatch({
        type: 'SET_MODAL_STATE',
        payload: { isOpen: true, targetType, targetIndex },
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    dispatch({
      type: 'SET_MODAL_STATE',
      payload: { isOpen: false, targetType: null, targetIndex: null },
    });
  }, []);

  // Skills actions
  const setSkillInput = useCallback((input: string) => {
    dispatch({ type: 'SET_SKILL_INPUT', payload: input });
  }, []);

  const addSkillTag = useCallback(() => {
    if (state.skillInput.trim()) {
      dispatch({ type: 'ADD_SKILL_TAG', payload: state.skillInput });
    }
  }, [state.skillInput]);

  const removeSkillTag = useCallback((tag: string) => {
    dispatch({ type: 'REMOVE_SKILL_TAG', payload: tag });
  }, []);

  // Other actions
  const setMemo = useCallback((memo: string) => {
    dispatch({ type: 'SET_MEMO', payload: memo });
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const loadCandidateData = useCallback((data: Partial<CandidateState>) => {
    dispatch({ type: 'LOAD_CANDIDATE_DATA', payload: data });
  }, []);

  const contextValue: CandidateContextValue = {
    ...state,
    updateFormData,
    updateEducation,
    updateSkills,
    updateSelectionEntry,
    addSelectionEntry,
    removeSelectionEntry,
    updateSelectedIndustries,
    openModal,
    closeModal,
    setSkillInput,
    addSkillTag,
    removeSkillTag,
    setMemo,
    setSubmitting,
    resetState,
    loadCandidateData,
  };

  return (
    <CandidateContext.Provider value={contextValue}>
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidateContext() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error(
      'useCandidateContext must be used within a CandidateProvider'
    );
  }
  return context;
}
