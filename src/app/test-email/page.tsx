'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testSendGridEmail } from './actions';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    if (!email) {
      alert('メールアドレスを入力してください');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const testResult = await testSendGridEmail(email);
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: '予期しないエラーが発生しました',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-6'>SendGrid送信テスト</h1>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            テスト送信先メールアドレス:
          </label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='your-email@example.com'
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleTest}
          disabled={isLoading || !email}
          className='w-full'
        >
          {isLoading ? 'テストメール送信中...' : 'SendGridテスト実行'}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-md ${result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}
          >
            <h3 className='font-medium mb-2'>
              {result.success ? '✅ 送信成功' : '❌ 送信失敗'}
            </h3>
            {result.success ? (
              <div>
                <p>テストメールを送信しました！</p>
                {result.messageId && (
                  <p className='text-sm text-gray-600'>
                    Message ID: {result.messageId}
                  </p>
                )}
                <p className='text-sm mt-2'>
                  メールボックスを確認してください（迷惑メールフォルダも確認）
                </p>
              </div>
            ) : (
              <p className='text-red-700'>{result.error}</p>
            )}
          </div>
        )}
      </div>

      <div className='mt-8 p-4 bg-gray-100 rounded-md'>
        <h3 className='font-medium mb-2'>確認項目:</h3>
        <ul className='text-sm space-y-1'>
          <li>• メールが受信できたか</li>
          <li>• 6桁のOTPコードが表示されているか</li>
          <li>• HTMLレイアウトが正しく表示されているか</li>
          <li>• 有効期限が設定されているか</li>
        </ul>
      </div>
    </div>
  );
}
