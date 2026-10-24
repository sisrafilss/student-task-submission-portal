import { KeyRound, ShieldAlert } from 'lucide-react';

export default function ChangePasswordHeader() {
  return (
    <div className="text-center space-y-2">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
        <KeyRound className="size-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Update Temporary Password
      </h1>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Your mentor account was onboarded with a one-time temporary password. Please set a secure permanent password to unlock your portal.
      </p>

      <div className="mx-auto mt-3 flex items-center justify-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
        <ShieldAlert className="size-4 shrink-0" />
        <span>Mandatory security requirement before accessing evaluations</span>
      </div>
    </div>
  );
}

