import {
  IBaseRepository,
  IPaginatedRepository,
  ISearchableRepository,
} from './IRepository';

// ドメインエンティティの型定義
export interface CandidateEntity {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  gender: string;
  status: string;
  currentResidence: string;
  birthDate: Date;
  phoneNumber: string;
  currentSalary: string;
  hasJobChangeExperience: boolean;
  desiredChangeTiming: string;
  jobSearchStatus: string;
  finalEducation: string;
  englishLevel: string;
  desiredSalary: string;
  emailNotificationSettings: Record<string, unknown>;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyEntity {
  id: string;
  companyName: string;
  industry: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobEntity {
  id: string;
  title: string;
  companyId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// ドメイン固有リポジトリインターフェース
export interface ICandidateRepository
  extends IBaseRepository<CandidateEntity>,
    ISearchableRepository<CandidateEntity>,
    IPaginatedRepository<CandidateEntity> {
  findByEmail(email: string): Promise<CandidateEntity | null>;
  findByStatus(status: string): Promise<CandidateEntity[]>;
  updateLastLogin(id: string): Promise<boolean>;
}

export interface ICompanyRepository
  extends IBaseRepository<CompanyEntity>,
    ISearchableRepository<CompanyEntity>,
    IPaginatedRepository<CompanyEntity> {
  findByIndustry(industry: string): Promise<CompanyEntity[]>;
}

export interface IJobRepository
  extends IBaseRepository<JobEntity>,
    ISearchableRepository<JobEntity>,
    IPaginatedRepository<JobEntity> {
  findByCompanyId(companyId: string): Promise<JobEntity[]>;
  findActiveJobs(): Promise<JobEntity[]>;
}
