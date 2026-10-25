import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

export default function SubmitFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border border-border/60 animate-pulse">
        <div className="p-6 border-b border-border/40 bg-muted/20 h-20" />
        <CardContent className="p-6 space-y-5">
          <div className="h-10 w-full bg-muted/30 rounded" />
          <div className="h-10 w-full bg-muted/30 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 w-full bg-muted/30 rounded" />
            <div className="h-10 w-full bg-muted/30 rounded" />
          </div>
          <div className="h-28 w-full bg-muted/30 rounded" />
          <div className="h-10 w-44 bg-muted/40 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

