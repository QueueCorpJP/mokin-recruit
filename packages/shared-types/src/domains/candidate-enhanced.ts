// Enhanced Candidate Types
// Based on detailed Figma analysis and comprehensive selection options

// 基本選択肢の型定義
export type Gender = '男性' | '女性' | '未回答';

export type CurrentSalary =
  | '500万未満'
  | '500~600万'
  | '600~750万'
  | '750~1,000万'
  | '1,000~1.250万'
  | '1250~1500万'
  | '1500~2000万'
  | '2000~3000万'
  | '3000~5000万'
  | '5000万~';

export type JobChangeExperience = 'あり' | 'なし';

export type DesiredChangeTiming =
  | '3か月以内に'
  | '6か月以内に'
  | '1年以内に'
  | '未定';

export type JobSearchStatus =
  | 'まだ始めていない'
  | '情報収集中'
  | '書類選考に進んでいる企業がある'
  | '面接・面談を受けている企業がある'
  | '内定をもらっている';

export type LanguageLevel =
  | 'ネイティブ'
  | 'ビジネス会話'
  | '日常会話'
  | '基礎会話'
  | 'なし';

export type DesiredSalary =
  | '問わない'
  | '600万円以上'
  | '700万円以上'
  | '800万円以上'
  | '900万円以上'
  | '1000万円以上'
  | '1100万円以上'
  | '1200万円以上'
  | '1300万円以上'
  | '1400万円以上'
  | '1500万円以上'
  | '1600万円以上'
  | '1700万円以上'
  | '1800万円以上'
  | '1900万円以上'
  | '2000万円以上'
  | '2100万円以上'
  | '2200万円以上'
  | '2300万円以上'
  | '2400万円以上'
  | '2500万円以上'
  | '2600万円以上'
  | '2700万円以上'
  | '2800万円以上'
  | '2900万円以上'
  | '3000万円以上'
  | '4000万円以上'
  | '5000万円以上';

export type SelectionStatus =
  | '書類選考'
  | '一次面接'
  | '二次面接'
  | '最終面接'
  | '内定';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

// 拡張された候補者メインエンティティ
export interface EnhancedCandidate {
  // 基本識別情報
  id: string;
  email: string;
  passwordHash: string;

  // 基本個人情報（変更不可）
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  currentResidence: string;
  phoneNumber: string;

  // 現在の状況
  currentSalary: CurrentSalary;

  // 転職活動状況
  jobChangeExperience: JobChangeExperience;
  desiredChangeTiming: DesiredChangeTiming;
  jobSearchStatus: JobSearchStatus;

  // 直近の職歴
  recentCompanyName: string;
  recentDepartmentName: string;
  recentPositionName?: string;
  employmentStartYear: number;
  employmentStartMonth: number;
  employmentEndYear?: number;
  employmentEndMonth?: number;
  isCurrentlyEmployed: boolean;
  recentIndustry: string;
  recentJobType: string;
  jobDescription: string;

  // 学歴
  finalEducation: string;
  schoolName: string;
  major: string;
  graduationYear: number;
  graduationMonth: number;

  // 語学力
  englishLevel: LanguageLevel;

  // スキル・資格
  skills: string[];
  certifications?: string;

  // 希望条件
  desiredSalary: DesiredSalary;
  desiredIndustries: string[];
  desiredJobTypes: string[];
  desiredLocations: string[];
  interestedWorkStyles: string[];

  // 追加情報
  careerSummary?: string;
  selfPr?: string;
  resumeFilePath?: string;
  careerHistoryFilePath?: string;

  // システム設定
  scoutReceptionEnabled: boolean;
  emailNotificationSettings: Record<string, boolean>;
  status: UserStatus;

  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// 候補者の経験業種
export interface CandidateIndustryExperience {
  id: string;
  candidateId: string;
  industry: string;
  experienceYears: number;
  createdAt: Date;
}

// 候補者の経験職種
export interface CandidateJobTypeExperience {
  id: string;
  candidateId: string;
  jobType: string;
  experienceYears: number;
  createdAt: Date;
}

// 候補者の語学力（英語以外）
export interface CandidateLanguage {
  id: string;
  candidateId: string;
  language: string;
  level: LanguageLevel;
  createdAt: Date;
}

// 候補者の選考状況
export interface CandidateSelectionStatus {
  id: string;
  candidateId: string;
  companyName: string;
  departmentName: string;
  positionName?: string;
  selectionStatus: SelectionStatus;
  disclosureConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// マスターデータ型定義
export interface Location {
  id: string;
  region: string;
  locationName: string;
  sortOrder: number;
  createdAt: Date;
}

export interface Industry {
  id: string;
  category: string;
  industryName: string;
  sortOrder: number;
  createdAt: Date;
}

export interface JobType {
  id: string;
  category: string;
  jobTypeName: string;
  sortOrder: number;
  createdAt: Date;
}

export interface EducationLevel {
  id: string;
  educationLevel: string;
  sortOrder: number;
  createdAt: Date;
}

export interface WorkStyle {
  id: string;
  category: string;
  workStyleName: string;
  sortOrder: number;
  createdAt: Date;
}

// 候補者登録フォーム用の型定義
export interface CandidateRegistrationRequest {
  // 基本情報
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  currentResidence: string;
  phoneNumber: string;
  currentSalary: CurrentSalary;

