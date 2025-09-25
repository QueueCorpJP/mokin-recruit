'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface JobDetailViewProps {
  jobDetail: {
    id: string;
    title: string;
    job_description: string;
    position_summary?: string;
    salary_min?: number;
    salary_max?: number;
    salary_note?: string;
    employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
    employment_type_note?: string;
    working_hours?: string;
    overtime_info?: string;
    holidays?: string;
    remote_work_available?: boolean;
    required_skills?: string;
    preferred_skills?: string;
    selection_process?: string;
    company_attractions?: string[];
    smoking_policy?: string;
    smoking_policy_note?: string;
    required_documents?: string[];
    location_note?: string;
    work_location?: string[];
    job_type?: string[];
    industry?: string[];
    image_urls?: string[];
    published_at?: string;
    created_at: string;
    updated_at: string;
    company_account: {
      id: string;
      company_name: string;
      industry: string;
      headquarters_address?: string;
      company_overview?: string;
    } | null;
    company_group: {
      id: string;
      group_name: string;
      description?: string;
    } | null;
  };
}

const employmentTypeMap = {
  FULL_TIME: '正社員',
  PART_TIME: 'アルバイト・パート',
  CONTRACT: '契約社員',
  INTERN: 'インターン',
};

export function JobDetailView({ jobDetail }: JobDetailViewProps) {
  const formatSalary = () => {
    if (jobDetail.salary_note) {
      return jobDetail.salary_note;
    }
    if (jobDetail.salary_min && jobDetail.salary_max) {
      return `${jobDetail.salary_min.toLocaleString()}万円 ～ ${jobDetail.salary_max.toLocaleString()}万円`;
    }
    if (jobDetail.salary_min) {
      return `${jobDetail.salary_min.toLocaleString()}万円 ～`;
    }
    if (jobDetail.salary_max) {
      return `～ ${jobDetail.salary_max.toLocaleString()}万円`;
    }
    return '応相談';
  };

  const handleApply = () => {
    // TODO: 応募処理を実装
    console.log('応募処理:', jobDetail.id);
  };

  const handleFavorite = () => {
    // TODO: お気に入り処理を実装
    console.log('お気に入り処理:', jobDetail.id);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto p-4 md:p-6'>
        {/* ヘッダー部分 */}
        <div className='bg-white rounded-lg shadow-sm mb-6 p-6'>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* 企業画像 */}
            <div className='flex-shrink-0'>
              <div className='w-full md:w-48 h-32 md:h-32 bg-gray-200 rounded-lg overflow-hidden'>
                {jobDetail.image_urls?.[0] ? (
                  <Image
                    src={jobDetail.image_urls[0]}
                    alt={
                      jobDetail.company_account?.company_name || 'Company Logo'
                    }
                    width={800}
                    height={400}
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                    企業ロゴ
                  </div>
                )}
              </div>
            </div>

            {/* 求人基本情報 */}
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                {jobDetail.title}
              </h1>

              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-green-600 mb-1'>
                  {jobDetail.company_account?.company_name}
                </h2>
                {jobDetail.company_account?.headquarters_address && (
                  <p className='text-gray-600 text-sm'>
                    {jobDetail.company_account.headquarters_address}
                  </p>
                )}
              </div>

              {/* タグ */}
              <div className='flex flex-wrap gap-2 mb-4'>
                {jobDetail.job_type?.map((type, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm'
                  >
                    {type}
                  </span>
                ))}
                {jobDetail.industry?.map((ind, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
                  >
                    {ind}
                  </span>
                ))}
                {jobDetail.remote_work_available && (
                  <span className='px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm'>
                    リモートワーク可
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className='flex flex-col sm:flex-row gap-3 mt-6'>
            <Button
              onClick={handleApply}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white'
              size='lg'
            >
              この求人に応募する
            </Button>
            <Button
              onClick={handleFavorite}
              variant='outline'
              className='border-green-600 text-green-600 hover:bg-green-50'
            >
              お気に入りに追加
            </Button>
          </div>
        </div>

        {/* 求人詳細情報 */}
        <div className='space-y-6'>
          {/* 求人概要 */}
          {jobDetail.position_summary && (
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>求人概要</h3>
                <p className='text-gray-700 whitespace-pre-line'>
                  {jobDetail.position_summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 仕事内容 */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>仕事内容</h3>
              <div className='text-gray-700 whitespace-pre-line'>
                {jobDetail.job_description}
              </div>
            </CardContent>
          </Card>

          {/* 基本情報 */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>基本情報</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <dt className='font-medium text-gray-900 mb-1'>雇用形態</dt>
                  <dd className='text-gray-700 mb-3'>
                    {employmentTypeMap[jobDetail.employment_type]}
                    {jobDetail.employment_type_note && (
                      <span className='block text-sm text-gray-600'>
                        {jobDetail.employment_type_note}
                      </span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className='font-medium text-gray-900 mb-1'>給与</dt>
                  <dd className='text-gray-700 mb-3'>{formatSalary()}</dd>
                </div>

                {jobDetail.work_location &&
                  jobDetail.work_location.length > 0 && (
                    <div>
                      <dt className='font-medium text-gray-900 mb-1'>勤務地</dt>
                      <dd className='text-gray-700 mb-3'>
                        {jobDetail.work_location.join('、')}
                        {jobDetail.location_note && (
                          <span className='block text-sm text-gray-600'>
                            {jobDetail.location_note}
                          </span>
                        )}
                      </dd>
                    </div>
                  )}

                {jobDetail.working_hours && (
                  <div>
                    <dt className='font-medium text-gray-900 mb-1'>勤務時間</dt>
                    <dd className='text-gray-700 mb-3'>
                      {jobDetail.working_hours}
                    </dd>
                  </div>
                )}

                {jobDetail.overtime_info && (
                  <div>
                    <dt className='font-medium text-gray-900 mb-1'>残業</dt>
                    <dd className='text-gray-700 mb-3'>
                      {jobDetail.overtime_info}
                    </dd>
                  </div>
                )}

                {jobDetail.holidays && (
                  <div>
                    <dt className='font-medium text-gray-900 mb-1'>
                      休日・休暇
                    </dt>
                    <dd className='text-gray-700 mb-3'>{jobDetail.holidays}</dd>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 求められるスキル・経験 */}
          {(jobDetail.required_skills || jobDetail.preferred_skills) && (
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>
                  求められるスキル・経験
                </h3>

                {jobDetail.required_skills && (
                  <div className='mb-4'>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      必須スキル
                    </h4>
                    <p className='text-gray-700 whitespace-pre-line'>
                      {jobDetail.required_skills}
                    </p>
                  </div>
                )}

                {jobDetail.preferred_skills && (
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      歓迎スキル
                    </h4>
                    <p className='text-gray-700 whitespace-pre-line'>
                      {jobDetail.preferred_skills}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* アピールポイント */}
          {jobDetail.company_attractions &&
            jobDetail.company_attractions.length > 0 && (
              <Card>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>
                    この求人のアピールポイント
                  </h3>
                  <ul className='space-y-2'>
                    {jobDetail.company_attractions.map((point, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-green-600 mr-2'>✓</span>
                        <span className='text-gray-700'>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {/* 選考プロセス */}
          {jobDetail.selection_process && (
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>選考プロセス</h3>
                <p className='text-gray-700 whitespace-pre-line'>
                  {jobDetail.selection_process}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 応募書類・その他 */}
          {(jobDetail.required_documents?.length ||
            jobDetail.smoking_policy) && (
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>応募書類・その他</h3>

                {jobDetail.required_documents &&
                  jobDetail.required_documents.length > 0 && (
                    <div className='mb-4'>
                      <h4 className='font-medium text-gray-900 mb-2'>
                        必要書類
                      </h4>
                      <ul className='text-gray-700 space-y-1'>
                        {jobDetail.required_documents.map((doc, index) => (
                          <li key={index}>・{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {jobDetail.smoking_policy && (
                  <div>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      喫煙に関して
                    </h4>
                    <p className='text-gray-700'>
                      {jobDetail.smoking_policy}
                      {jobDetail.smoking_policy_note && (
                        <span className='block text-sm text-gray-600 mt-1'>
                          {jobDetail.smoking_policy_note}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 企業情報 */}
          {jobDetail.company_account && (
            <Card>
              <CardContent className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>企業情報</h3>
                <div className='space-y-3'>
                  <div>
                    <dt className='font-medium text-gray-900'>企業名</dt>
                    <dd className='text-gray-700'>
                      {jobDetail.company_account.company_name}
                    </dd>
                  </div>

                  <div>
                    <dt className='font-medium text-gray-900'>業界</dt>
                    <dd className='text-gray-700'>
                      {jobDetail.company_account.industry}
                    </dd>
                  </div>

                  {jobDetail.company_account.headquarters_address && (
                    <div>
                      <dt className='font-medium text-gray-900'>本社所在地</dt>
                      <dd className='text-gray-700'>
                        {jobDetail.company_account.headquarters_address}
                      </dd>
                    </div>
                  )}

                  {jobDetail.company_account.company_overview && (
                    <div>
                      <dt className='font-medium text-gray-900'>会社概要</dt>
                      <dd className='text-gray-700 whitespace-pre-line'>
                        {jobDetail.company_account.company_overview}
                      </dd>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 固定フッター */}
        <div className='fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden'>
          <Button
            onClick={handleApply}
            className='w-full bg-green-600 hover:bg-green-700 text-white'
            size='lg'
          >
            この求人に応募する
          </Button>
        </div>

        {/* スマホ用の余白 */}
        <div className='h-20 md:hidden'></div>
      </div>
    </div>
  );
}
