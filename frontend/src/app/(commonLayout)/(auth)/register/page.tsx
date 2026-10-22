import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Registration</h1>
        <p className="text-sm text-muted-foreground">Under Development</p>
        <div className="pt-4">
          <Link
            href="/login"
            className="text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

