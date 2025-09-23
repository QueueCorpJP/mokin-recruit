'use client';
import React from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { addNGKeyword } from './actions';

export default function AddNGKeywordButton() {
  const [open, setOpen] = React.useState(false);
  const [complete, setComplete] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('add-ngkeyword-modal', handler);
    return () => window.removeEventListener('add-ngkeyword-modal', handler);
  }, []);

  if (!open && !complete) return null;
  return (
    <>
      {open && (
        <AddNGKeywordModal
          onClose={() => setOpen(false)}
          onComplete={() => {
            setOpen(false);
            setComplete(true);
          }}
        />
      )}
      {complete && (
        <AddNGKeywordCompleteModal onClose={() => setComplete(false)} />
      )}
    </>
  );
}

function AddNGKeywordModal({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const keyword = formData.get('keyword') as string;
    if (!keyword || !keyword.trim()) {
      setError('キーワードを入力してください');
      setLoading(false);
      return;
    }
    const result = await addNGKeyword(keyword);
    if (result.success) {
      onComplete();
    } else {
      setError(result.error || '登録に失敗しました');
    }
    setLoading(false);
  }

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div className='bg-white border border-[#323232] rounded-lg py-[40px] px-[80px] min-w-[400px]'>
        <form ref={formRef} action={handleSubmit}>
          <div className='font-bold text-[20px] text-[#323232] mb-4 text-center'>
            NGキーワード追加
          </div>
          <p className='text-[14px] font-medium text-[#323232] mb-4 text-center'>
            追加したいNGキーワードを入力してください。
          </p>
          <input
            type='text'
            name='keyword'
            className='w-full border border-[#D0D5DD] rounded-lg px-4 py-2 text-[16px] focus:outline-none focus:border-[#00C48D]'
            placeholder='NGキーワードを入力してください。'
            disabled={loading}
            maxLength={100}
          />
          {error && (
            <div className='text-red-500 text-sm mt-2 text-center'>{error}</div>
          )}
          <div className='flex justify-center mt-8 gap-4'>
            <AdminButton
              text='閉じる'
              variant='green-outline'
              onClick={onClose}
              disabled={loading}
              className='w-[180px]'
            />
            <AdminButton
              text={loading ? '追加中...' : '追加'}
              variant='green-gradient'
              disabled={loading}
              onClick={() => formRef.current?.requestSubmit()}
              className='w-[180px]'
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function AddNGKeywordCompleteModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className='bg-white border border-[#323232] rounded-lg px-[80px] py-[40px] min-w-[400px] flex flex-col items-center'
        style={{ width: 400 }}
      >
        <div className='font-bold text-[20px] text-[#323232] mb-4 text-center'>
          追加完了
        </div>
        <div className='text-[16px] text-[#323232] mb-8 text-center'>
          NGキーワードの追加が完了しました。
        </div>
        <AdminButton
          text='NGキーワード一覧に戻る'
          variant='green-gradient'
          className='w-[250px]'
          onClick={() => {
            // モーダルを閉じる前に少し待つ
            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 100);
          }}
        />
      </div>
    </div>
  );
}
