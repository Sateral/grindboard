"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { browserTimeZone } from "@/lib/timezone";

const providers = [
  { id: "github", label: "GitHub", icon: LogIn },
  { id: "google", label: "Google", icon: LogIn },
] as const;
type Provider = (typeof providers)[number]["id"];

export function SignInButtons() {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(null);
    const result = await authClient.signIn.social({
      provider,
      callbackURL: "/board",
      additionalData: { timezone: browserTimeZone() },
    });
    if (result.error) {
      setError(
        result.error.message ?? result.error.statusText ?? "Sign-in failed",
      );
      setPending(null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {providers.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          disabled={pending !== null}
          onClick={() => signIn(id)}
          className="h-11 w-full justify-start gap-3 border-white/15 bg-white/[0.03] px-4 text-[13px] font-normal text-[#e7e7df] hover:border-white/40 hover:bg-white/[0.07] hover:text-[#e7e7df]"
        >
          <Icon size={16} aria-hidden="true" />
          <span className="flex-1 text-center">
            {pending === id ? "Redirecting…" : `Continue with ${label}`}
          </span>
        </Button>
      ))}
      {error ? (
        <p className="text-xs text-[#e24756]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
