'use client';

import { IUserSettings } from '@/types/settings.interface';
import ProfileHeaderCard from './ProfileHeaderCard';
import ProfileBioCard from './ProfileBioCard';
import ProfileContactSocialCard from './ProfileContactSocialCard';
import ProfileRoleDetailsCard from './ProfileRoleDetailsCard';

interface ProfileContainerProps {
  initialSettings: IUserSettings;
}

export default function ProfileContainer({
  initialSettings,
}: ProfileContainerProps) {
  const { role, profile } = initialSettings;

  return (
    <div className="space-y-6">
      <ProfileHeaderCard role={role} profile={profile} />
      <ProfileRoleDetailsCard role={role} profile={profile} />
      <ProfileBioCard bio={profile.bio} />
      <ProfileContactSocialCard profile={profile} />
    </div>
  );
}
