import React from 'react';

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-semibold text-foreground">{value || 'N/A'}</div>
    </div>
  );
}

