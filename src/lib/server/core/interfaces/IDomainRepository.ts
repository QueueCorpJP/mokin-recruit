import {
  IBaseRepository,
  IPaginatedRepository,
  ISearchableRepository,
} from './IRepository';

// MVPスキーマに対応したシンプルな候補者エンティティ
export interface CandidateEntity {
  id: string;
  email: string;
  password_hash: string;
  last_name: string;
  first_name: string;
  phone_number?: string;
  current_residence?: string;
  current_salary?: string;
  desired_salary?: string;
  skills: string[];
  experience_years: number;
  desired_industries: string[];
  desired_job_types: string[];
  desired_locations: string[];
  scout_reception_enabled: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// MVPスキーマ対応の候補者作成データ
export interface CreateCandidateData {
  email: string;
  password_hash: string;
  last_name: string;
  first_name: string;
  phone_number?: string;
  current_residence?: string;
  current_salary?: string;
  desired_salary?: string;
  skills?: string[];
  experience_years?: number;
  desired_industries?: string[];
  desired_job_types?: string[];
  desired_locations?: string[];
  scout_reception_enabled?: boolean;
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
export interface ICandidateRepository {
  findById(id: string): Promise<CandidateEntity | null>;
  findByEmail(email: string): Promise<CandidateEntity | null>;
  create(candidateData: CreateCandidateData): Promise<CandidateEntity>;
  update(
    id: string,
    updates: Partial<CandidateEntity>
  ): Promise<CandidateEntity>;
  delete(id: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<boolean>;
  search(filters: {
    skills?: string[];
    desired_industries?: string[];
    desired_locations?: string[];
    experience_years_min?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<CandidateEntity[]>;
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
