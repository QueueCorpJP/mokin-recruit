import { useState } from 'react';
import { CandidateData } from '@/lib/server/candidate/recruitment-queries';

export interface StatusTab {
  id: string;
  label: string;
  active: boolean;
}

export function useRecruitmentPage({
  initialCandidates,
  groupOptions,
  jobOptions,
}: {
  initialCandidates: CandidateData[];
  groupOptions: Array<{ value: string; label: string }>;
  jobOptions: Array<{ value: string; label: string }>;
}) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [excludeDeclined, setExcludeDeclined] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateData | null>(null);
  const [statusTabs, setStatusTabs] = useState<StatusTab[]>([
    { id: 'all', label: 'すべて', active: true },
    { id: 'not_sent', label: 'スカウト未送信', active: false },
    { id: 'waiting', label: '応募待ち', active: false },
    { id: 'applied', label: '応募受付', active: false },
    { id: 'document_passed', label: '書類選考通過', active: false },
    { id: 'first_interview', label: '一次面接通過', active: false },
    { id: 'second_interview', label: '二次面接通過', active: false },
    { id: 'final_interview', label: '最終面接通過', active: false },
    { id: 'offer', label: '内定', active: false },
  ]);
  const [sortOrder, setSortOrder] = useState<'progress' | 'date'>('progress');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 検索・フィルタリング・ソート処理（仮: クライアント側で実装。サーバーAPI化は今後のTODO）
  let filteredCandidates = initialCandidates;
  if (selectedGroup) {
    filteredCandidates = filteredCandidates.filter(
      c => c.groupId === selectedGroup
    );
  }
  if (selectedJob) {
    filteredCandidates = filteredCandidates.filter(
      c => c.jobPostingId === selectedJob
    );
  }
  if (keyword) {
    filteredCandidates = filteredCandidates.filter(
      c =>
        c.name.includes(keyword) ||
        c.company.includes(keyword) ||
        c.experience.some(exp => exp.includes(keyword))
    );
  }
  if (excludeDeclined) {
    // 見送り・辞退された候補者を除外 (selectionProgressに基づいて判定)
    filteredCandidates = filteredCandidates.filter(c => {
      const progress = c.selectionProgress;
      
      if (!progress) return true; // 進捗データがない場合は表示
      
      // 各段階でfailになっている、またはoffer_resultがdeclinedの場合は除外
      return !(
        progress.document_screening_result === 'fail' ||
        progress.first_interview_result === 'fail' ||
        progress.secondary_interview_result === 'fail' ||
        progress.final_interview_result === 'fail' ||
        progress.offer_result === 'declined'
      );
    });
  }
  // ステータスタブによる絞り込み
  const activeStatusTab = statusTabs.find(tab => tab.active);
  if (activeStatusTab && activeStatusTab.id !== 'all') {
    filteredCandidates = filteredCandidates.filter(c => {
      const progress = c.selectionProgress;
      
      switch (activeStatusTab.id) {
        case 'not_sent':
          // スカウト未送信: applicationDate が未設定
          return !c.applicationDate;
        case 'waiting':
          // 応募待ち: applicationDate が設定されているが書類選考結果がない
          return !!c.applicationDate && !progress?.document_screening_result;
        case 'applied':
          // 応募受付: applicationDate が設定されている
          return !!c.applicationDate;
        case 'document_passed':
          // 書類選考通過: document_screening_result が 'pass'
          return progress?.document_screening_result === 'pass';
        case 'first_interview':
          // 一次面接通過: first_interview_result が 'pass'
          return progress?.first_interview_result === 'pass';
        case 'second_interview':
          // 二次面接通過: secondary_interview_result が 'pass'
          return progress?.secondary_interview_result === 'pass';
        case 'final_interview':
          // 最終面接通過: final_interview_result が 'pass'
          return progress?.final_interview_result === 'pass';
        case 'offer':
          // 内定: offer_result が 'accepted'
          return progress?.offer_result === 'accepted';
        default:
          return true;
      }
    });
  }
  // ソート（仮: progress/date）
  if (sortOrder === 'date') {
    filteredCandidates = [...filteredCandidates].sort((a, b) => {
      if (!a.applicationDate || !b.applicationDate) return 0;
      return b.applicationDate.localeCompare(a.applicationDate);
    });
  } else if (sortOrder === 'progress') {
    // 進行度を数値化して降順ソート
    const getProgressScore = (
      c: (typeof filteredCandidates)[number]
    ): number => {
      const progress = c.selectionProgress;
      
      // 内定 > 最終面接通過 > 二次面接通過 > 一次面接通過 > 書類選考通過 > 応募受付 > スカウト未送信
      if (progress?.offer_result === 'accepted') return 6;
      if (progress?.final_interview_result === 'pass') return 5;
      if (progress?.secondary_interview_result === 'pass') return 4;
      if (progress?.first_interview_result === 'pass') return 3;
      if (progress?.document_screening_result === 'pass') return 2;
      if (c.applicationDate) return 1;
      return 0;
    };
    filteredCandidates = [...filteredCandidates].sort(
      (a, b) => getProgressScore(b) - getProgressScore(a)
    );
  }
  // ページネーション
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCandidates.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  // イベントハンドラ
  const handleStatusTabClick = (tabId: string) => {
    setStatusTabs(tabs =>
      tabs.map(tab => ({ ...tab, active: tab.id === tabId }))
    );
  };
  const handleSearch = () => {
    setCurrentPage(1); // 検索時は1ページ目に戻す
  };
  const handleCandidateClick = (candidate: CandidateData) => {
    setSelectedCandidate(candidate);
    setIsMenuOpen(true);
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleJobChange = (candidateId: string, jobId: string) => {
    // TODO: ここで実際のAPIを呼び出して候補者の求人を変更する
    if (process.env.NODE_ENV === 'development') console.log('🔄 求人変更:', { candidateId, jobId });
    // 実装例:
    // - applicationテーブルのjob_posting_idを更新
    // - 成功したら候補者データを再取得
  };

  return {
    selectedGroup,
    setSelectedGroup,
    selectedJob,
    setSelectedJob,
    keyword,
    setKeyword,
    excludeDeclined,
    setExcludeDeclined,
    isMenuOpen,
    setIsMenuOpen,
    selectedCandidate,
    setSelectedCandidate,
    statusTabs,
    setStatusTabs,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedCandidates,
    handleStatusTabClick,
    handleSearch,
    handleCandidateClick,
    handleCloseMenu,
    handlePageChange,
    handleJobChange,
    groupOptions,
    jobOptions,
  };
}