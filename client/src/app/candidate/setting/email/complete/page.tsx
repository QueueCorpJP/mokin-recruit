import React from 'react';
import Link from 'next/link';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function EmailCompletePage() {
  const breadcrumbs = [
    { label: 'ホーム', href: '/candidate' },
    { label: '設定', href: '/candidate/setting' },
    { label: 'メール設定', href: '/candidate/setting/email' },
    { label: '完了' }
  ];

  return (
    <SettingsLayout
      breadcrumbs={breadcrumbs}
      title="メール設定"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">メールアドレスの変更が完了しました</CardTitle>
            <CardDescription className="mt-2">
              新しいメールアドレスでのログインが可能になりました
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-600 mb-1">新しいメールアドレス</div>
              <div className="font-medium text-gray-900">new-email@example.com</div>
            </div>

            <div className="space-y-3">
              <Link href="/candidate/setting" className="block">
                <Button variant="green-gradient" size="figma-default" className="w-full">
                  設定画面に戻る
                </Button>
              </Link>
              <Link href="/candidate" className="block">
                <Button variant="outline" className="w-full">
                  ホームに戻る
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}