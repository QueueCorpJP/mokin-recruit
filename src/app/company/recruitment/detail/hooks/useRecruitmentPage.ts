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
    // declinedプロパティが存在する場合のみ除外（型定義にない場合は拡張型で対応）
    filteredCandidates = filteredCandidates.filter(
      c =>
        typeof (c as { declined?: boolean }).declined === 'undefined' ||
        !(c as { declined?: boolean }).declined
    );
  }
  // ステータスタブによる絞り込み
  const activeStatusTab = statusTabs.find(tab => tab.active);
  if (activeStatusTab && activeStatusTab.id !== 'all') {
    filteredCandidates = filteredCandidates.filter(c => {
      switch (activeStatusTab.id) {
        case 'not_sent':
          // スカウト未送信: applicationDate が未設定
          return !c.applicationDate;
        case 'waiting':
          // 応募待ち: applicationDate が設定されていて、firstScreening などが未設定
          return !!c.applicationDate && !c.firstScreening;
        case 'applied':
          // 応募受付: applicationDate が設定されている
          return !!c.applicationDate;
        case 'document_passed':
          // 書類選考通過: firstScreening が設定されている
          return !!c.firstScreening;
        case 'first_interview':
          // 一次面接通過: secondScreening が設定されている
          return !!c.secondScreening;
        case 'second_interview':
          // 二次面接通過: finalScreening が設定されている
          return !!c.finalScreening;
        case 'final_interview':
          // 最終面接通過: offer が設定されている
          return !!c.offer;
        case 'offer':
          // 内定: offer が設定されている
          return !!c.offer;
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
      // 入社 > 内定 > 最終面接通過 > 二次面接通過 > 一次面接通過 > 書類選考通過 > 応募受付 > スカウト未送信
      // ※型定義に入社・辞退などがなければ offer まで
      if ((c as { joined?: boolean }).joined) return 7;
      if (c.offer) return 6;
      if (c.finalScreening) return 5;
      if (c.secondScreening) return 4;
      if (c.firstScreening) return 3;
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
