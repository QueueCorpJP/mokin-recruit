import { requireCompanyAuthForAction } from '@/lib/auth/server';

export default async function SettingsPage() {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20">
        <main className="w-full max-w-[1280px] mx-auto">
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  const [{ getCompanyUserSettings, getCompanyNotificationSettings }, SettingsClient] = await Promise.all([
    import('./actions'),
    import('./SettingsClient'),
  ]);

  const [userSettings, notificationSettings] = await Promise.all([
    getCompanyUserSettings(),
    getCompanyNotificationSettings(),
  ]);

  const Client = SettingsClient.default;
  return <Client initialUserSettings={userSettings} initialNotifications={notificationSettings} />;
}

export const dynamic = 'force-dynamic';
