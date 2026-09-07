"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function ConnectGitHubButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function linkGitHub() {
    setPending(true);
    setError(null);
    const result = await authClient.linkSocial({
      provider: "github",
      callbackURL: "/settings",
    });
    if (result.error) {
      setError(
        result.error.message ??
          result.error.statusText ??
          "Could not link GitHub",
      );
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={linkGitHub}
        className="inline-flex h-9 items-center justify-center rounded border border-white/15 bg-white/[0.03] px-4 text-[13px] text-[#e7e7df] transition-colors hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2c2ba] disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? "Connecting…" : "Connect GitHub"}
      </button>
      {error ? (
        <p className="text-xs text-[#e24756]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
