'use client';

import { useState, useTransition } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/ui/password-input';

interface NewPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
  isLoading?: boolean;
}

export function NewPasswordForm({
  onSubmit,
  isLoading = false,
}: NewPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // パスワード強度チェック
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    let score = 0;
    if (checks.length) score++;
    if (checks.hasLetter) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSymbol) score++;

    return {
      score,
      checks,
    };
  };

  const passwordStrength = checkPasswordStrength(password);
  const isPasswordValid =
    passwordStrength.score >= 3 && passwordStrength.checks.length;
  const isConfirmPasswordValid =
    confirmPassword && password === confirmPassword;
  const isFormValid = isPasswordValid && isConfirmPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading || isPending) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await onSubmit(password, confirmPassword);
        setSuccess('パスワードが正常に更新されました。');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'パスワードの更新に失敗しました。'
        );
      }
    });
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return '弱い';
    if (score === 2) return '普通';
    if (score === 3) return '良い';
    return '強い';
  };

  return (
    <div className='w-full max-w-md'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* エラー表示 */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='whitespace-pre-line'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* 成功表示 */}
        {success && (
          <Alert className='border-green-200 bg-green-50 text-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 新しいパスワード */}
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-sm font-medium'>
            新しいパスワード
          </Label>
          <PasswordInput
            id='password'
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder='新しいパスワードを入力'
            disabled={isLoading || isPending}
            required
            showToggle={true}
          />

          {/* パスワード強度インジケーター */}
          {password && (
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <div className='flex-1 bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <span className='text-xs font-medium'>
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>

              {/* 要件チェックリスト */}
              <div className='space-y-1 text-xs'>
                <div
                  className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${passwordStrength.checks.length ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  8文字以上
                </div>
                <div
                  className={`flex items-center gap-1 ${passwordStrength.checks.hasLetter ? 'text-green-600' : 'text-gray-400'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${passwordStrength.checks.hasLetter ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  英字を含む
                </div>
                <div
                  className={`flex items-center gap-1 ${passwordStrength.checks.hasNumber ? 'text-green-600' : 'text-gray-400'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${passwordStrength.checks.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  数字を含む
                </div>
                <div
                  className={`flex items-center gap-1 ${passwordStrength.checks.hasSymbol ? 'text-green-600' : 'text-gray-400'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${passwordStrength.checks.hasSymbol ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  記号を含む（推奨）
                </div>
              </div>
            </div>
          )}
        </div>

        {/* パスワード確認 */}
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword' className='text-sm font-medium'>
            パスワード確認
          </Label>
          <PasswordInput
            id='confirmPassword'
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
            placeholder='パスワードを再入力'
            disabled={isLoading || isPending}
            required
            showToggle={true}
          />

          {/* パスワード一致チェック */}
          {confirmPassword && (
            <div
              className={`flex items-center gap-1 text-xs ${isConfirmPasswordValid ? 'text-green-600' : 'text-red-600'}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isConfirmPasswordValid ? 'bg-green-500' : 'bg-red-500'}`}
              />
              {isConfirmPasswordValid
                ? 'パスワードが一致しています'
                : 'パスワードが一致しません'}
            </div>
          )}
        </div>

        {/* 送信ボタン */}
        <Button
          type='submit'
          className='w-full bg-[#0F9058] hover:bg-[#0D7A4A] text-white font-bold py-3 px-6 rounded-lg transition-colors'
          disabled={!isFormValid || isLoading || isPending}
        >
          {isLoading || isPending ? (
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              更新中...
            </div>
          ) : (
            'パスワードを更新'
          )}
        </Button>

        {/* 注意事項 */}
        <div className='text-xs text-gray-600 text-center space-y-1'>
          <p>• パスワードは8文字以上で設定してください</p>
          <p>• 英数字を含むパスワードを推奨します</p>
          <p>• 記号を含むとより安全です</p>
        </div>
      </form>
    </div>
  );
}
