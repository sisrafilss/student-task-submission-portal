import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, CheckCircle, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              <BookOpen className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Student Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-muted-foreground">
                <CheckCircle className="size-3.5 text-emerald-500" />
                Frontend Environment Ready &bull; Port 3002
              </div>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Student Assignment &amp; Submission Portal
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                Manage your assignments, track submission statuses, and review grades seamlessly with a modern, high-performance portal.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" className="h-11 px-6 font-medium">
                  View Assignments <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-11 px-6 font-medium">
                  Documentation
                </Button>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">Secure Authentication</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Robust JWT and HttpOnly cookie management via Next.js Server actions.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">Zod Validated API</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Strict schema parsing and uniform serverFetch architecture.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">Modular Design</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Feature-isolated modules and reusable shadcn/ui components.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        &copy; 2026 Student Submission Portal. All rights reserved.
      </footer>
    </div>
  );
}
