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
    { label: '€¸‡', href: '/candidate' },
    { label: '-ö', href: '/candidate/setting' },
    { label: '·¸Î¢…Ïπ	Ù', href: '/candidate/setting/email' },
    { label: '∫ç≥¸…eõ' }
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
      setError('6An∫ç≥¸…íeõWfO`UD');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // TODO: API call to verify email change
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/candidate/setting/email/complete');
    } catch (error) {
      setError('∫ç≥¸…LcWOBä~[ì');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to resend verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('∫ç·¸Îíç·W~W_');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout
      breadcrumbs={breadcrumbs}
      title="·¸Î¢…Ïπ	Ù"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>∫ç≥¸…íeõ</CardTitle>
            <CardDescription>
              ∞WD·¸Î¢…Ïπk·Uå_6An∫ç≥¸…íeõWfO`UD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>∫ç≥¸…</Label>
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
                ∫ç≥¸…LJKjD4o
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue-600 hover:underline ml-1"
                  disabled={isLoading}
                >
                  ç·
                </button>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/candidate/setting/email')}
                  disabled={isLoading}
                >
                  ;ã
                </Button>
                <Button
                  type="submit"
                  variant="green-gradient"
                  size="figma-default"
                  disabled={isLoading || verificationCode.some(d => !d)}
                >
                  {isLoading ? '∫ç-...' : '∫ç'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}