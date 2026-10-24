import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getUserInfo } from '@/services/auth/getUserInfo';
import { getSettings } from '@/services/settings/getSettings';
import SettingsContainer from '@/components/modules/Settings/SettingsContainer';
import SettingsSkeleton from '@/components/modules/Settings/SettingsSkeleton';

export const instant = false;

export const metadata: Metadata = {
  title: 'Account Settings | Student Submission Portal',
  description: 'Manage your profile, security, notifications, and portal preferences.',
};

export default async function SettingsPage() {
  const user = await getUserInfo();

  if (!user) {
    redirect('/login?redirect=/settings');
  }

  const { data: settings } = await getSettings();

  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContainer initialSettings={settings} />
    </Suspense>
  );
}
