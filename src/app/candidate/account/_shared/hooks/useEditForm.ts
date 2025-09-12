'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodTypeAny } from 'zod';
import { useCandidateAuth } from '@/hooks/useClientAuth';

export interface UseEditFormParams<TForm extends FieldValues> {
  schema: ZodTypeAny;
  defaultValues: DefaultValues<TForm>;
  fetchInitialData: () => Promise<Partial<TForm> | null>;
  redirectPath: string;
  buildFormData: (data: TForm) => FormData;
  submitAction: (formData: FormData) => Promise<
    | { success: boolean; error?: string }
    | {
        success: boolean;
        message: string;
        errors?: Record<string, string[]>;
        data?: unknown;
      }
  >;
}

export interface UseEditFormReturn<TForm extends FieldValues>
  extends UseFormReturn<TForm> {
  isLoading: boolean;
  isSubmitting: boolean;
  onSubmit: (data: TForm) => Promise<void>;
  handleCancel: () => void;
}

export function useEditForm<TForm extends FieldValues>(
  params: UseEditFormParams<TForm>
): UseEditFormReturn<TForm> {
  const {
    schema,
    defaultValues,
    fetchInitialData,
    redirectPath,
    buildFormData,
    submitAction,
  } = params;
  const router = useRouter();
  const {
    isAuthenticated,
    candidateUser,
    loading: authLoading,
  } = useCandidateAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TForm>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<TForm>,
    mode: 'onChange',
  });

  // 認証チェック
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, authLoading, router]);

  // 初期データの取得と反映
  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await fetchInitialData();
        if (data) {
          form.reset({
            ...(defaultValues as any),
            ...data,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: TForm) => {
    setIsSubmitting(true);
    try {
      const formData = buildFormData(data);
      const result = await submitAction(formData);
      if (result.success) {
        router.push(redirectPath);
      } else {
        const message =
          (result as any)?.message ||
          (result as any)?.error ||
          '更新に失敗しました。もう一度お試しください。';
        // eslint-disable-next-line no-alert
        alert(message);
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(redirectPath);
  };

  return {
    ...form,
    isLoading,
    isSubmitting,
    onSubmit,
    handleCancel,
  };
}
