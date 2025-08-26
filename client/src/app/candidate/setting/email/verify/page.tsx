'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export default function EmailVerifyPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const breadcrumbs = [
    { label: 'ホーム', href: '/candidate' },
    { label: '設定', href: '/candidate/setting' },
    { label: 'メール設定', href: '/candidate/setting/email' },
    { label: '認証コード入力' }
  ];

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('6桁の認証コードを入力してください');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // TODO: API call to verify email change
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/candidate/setting/email/complete');
    } catch (error) {
      setError('認証に失敗しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to resend verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('認証コードを再送信しました');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      breadcrumbs={breadcrumbs}
      title="メール設定"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>認証コード入力</CardTitle>
            <CardDescription>
              新しいメールアドレスに送信された6桁の認証コードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>認証コード</Label>
                <div className="flex space-x-2">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      required
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="text-sm text-gray-600">
                認証コードが届かない場合は
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue-600 hover:underline ml-1"
                  disabled={isLoading}
                >
                  再送信
                </button>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/candidate/setting/email')}
                  disabled={isLoading}
                >
                  戻る
                </Button>
                <Button
                  type="submit"
                  variant="green-gradient"
                  size="figma-default"
                  disabled={isLoading || verificationCode.some(d => !d)}
                >
                  {isLoading ? '確認中...' : '確認'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}