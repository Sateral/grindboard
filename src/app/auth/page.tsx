import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { SignInButtons } from "@/components/sign-in-buttons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AuthPage() {
  const session = await getCurrentSession();
  if (session) {
    redirect("/board");
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <a
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-xs text-[#979793] transition-colors hover:text-[#e7e7df]"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Grindboard
        </a>

        <Card className="border-white/[0.08] bg-[#141513] shadow-none">
          <CardHeader className="gap-3 pb-6">
            <div className="flex items-center gap-2 text-[#e7e7df]">
              <span className="grid grid-cols-2 gap-0.5" aria-hidden="true">
                <span className="size-1.5 rounded-[1px] bg-[#e7e7df]/30" />
                <span className="size-1.5 rounded-[1px] bg-[#e7e7df]/60" />
                <span className="size-1.5 rounded-[1px] bg-[#e7e7df]/80" />
                <span className="size-1.5 rounded-[1px] bg-[#e7e7df]" />
              </span>
              <span className="text-sm font-medium tracking-tight">
                Grindboard
              </span>
            </div>
            <CardTitle className="text-2xl font-normal tracking-[-0.03em] text-[#e7e7df]">
              Keep your work visible.
            </CardTitle>
            <p className="text-sm leading-6 text-[#979793]">
              Sign in to keep your Applications, solves, and commits in one
              honest picture.
            </p>
          </CardHeader>
          <CardContent>
            <SignInButtons />
            <p className="mt-6 text-center text-[11px] leading-5 text-[#979793]">
              OAuth only. No passwords to remember.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
