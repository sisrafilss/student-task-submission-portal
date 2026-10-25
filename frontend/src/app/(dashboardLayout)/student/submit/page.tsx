import StudentStandaloneSubmissionContainer from '@/components/modules/Student/Submission/StudentStandaloneSubmissionContainer';
import SubmitFormSkeleton from '@/components/modules/Student/Submission/SubmitFormSkeleton';
import { FolderUp, Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Submit Project | Student Portal',
  description: 'Submit your project deliverables, repository link, and live demonstration for evaluation.',
};

interface StudentSubmitPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function StudentSubmitPage({ searchParams }: StudentSubmitPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FolderUp className="size-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Submission Portal
              <span className="text-xs font-normal py-0.5 px-2 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <Sparkles className="size-3" /> Student View
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submit your project repository, live deployment, and deliverables for mentor evaluation.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<SubmitFormSkeleton />}>
        <StudentStandaloneSubmissionContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

