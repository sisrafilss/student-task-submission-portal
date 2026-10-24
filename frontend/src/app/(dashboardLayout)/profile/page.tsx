import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getUserInfo } from '@/services/auth/getUserInfo';
import { getSettings } from '@/services/settings/getSettings';
import ProfileContainer from '@/components/modules/Profile/ProfileContainer';
import ProfileSkeleton from '@/components/modules/Profile/ProfileSkeleton';

export const instant = false;

export const metadata: Metadata = {
  title: 'My Profile | Student Submission Portal',
  description:
    'View your identity, contact information, social links, and academic accreditation.',
};

export default async function ProfilePage() {
  const user = await getUserInfo();

  if (!user) {
    redirect('/login?redirect=/profile');
  }

  const { data: settings } = await getSettings();

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContainer initialSettings={settings} />
    </Suspense>
  );
}
