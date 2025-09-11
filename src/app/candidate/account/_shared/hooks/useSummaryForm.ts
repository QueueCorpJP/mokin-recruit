import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCandidateAuth } from '@/hooks/useClientAuth';
import { summarySchema, SummaryFormData } from '../schemas/summarySchema';
import { getSummaryData, updateSummaryData } from '../../summary/edit/actions';
import { useEditForm } from './useEditForm';

export function useSummaryForm() {
  const { isAuthenticated, candidateUser } = useCandidateAuth();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const form = useEditForm<SummaryFormData>({
    schema: summarySchema,
    defaultValues: { jobSummary: '', selfPr: '' },
    fetchInitialData: async () => {
      const data = await getSummaryData();
      if (!data) return null;
      return {
        jobSummary: data.jobSummary || '',
        selfPr: data.selfPr || '',
      };
    },
    redirectPath: '/candidate/account/summary',
    buildFormData: data => {
      const fd = new FormData();
      fd.append('jobSummary', data.jobSummary || '');
      fd.append('selfPr', data.selfPr || '');
      return fd;
    },
    submitAction: async (fd: FormData) => {
      const result = await updateSummaryData(fd);
      return { success: result.success, error: result.message };
    },
  });

  // 既存互換のため必要項目を返す
  return {
    ...form,
    isDesktop,
    isAuthenticated,
    candidateUser,
  };
}
