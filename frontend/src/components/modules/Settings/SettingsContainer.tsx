'use client';

import { IUserSettings } from '@/types/settings.interface';
import ProfileSettingsCard from './ProfileSettingsCard';
import SettingsHeader from './SettingsHeader';

interface SettingsContainerProps {
  initialSettings: IUserSettings;
}

export default function SettingsContainer({
  initialSettings,
}: SettingsContainerProps) {
  const { role, profile } = initialSettings;

  return (
    <div className="space-y-6">
      <SettingsHeader
        name={profile.name}
        email={profile.email}
        role={role}
        avatarUrl={profile.avatarUrl}
      />

      <ProfileSettingsCard initialProfile={profile} />
    </div>
  );
}
