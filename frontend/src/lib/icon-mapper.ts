import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

export const getIconComponent = (iconName: string): LucideIcon => {
  const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon | undefined;

  if (!IconComponent) {
    return Icons.HelpCircle || Icons.CircleDot;
  }
  return IconComponent;
};

