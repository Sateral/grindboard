"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { browserTimeZone } from "@/lib/timezone";

const providers = ["github", "google"] as const;
type Provider = (typeof providers)[number];

const providerLabel: Record<Provider, string> = {
  github: "GitHub",
  google: "Google",
};

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
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-3">
        {providers.map((provider) => (
          <button
            key={provider}
            type="button"
            disabled={pending !== null}
            onClick={() => signIn(provider)}
            className="inline-flex h-10 items-center gap-2 rounded border border-white/15 bg-white/[0.03] px-4 text-[13px] text-[#e7e7df] transition-colors hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2c2ba] disabled:pointer-events-none disabled:opacity-50"
          >
            {pending === provider
              ? "Redirecting…"
              : `Continue with ${providerLabel[provider]}`}
          </button>
        ))}
      </div>
      {error ? (
        <p className="text-xs text-[#e24756]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
