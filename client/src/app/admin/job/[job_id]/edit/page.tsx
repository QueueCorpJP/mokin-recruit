'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';
import { Modal } from '@/components/ui/mo-dal';
import { LocationModal } from '@/app/company/company/job/LocationModal';
import { JobTypeModal } from '@/app/company/company/job/JobTypeModal';
import { IndustryModal } from '@/app/company/company/job/IndustryModal';
import { FormFields } from '@/app/company/company/job/FormFields';
import { CompanyGroup } from '@/app/company/company/job/types';

interface JobEditPageProps {
  params: Promise<{
    job_id: string;
  }>;
}

interface JobDetail {
  id: string;
  title: string;
  company: string;
  status: '公開中' | '非公開' | '下書き' | '承認待ち';
  publicationType: '一般公開' | 'スカウト専用';
  salaryMin: number;
  salaryMax: number;
  location: string[];
  jobTypes: string[];
  industries: string[];
  jobDescription: string;
  positionSummary: string;
  skills: string;
  otherRequirements: string;
  employmentType: string;
  workingHours: string;
  holidays: string;
  selectionProcess: string;
  appealPoints: string[];
  createdAt: string;
  updatedAt: string;
}

const mockJobDetail: JobDetail = {
  id: '1',
  title: 'React/TypeScript エンジニア',
  company: 'モキン株式会社',
  status: '公開中',
  publicationType: '一般公開',
  salaryMin: 500,
  salaryMax: 800,
  location: ['東京都'],
  jobTypes: ['エンジニア'],
  industries: ['IT・Web・ゲーム'],
  jobDescription: '新規事業の開発・運用を担当していただきます。React/TypeScript を使用したフロントエンド開発がメインの業務となります。',
  positionSummary: '新規事業の中心メンバーとして、技術選定から実装まで幅広く担当していただけます。',
  skills: '・React、TypeScript での開発経験 3年以上\n・チーム開発の経験',
  otherRequirements: '・新しい技術に積極的に取り組める方\n・チームワークを大切にできる方',
  employmentType: '正社員',
  workingHours: '9:00～18:00（所定労働時間8時間）\n休憩：60分\nフレックス制：有',
  holidays: '完全週休2日制（土・日）、祝日\n年間休日：120日\n有給休暇：初年度10日\nその他休暇：年末年始休暇',
  selectionProcess: '1次面接（人事）→ 2次面接（現場責任者）→ 最終面接（役員）',
  appealPoints: ['フレックスタイム制', 'リモートワーク可'],
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20',
};