  // 転職活動状況
  jobChangeExperience: JobChangeExperience;
  desiredChangeTiming: DesiredChangeTiming;
  jobSearchStatus: JobSearchStatus;

  // 直近の職歴
  recentCompanyName: string;
  recentDepartmentName: string;
  recentPositionName?: string;
  employmentStartYear: number;
  employmentStartMonth: number;
  employmentEndYear?: number;
  employmentEndMonth?: number;
  isCurrentlyEmployed: boolean;
  recentIndustry: string;
  recentJobType: string;
  jobDescription: string;

  // 学歴
  finalEducation: string;
  schoolName: string;
  major: string;
  graduationYear: number;
  graduationMonth: number;

  // 語学・スキル
  englishLevel: LanguageLevel;
  otherLanguages?: CandidateLanguage[];
  skills: string[];
  certifications?: string;

  // 経験業種・職種
  industryExperiences: Omit<
    CandidateIndustryExperience,
    'id' | 'candidateId' | 'createdAt'
  >[];
  jobTypeExperiences: Omit<
    CandidateJobTypeExperience,
    'id' | 'candidateId' | 'createdAt'
  >[];

  // 希望条件
  desiredSalary: DesiredSalary;
  desiredIndustries: string[];
  desiredJobTypes: string[];
  desiredLocations: string[];
  interestedWorkStyles: string[];

  // 追加情報
  careerSummary?: string;
  selfPr?: string;

  // 選考状況（任意）
  selectionStatuses?: Omit<
    CandidateSelectionStatus,
    'id' | 'candidateId' | 'createdAt' | 'updatedAt'
  >[];
}

// 候補者プロファイル更新用
export interface CandidateProfileUpdateRequest {
  // 基本情報（一部変更不可）
  gender?: Gender;
  currentResidence?: string;
  phoneNumber?: string;
  currentSalary?: CurrentSalary;

  // 転職活動状況
  jobChangeExperience?: JobChangeExperience;
  desiredChangeTiming?: DesiredChangeTiming;
  jobSearchStatus?: JobSearchStatus;

  // 直近の職歴
  recentCompanyName?: string;
  recentDepartmentName?: string;
  recentPositionName?: string;
  employmentStartYear?: number;
  employmentStartMonth?: number;
  employmentEndYear?: number;
  employmentEndMonth?: number;
  isCurrentlyEmployed?: boolean;
  recentIndustry?: string;
  recentJobType?: string;
  jobDescription?: string;

  // 学歴
  finalEducation?: string;
  schoolName?: string;
  major?: string;
  graduationYear?: number;
  graduationMonth?: number;

  // 語学・スキル
  englishLevel?: LanguageLevel;
  skills?: string[];
  certifications?: string;

  // 希望条件
  desiredSalary?: DesiredSalary;
  desiredIndustries?: string[];
  desiredJobTypes?: string[];
  desiredLocations?: string[];
  interestedWorkStyles?: string[];

  // 追加情報
  careerSummary?: string;
  selfPr?: string;

  // システム設定
  scoutReceptionEnabled?: boolean;
  emailNotificationSettings?: Record<string, boolean>;
}

// 候補者検索フィルター
export interface CandidateSearchFilters {
  // 基本条件
  genders?: Gender[];
  ageRange?: {
    min?: number;
    max?: number;
  };
  locations?: string[];

  // 職歴・経験
  industries?: string[];
  jobTypes?: string[];
  currentSalaryRange?: {
    min?: CurrentSalary;
    max?: CurrentSalary;
  };

  // 転職状況
  jobChangeExperience?: JobChangeExperience;
  jobSearchStatuses?: JobSearchStatus[];
  desiredChangeTimings?: DesiredChangeTiming[];

  // スキル・学歴
  skills?: string[];
  educationLevels?: string[];
  englishLevels?: LanguageLevel[];

  // 希望条件
  desiredSalaryRange?: {
    min?: DesiredSalary;
    max?: DesiredSalary;
  };
  desiredIndustries?: string[];
  desiredJobTypes?: string[];
  desiredLocations?: string[];
  interestedWorkStyles?: string[];

  // その他
  keywords?: string;
  scoutReceptionEnabled?: boolean;
}

// API レスポンス用
export interface CandidateListResponse {
  candidates: EnhancedCandidate[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface MasterDataResponse {
  locations: Location[];
  industries: Industry[];
  jobTypes: JobType[];
  educationLevels: EducationLevel[];
  workStyles: WorkStyle[];
}
