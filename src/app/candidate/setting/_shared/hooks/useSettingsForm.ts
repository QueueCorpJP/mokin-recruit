'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

export interface UseSettingsFormOptions<TState> {
  enabled: boolean;
  load: () => Promise<TState | null>;
  buildFormData: (state: TState) => FormData;
  save: (formData: FormData) => Promise<void>;
}

export interface UseSettingsFormResult<TState> {
  state: TState;
  setState: React.Dispatch<React.SetStateAction<TState>>;
  originalState: TState | null;
  settingsLoading: boolean;
  isPending: boolean;
  error: string | null;
  setError: (value: string | null) => void;
  hasChanges: boolean;
  handleSave: () => void;
}

function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  const keysA = Object.keys(a) as Array<keyof T>;
  const keysB = Object.keys(b) as Array<keyof T>;
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

export function useSettingsForm<TState extends Record<string, any>>(
  options: UseSettingsFormOptions<TState>
): UseSettingsFormResult<TState> {
  const { enabled, load, buildFormData, save } = options;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [state, setState] = useState<TState>({} as TState);
  const [originalState, setOriginalState] = useState<TState | null>(null);

  // Avoid re-running effects due to new function identities on each render
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!enabled) return;
      setSettingsLoading(true);
      try {
        const loaded = await loadRef.current();
        if (!mounted) return;
        if (loaded) {
          setState(loaded as TState);
          setOriginalState(loaded as TState);
        }
      } catch (e) {
        if (!mounted) return;
        setError('設定の取得に失敗しました');
        console.error('[useSettingsForm] load error:', e);
      } finally {
        if (mounted) setSettingsLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [enabled]);

  const hasChanges = useMemo(() => {
    if (!originalState) return false;
    try {
      return !shallowEqual(state, originalState);
    } catch {
      // フォールバック（安全側でtrue評価）
      return true;
    }
  }, [state, originalState]);

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = buildFormData(state);
        await save(formData);
      } catch (err) {
        // Next.js redirectエラーは正常系
        if (
          err instanceof Error &&
          (err.message.includes('NEXT_REDIRECT') ||
            (err as any).digest?.includes('NEXT_REDIRECT'))
        ) {
          return;
        }
        setError(err instanceof Error ? err.message : '保存に失敗しました');
      }
    });
  };

  return {
    state,
    setState,
    originalState,
    settingsLoading,
    isPending,
    error,
    setError,
    hasChanges,
    handleSave,
  };
}
