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
  const [candidateDetailData, setCandidateDetailData] = useState<unknown>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
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
      c => c.group === selectedGroup
    );
  }
  if (selectedJob) {
    filteredCandidates = filteredCandidates.filter(
      c => c.targetJob === selectedJob
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
    // declinedプロパティが存在する場合のみ除外
    filteredCandidates = filteredCandidates.filter(
      c => typeof (c as any).declined === 'undefined' || !(c as any).declined
    );
  }
  // ソート（仮: progress/date）
  if (sortOrder === 'date') {
    filteredCandidates = [...filteredCandidates].sort((a, b) => {
      if (!a.applicationDate || !b.applicationDate) return 0;
      return b.applicationDate.localeCompare(a.applicationDate);
    });
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
  const handleCandidateClick = async (
    candidate: CandidateData,
    getCandidateDetailAction: (id: string) => Promise<unknown>
  ) => {
    setSelectedCandidate(candidate);
    setIsMenuOpen(true);
    setIsLoadingDetail(true);
    try {
      const detailData = await getCandidateDetailAction(candidate.id);
      setCandidateDetailData(detailData);
    } finally {
      setIsLoadingDetail(false);
    }
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setCandidateDetailData(null);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
    candidateDetailData,
    setCandidateDetailData,
    isLoadingDetail,
    setIsLoadingDetail,
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
    groupOptions,
    jobOptions,
  };
}
