import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { summarySchema, SummaryFormData } from '../schemas/summarySchema';
import { getSummaryData, updateSummaryData } from '../../summary/edit/actions';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCandidateAuth } from '@/hooks/useClientAuth';

export function useSummaryForm() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // useForm初期化
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      jobSummary: '',
      selfPr: '',
    },
  });

  // 認証チェック
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  // 初期データ取得
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getSummaryData();
        if (data) {
          reset({
            jobSummary: data.jobSummary || '',
            selfPr: data.selfPr || '',
          });
        }
      } catch (error) {
        // エラー時は何もしない
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [reset]);

  // 送信ハンドラ
  const onSubmit = async (data: SummaryFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobSummary', data.jobSummary || '');
      formData.append('selfPr', data.selfPr || '');
      const result = await updateSummaryData(formData);
      if (result.success) {
        router.push('/candidate/account/summary');
      } else {
        alert('更新に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      alert('更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // キャンセル
  const handleCancel = () => {
    router.push('/candidate/account/summary');
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleCancel,
    onSubmit,
    reset,
    isLoading,
    isDesktop,
    isAuthenticated,
    candidateUser,
  };
}
