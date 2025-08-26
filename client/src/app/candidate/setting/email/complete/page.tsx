import React from 'react';
import Link from 'next/link';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function EmailCompletePage() {
  const breadcrumbs = [
    { label: 'Ûüà', href: '/candidate' },
    { label: '-š', href: '/candidate/setting' },
    { label: 'áüë¢Éì¹	ô', href: '/candidate/setting/email' },
    { label: '	ôŒ†' }
  ];

  return (
    <SettingsLayout
      breadcrumbs={breadcrumbs}
      title="áüë¢Éì¹	ô"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">áüë¢Éì¹n	ôLŒ†W~W_</CardTitle>
            <CardDescription className="mt-2">
              °WDáüë¢Éì¹gí°¤ógM‹ˆFkjŠ~W_
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-600 mb-1">°WDáüë¢Éì¹</div>
              <div className="font-medium text-gray-900">new-email@example.com</div>
            </div>

            <div className="space-y-3">
              <Link href="/candidate/setting" className="block">
                <Button variant="green-gradient" size="figma-default" className="w-full">
                  -š;bk;‹
                </Button>
              </Link>
              <Link href="/candidate" className="block">
                <Button variant="outline" className="w-full">
                  Ûüàx;‹
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}