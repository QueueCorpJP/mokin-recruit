'use client';

import React from 'react';
import { type Room } from '@/lib/rooms';

export interface UseMessageFiltersResult {
  // shared
  filteredRooms: Room[];
  availableGroups: Array<{ value: string; label: string }>;
  // common handlers
  handleSearch: () => void;
  // candidate filters
  companyFilter: string;
  setCompanyFilter: (v: string) => void;
  jobFilter: string;
  setJobFilter: (v: string) => void;
  searchTarget: 'company' | 'job';
  setSearchTarget: (v: 'company' | 'job') => void;
  keyword: string;
  setKeyword: (v: string) => void;
  // company filters
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  groupFilter: string;
  setGroupFilter: (v: string) => void;
}

export function useMessageFilters(
  rooms: Room[],
  isCandidatePage: boolean
): UseMessageFiltersResult {
  // shared
  const [keyword, setKeyword] = React.useState('');
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sortBy] = React.useState<'date' | 'name' | 'company'>('date');

  // candidate side
  const [companyFilter, setCompanyFilter] = React.useState('all');
  const [jobFilter, setJobFilter] = React.useState('all');
  const [searchTarget, setSearchTarget] = React.useState<'company' | 'job'>(
    'company'
  );

  // company side
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [groupFilter, setGroupFilter] = React.useState('all');

  const availableGroups = React.useMemo(() => {
    const uniqueGroups = Array.from(
      new Set(rooms.map(room => room.companyName).filter(Boolean))
    ).map(groupName => ({
      value: groupName,
      label: groupName,
    }));
    return uniqueGroups;
  }, [rooms]);

  const filteredRooms = React.useMemo(() => {
    const filtered = rooms.filter(room => {
      if (isCandidatePage) {
        if (companyFilter !== 'all' && room.companyName !== companyFilter)
          return false;
        if (jobFilter !== 'all' && room.jobTitle !== jobFilter) return false;
        if (keyword) {
          const searchText = (
            searchTarget === 'company' ? room.companyName : room.jobTitle
          ).toLowerCase();
          if (!searchText.includes(keyword.toLowerCase())) return false;
        }
      } else {
        if (statusFilter !== 'all') {
          if (statusFilter === 'unread' && !room.isUnread) return false;
          if (statusFilter === 'read' && room.isUnread) return false;
        }
        if (groupFilter !== 'all' && room.companyName !== groupFilter)
          return false;
        if (searchKeyword) {
          const text = `${room.candidateName} ${
            room.currentCompany || ''
          }`.toLowerCase();
          if (!text.includes(searchKeyword.toLowerCase())) return false;
        }
      }
      return true;
    });

    // sort
    return filtered.sort((a, b) => {
      if (isCandidatePage) {
        if (searchTarget === 'company') {
          return (a.companyName || '').localeCompare(b.companyName || '', 'ja');
        }
        return (a.jobTitle || '').localeCompare(b.jobTitle || '', 'ja');
      }
      switch (sortBy) {
        case 'name':
          return (a.candidateName || '').localeCompare(
            b.candidateName || '',
            'ja'
          );
        case 'company':
          return (a.currentCompany || '').localeCompare(
            b.currentCompany || '',
            'ja'
          );
        case 'date':
        default:
          if (a.isUnread !== b.isUnread) return a.isUnread ? -1 : 1;
          const aTime = a.lastMessageTime
            ? new Date(a.lastMessageTime).getTime()
            : 0;
          const bTime = b.lastMessageTime
            ? new Date(b.lastMessageTime).getTime()
            : 0;
          return bTime - aTime;
      }
    });
  }, [
    rooms,
    isCandidatePage,
    companyFilter,
    jobFilter,
    keyword,
    statusFilter,
    groupFilter,
    searchKeyword,
    sortBy,
    searchTarget,
  ]);

  const handleSearch = React.useCallback(() => {
    setSearchKeyword(keyword);
  }, [keyword]);

  React.useEffect(() => {
    setSearchKeyword('');
  }, []);

  return {
    filteredRooms,
    availableGroups,
    handleSearch,
    companyFilter,
    setCompanyFilter,
    jobFilter,
    setJobFilter,
    searchTarget,
    setSearchTarget,
    keyword,
    setKeyword,
    statusFilter,
    setStatusFilter,
    groupFilter,
    setGroupFilter,
  };
}
