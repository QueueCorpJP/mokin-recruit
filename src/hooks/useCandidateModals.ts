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
      } else if (modalState.targetIndex === -3) {
        // 希望業種を更新
        context.updateFormData('desiredIndustries', selectedIndustries);
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
      } else if (modalState.targetIndex === -5) {
        // 希望職種を更新
        context.updateFormData('desiredJobTypes', selectedJobTypes);
      } else if (modalState.targetIndex >= 2000) {
        // 職務経歴エントリの職種を更新
        const entryIndex = modalState.targetIndex - 2000;
        context.updateSelectionEntry(entryIndex, 'jobTypes', selectedJobTypes);
      } else {
        // Selection entriesの職種を更新 (選考状況用)
        console.warn('Selection entriesには職種フィールドがありません');
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

  // 勤務地選択モーダルの処理
  const handleWorkLocationConfirm = useCallback((selectedLocations: { id: string; name: string }[]) => {
    const { modalState } = context;

    if (modalState.targetIndex !== null) {
      if (modalState.targetIndex === -6) {
        // 希望勤務地
        const locationNames = selectedLocations.map(location => location.name);
        context.updateFormData('desiredLocations', locationNames);
      }
    }
    context.closeModal();
  }, [context]);

  // 働き方選択モーダルを開く
  const openWorkStyleModal = useCallback((targetIndex: number) => {
    context.openModal('workstyle', targetIndex);
  }, [context]);

  // 勤務地選択モーダルを開く
  const openWorkLocationModal = useCallback((targetIndex: number) => {
    context.openModal('worklocation', targetIndex);
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

  // 希望業種の削除
  const removeDesiredIndustry = useCallback((industryIndex: number) => {
    const { formData } = context;
    const newIndustries = (formData.desiredIndustries || []).filter((_, i) => i !== industryIndex);
    context.updateFormData('desiredIndustries', newIndustries);
  }, [context]);

  // 希望職種の削除
  const removeDesiredJobType = useCallback((jobTypeIndex: number) => {
    const { formData } = context;
    const newJobTypes = (formData.desiredJobTypes || []).filter((_, i) => i !== jobTypeIndex);
    context.updateFormData('desiredJobTypes', newJobTypes);
  }, [context]);

  // 希望勤務地の削除
  const removeDesiredLocation = useCallback((locationIndex: number) => {
    const { formData } = context;
    const newLocations = (formData.desiredLocations || []).filter((_, i) => i !== locationIndex);
    context.updateFormData('desiredLocations', newLocations);
  }, [context]);

  // モーダルの初期値を取得するヘルパー
  const getModalInitialData = useCallback((modalType: 'industry' | 'jobtype' | 'workstyle' | 'worklocation', targetIndex: number) => {
    const { formData, selectionEntries } = context;
    
    if (modalType === 'industry') {
      if (targetIndex === -1 || targetIndex === -2) {
        return formData.recentJobIndustries;
      } else if (targetIndex === -3) {
        return formData.desiredIndustries || [];
      } else if (targetIndex >= 1000 && targetIndex < 2000) {
        const entryIndex = targetIndex - 1000;
        return selectionEntries[entryIndex]?.industries || [];
      } else if (targetIndex >= 0 && targetIndex < selectionEntries.length) {
        return context.selectedIndustriesMap[targetIndex] || [];
      }
    } else if (modalType === 'jobtype') {
      if (targetIndex === -1 || targetIndex === -2) {
        return formData.recentJobTypes;
      } else if (targetIndex === -5) {
        return formData.desiredJobTypes || [];
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
    } else if (modalType === 'worklocation') {
      if (targetIndex === -6) {
        // 希望勤務地の初期値を変換
        return (formData.desiredLocations || []).map(location => ({
          id: location.toLowerCase().replace(/[^a-z0-9]/g, ''),
          name: location
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
    handleWorkLocationConfirm,
    openIndustryModal,
    openJobTypeModal,
    openWorkStyleModal,
    openWorkLocationModal,
    closeModal: context.closeModal,
    removeIndustryFromSelection,
    removeRecentJobIndustry,
    removeRecentJobType,
    removeDesiredIndustry,
    removeDesiredJobType,
    removeDesiredLocation,
    getModalInitialData,
  };
}