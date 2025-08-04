import { getCompanyJobs, getCompanyGroups } from './actions';
import JobClient from './JobClient';

interface JobServerComponentProps {
  searchParams: Promise<{
    status?: string;
    groupId?: string;
    scope?: string;
    search?: string;
  }>;
}

export default async function JobServerComponent({ searchParams }: JobServerComponentProps) {
  // searchParamsをawait
  const params = await searchParams;
  
  // パラメータ解析
  const conditions = {
    status: params.status || 'すべて',
    groupId: params.groupId || 'すべて',
    scope: params.scope || 'すべて',
    search: params.search || '',
  };

  // データ取得
  const [jobsResponse, groupsResponse] = await Promise.all([
    getCompanyJobs(conditions),
    getCompanyGroups()
  ]);

  // エラーハンドリング
  if (!jobsResponse.success || !groupsResponse.success) {
    return (
      <div className='w-full flex flex-col items-center justify-center p-8'>
        <div className='text-red-600 text-center'>
          <h2 className='text-xl font-bold mb-2'>エラーが発生しました</h2>
          <p>{jobsResponse.error || groupsResponse.error}</p>
        </div>
      </div>
    );
  }

  // 停止状態の求人を除外（「すべて」選択時でも停止状態は非表示）
  const filteredJobs = (jobsResponse.data || []).filter((job: any) => job.status !== 'CLOSED');

  // クライアントコンポーネントに渡す
  return (
    <JobClient 
      initialJobs={filteredJobs}
      initialGroups={groupsResponse.data || []}
      initialConditions={conditions}
    />
  );
}