'use client';

import { useState } from 'react';
import { IUserSettings } from '@/types/settings.interface';
import ProfileSettingsCard from './ProfileSettingsCard';
import SettingsHeader from './SettingsHeader';
import RoleSpecificMetadataCard from './RoleSpecificMetadataCard';

interface SettingsContainerProps {
  initialSettings: IUserSettings;
}

export default function SettingsContainer({
  initialSettings,
}: SettingsContainerProps) {
  const { role, profile } = initialSettings;
  const [headerAvatar, setHeaderAvatar] = useState(profile.avatarUrl || '');

  return (
    <div className="space-y-6">
      <SettingsHeader
        name={profile.name}
        email={profile.email}
        role={role}
        avatarUrl={headerAvatar}
      />

      <RoleSpecificMetadataCard role={role} profile={profile} />

      <ProfileSettingsCard
        initialProfile={profile}
        onAvatarUpdated={(newUrl) => setHeaderAvatar(newUrl)}
      />
    </div>
  );
}