export default function JobEditPage({ params }: JobEditPageProps) {
  const { job_id } = React.use(params);
  
  // モックの企業グループデータ
  const companyGroups: CompanyGroup[] = [
    { id: '1', group_name: 'モキン株式会社' },
    { id: '2', group_name: 'モキン株式会社（子会社）' }
  ];

  // フォーム状態
  const [group, setGroup] = useState('1');
  const [title, setTitle] = useState(mockJobDetail.title);
  const [images, setImages] = useState<File[]>([]);
  const [jobTypes, setJobTypes] = useState(mockJobDetail.jobTypes);
  const [industries, setIndustries] = useState(mockJobDetail.industries);
  const [jobDescription, setJobDescription] = useState(mockJobDetail.jobDescription);
  const [positionSummary, setPositionSummary] = useState(mockJobDetail.positionSummary);
  const [skills, setSkills] = useState(mockJobDetail.skills);
  const [otherRequirements, setOtherRequirements] = useState(mockJobDetail.otherRequirements);
  const [salaryMin, setSalaryMin] = useState('600');
  const [salaryMax, setSalaryMax] = useState('800');
  const [salaryNote, setSalaryNote] = useState('');
  const [locations, setLocations] = useState(mockJobDetail.location);
  const [locationNote, setLocationNote] = useState('');
  const [selectionProcess, setSelectionProcess] = useState(mockJobDetail.selectionProcess);
  const [employmentType, setEmploymentType] = useState(mockJobDetail.employmentType);
  const [employmentTypeNote, setEmploymentTypeNote] = useState('');
  const [workingHours, setWorkingHours] = useState(mockJobDetail.workingHours);
  const [overtime, setOvertime] = useState('なし');
  const [overtimeMemo, setOvertimeMemo] = useState('');
  const [holidays, setHolidays] = useState(mockJobDetail.holidays);
  const [appealPoints, setAppealPoints] = useState(mockJobDetail.appealPoints);
  const [smoke, setSmoke] = useState('屋内禁煙');
  const [smokeNote, setSmokeNote] = useState('');
  const [resumeRequired, setResumeRequired] = useState<string[]>([]);
  const [memo, setMemo] = useState('');

  // Modal states
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '公開中':
        return 'text-green-600 bg-green-100';
      case '非公開':
        return 'text-gray-600 bg-gray-100';
      case '下書き':
        return 'text-yellow-600 bg-yellow-100';
      case '承認待ち':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `${min}万円 〜 ${max}万円`;
  };

  const TagDisplay: React.FC<{ items: string[] }> = ({ items }) => (
    <div className='flex flex-wrap gap-2 items-center justify-start w-full'>
      {items.map(item => (
        <div
          key={item}
          className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 rounded-[10px]'
        >
          <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
            {item}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className='flex justify-start'>
      <div className=' mr-0 max-w-5xl'>
        {/* ヘッダーセクション */}
        <div className='flex justify-between items-center my-[37px]'>
          <h1 className='text-2xl font-bold text-gray-900'>求人編集</h1>
          <Link href={`/admin/job/${job_id}/edit/confirm`}>
            <button
              type='button'
              className='rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white transition-all duration-200 ease-in-out hover:from-[#12614E] hover:to-[#1A8946] cursor-pointer'
            >
              確認する
            </button>
          </Link>
        </div>

        {/* 選考メモセクション */}
        <div className='w-full mb-[37px]'>
          <div className='flex items-start gap-8'>
            <div className='ml-[10px] w-[200px] flex items-center justify-start'>
              <label className='block text-[16px] font-bold text-gray-900'>
                選考メモ
              </label>
            </div>
            <div className='flex-1'>
              <textarea
                rows={4}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                placeholder='選考に関するメモを入力してください'
              />
              
              {/* 選考メモテーブル */}
              <div className="mt-4 w-full">
                <div className="grid grid-cols-5 gap-0">
                  {/* Row 1 */}
                  <div className="w-[192px] h-[36px] border border-gray-400 bg-gray-100"></div>
                  <div className="w-[192px] h-[36px] border border-gray-400 bg-gray-100"></div>
                  <div className="w-[192px] h-[36px] border border-gray-400 bg-gray-100"></div>
                  
                  {/* Row 2 */}
                  <div className="w-[192px] h-[36px] border border-gray-400 bg-gray-100"></div>
                  <div className="w-[192px] h-[36px] border border-gray-400 bg-gray-100"></div>
                  
                  {/* Row 3 */}
                  <div className="w-[192px] h-[36px] border border-gray-400"></div>
                  <div className="w-[192px] h-[36px] border border-gray-400"></div>
                  <div className="w-[192px] h-[36px] border border-gray-400"></div>
                  
                  {/* Row 4 */}
                  <div className="w-[192px] h-[36px] border border-gray-400"></div>
                  <div className="w-[192px] h-[36px] border border-gray-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col items-start justify-start rounded-[10px]'>
          {/* 求人詳細のヘッダー */}
          <div className='w-full mb-6'>
            <div className='h-0.5 bg-gray-300 mb-4'></div>
            <h2 className='text-2xl font-bold text-gray-900'>求人詳細</h2>
          </div>

          {/* 求人情報テーブル */}
         
         

          {/* 編集フォーム */}
          <div className="w-full">
            <FormFields
              group={group}
              setGroup={setGroup}
              companyGroups={companyGroups}
              title={title}
              setTitle={setTitle}
              images={images}
              setImages={setImages}
              jobTypes={jobTypes}
              setJobTypes={setJobTypes}
              industries={industries}
              setIndustries={setIndustries}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
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
              setLocations={setLocations}
              locationNote={locationNote}
              setLocationNote={setLocationNote}
              selectionProcess={selectionProcess}
              setSelectionProcess={setSelectionProcess}
              employmentType={employmentType}
              setEmploymentType={setEmploymentType}
              employmentTypeNote={employmentTypeNote}
              setEmploymentTypeNote={setEmploymentTypeNote}
              workingHours={workingHours}
              setWorkingHours={setWorkingHours}
              overtime={overtime}
              setOvertime={setOvertime}
              overtimeMemo={overtimeMemo}
              setOvertimeMemo={setOvertimeMemo}
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
          </div>
        </div>

        {/* モーダルコンポーネント */}
        <Modal 
          title="勤務地を選択"
          isOpen={locationModalOpen} 
          onClose={() => setLocationModalOpen(false)}
          onPrimaryAction={() => setLocationModalOpen(false)}
        >
          <LocationModal
            selectedLocations={locations}
            setSelectedLocations={setLocations}
          />
        </Modal>

        <Modal 
          title="職種を選択"
          isOpen={jobTypeModalOpen} 
          onClose={() => setJobTypeModalOpen(false)}
          onPrimaryAction={() => setJobTypeModalOpen(false)}
        >
          <JobTypeModal
            selectedJobTypes={jobTypes}
            onJobTypesChange={setJobTypes}
            onClose={() => setJobTypeModalOpen(false)}
          />
        </Modal>

        <Modal 
          title="業種を選択"
          isOpen={industryModalOpen} 
          onClose={() => setIndustryModalOpen(false)}
          onPrimaryAction={() => setIndustryModalOpen(false)}
        >
          <IndustryModal
            selectedIndustries={industries}
            onIndustriesChange={setIndustries}
            onClose={() => setIndustryModalOpen(false)}
          />
        </Modal>
      </div>
     
    </div>
  );
}