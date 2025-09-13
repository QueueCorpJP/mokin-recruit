import { useCallback } from 'react';
import { useCandidateContext } from '@/contexts/CandidateContext';

// モーダル操作とコールバック処理を管理するhook
export function useCandidateModals() {
  const context = useCandidateContext();

  // 業界選択モーダルの処理
  const handleIndustryConfirm = useCallback((selectedIndustries: string[]) => {
    const { modalState } = context;
    
    if (modalState.targetIndex !== null) {
      if (modalState.targetIndex === -1) {
        // 最新の職歴の業界を更新
        context.updateFormData('recentJobIndustries', selectedIndustries);
      } else if (modalState.targetIndex === -2) {
        // 学歴・経験業種/職種セクションの業種を更新
        context.updateFormData('recentJobIndustries', selectedIndustries);
      } else if (modalState.targetIndex >= 1000 && modalState.targetIndex < 2000) {
        // 職務経歴エントリの業界を更新
        const entryIndex = modalState.targetIndex - 1000;
        context.updateSelectionEntry(entryIndex, 'industries', selectedIndustries);
      } else {
        // Selection entriesの業界を更新 (選考状況)
        context.updateSelectedIndustries(modalState.targetIndex, selectedIndustries);
      }
    }
    context.closeModal();
  }, [context]);

  // 職種選択モーダルの処理
  const handleJobTypeConfirm = useCallback((selectedJobTypes: string[]) => {
    const { modalState } = context;
    
    if (modalState.targetIndex !== null) {
      if (modalState.targetIndex === -1) {
        // 最新の職歴の職種を更新
        context.updateFormData('recentJobTypes', selectedJobTypes);
      } else if (modalState.targetIndex === -2) {
        // 学歴・経験業種/職種セクションの職種を更新
        context.updateFormData('recentJobTypes', selectedJobTypes);
      } else if (modalState.targetIndex >= 2000) {
        // 職務経歴エントリの職種を更新
        const entryIndex = modalState.targetIndex - 2000;
        context.updateSelectionEntry(entryIndex, 'jobTypes', selectedJobTypes);
      } else {
        // Selection entriesの職種を更新 (選考状況用)
        if (process.env.NODE_ENV === 'development') console.warn('Selection entriesには職種フィールドがありません');
      }
    }
    context.closeModal();
  }, [context]);

  // 業界選択モーダルを開く
  const openIndustryModal = useCallback((targetIndex: number) => {
    context.openModal('industry', targetIndex);
  }, [context]);

  // 職種選択モーダルを開く
  const openJobTypeModal = useCallback((targetIndex: number) => {
    context.openModal('jobtype', targetIndex);
  }, [context]);

  // 働き方選択モーダルの処理
  const handleWorkStyleConfirm = useCallback((selectedStyles: { id: string; name: string }[]) => {
    const { modalState } = context;
    
    if (modalState.targetIndex !== null) {
      if (modalState.targetIndex === -4) {
        // 希望の働き方
        const styleNames = selectedStyles.map(style => style.name);
        context.updateFormData('desiredWorkStyles', styleNames);
      }
    }
    context.closeModal();
  }, [context]);

  // 働き方選択モーダルを開く
  const openWorkStyleModal = useCallback((targetIndex: number) => {
    context.openModal('workstyle', targetIndex);
  }, [context]);

  // 選択された業界の削除
  const removeIndustryFromSelection = useCallback((entryIndex: number, industry: string) => {
    const { selectedIndustriesMap } = context;
    const currentIndustries = selectedIndustriesMap[entryIndex] || [];
    const newIndustries = currentIndustries.filter(i => i !== industry);
    
    context.updateSelectedIndustries(entryIndex, newIndustries);
  }, [context]);

  // 職歴業界の削除
  const removeRecentJobIndustry = useCallback((industryIndex: number) => {
    const { formData } = context;
    const newIndustries = formData.recentJobIndustries.filter((_, i) => i !== industryIndex);
    context.updateFormData('recentJobIndustries', newIndustries);
  }, [context]);

  // 職歴職種の削除
  const removeRecentJobType = useCallback((jobTypeIndex: number) => {
    const { formData } = context;
    const newJobTypes = formData.recentJobTypes.filter((_, i) => i !== jobTypeIndex);
    context.updateFormData('recentJobTypes', newJobTypes);
  }, [context]);

  // モーダルの初期値を取得するヘルパー
  const getModalInitialData = useCallback((modalType: 'industry' | 'jobtype' | 'workstyle', targetIndex: number) => {
    const { formData, selectionEntries } = context;
    
    if (modalType === 'industry') {
      if (targetIndex === -1 || targetIndex === -2) {
        return formData.recentJobIndustries;
      } else if (targetIndex >= 1000 && targetIndex < 2000) {
        const entryIndex = targetIndex - 1000;
        return selectionEntries[entryIndex]?.industries || [];
      } else if (targetIndex >= 0 && targetIndex < selectionEntries.length) {
        return context.selectedIndustriesMap[targetIndex] || [];
      }
    } else if (modalType === 'jobtype') {
      if (targetIndex === -1 || targetIndex === -2) {
        return formData.recentJobTypes;
      } else if (targetIndex >= 2000) {
        const entryIndex = targetIndex - 2000;
        return selectionEntries[entryIndex]?.jobTypes || [];
      }
    } else if (modalType === 'workstyle') {
      if (targetIndex === -4) {
        // 希望の働き方の初期値を変換
        return (formData.desiredWorkStyles || []).map(style => ({
          id: style.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: style
        }));
      }
    }
    
    return [];
  }, [context]);

  return {
    modalState: context.modalState,
    selectedIndustriesMap: context.selectedIndustriesMap,
    handleIndustryConfirm,
    handleJobTypeConfirm,
    handleWorkStyleConfirm,
    openIndustryModal,
    openJobTypeModal,
    openWorkStyleModal,
    closeModal: context.closeModal,
    removeIndustryFromSelection,
    removeRecentJobIndustry,
    removeRecentJobType,
    getModalInitialData,
  };
}