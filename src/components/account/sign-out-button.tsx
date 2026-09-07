import { signOutAction } from "@/app/actions/auth";

/** Signs the current User out of this device. */
export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded border border-white/15 px-3 py-1.5 text-[13px] text-foreground transition-colors hover:border-white/40 hover:bg-white/5"
      >
        Sign out
      </button>
    </form>
  );
}
