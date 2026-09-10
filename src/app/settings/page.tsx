import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { updateTimezoneAction } from "@/app/actions/auth";
import { AppHeader } from "@/components/account/app-header";
import { ConnectGitHubButton } from "@/components/account/connect-github-button";
import { DeleteAccountButton } from "@/components/account/delete-account-button";
import { SignOutButton } from "@/components/account/sign-out-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { getDatabase } from "@/db";
import { accounts } from "@/db/schema";
import { getCurrentSession } from "@/lib/session";

const timeZones = ["UTC", ...Intl.supportedValuesOf("timeZone")].sort((a, b) =>
  a.localeCompare(b),
);

// Session-dependent; rendered on demand, never at build time.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/");
  }

  const user = session.user;
  const timezone =
    typeof user.timezone === "string" && user.timezone !== ""
      ? user.timezone
      : "UTC";

  const [githubAccount] = await getDatabase()
    .select({ id: accounts.id, accountId: accounts.accountId })
    .from(accounts)
    .where(and(eq(accounts.userId, user.id), eq(accounts.providerId, "github")))
    .limit(1);

  return (
    <div className="mx-auto flex min-h-svh max-w-[1200px] flex-col px-5 sm:px-7 lg:px-12">
      <AppHeader wordmarkHref="/board">
        <a
          href="/board"
          className="text-[#979793] transition-colors hover:text-foreground"
        >
          Back to board
        </a>
        <SignOutButton />
      </AppHeader>

      <main className="w-full max-w-2xl flex-1 pb-16">
        <h1 className="text-3xl font-normal tracking-[-0.03em] text-[#e7e7df]">
          Settings
        </h1>

        <section className="mt-10 border-t border-white/[0.07]">
          <h2 className="mt-8 text-[15px] font-medium text-[#c2c2ba]">
            Account
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 text-[13px] sm:grid-cols-[140px_1fr]">
            <dt className="text-[#979793]">Name</dt>
            <dd className="text-[#e7e7df]">{user.name}</dd>
            <dt className="text-[#979793]">Email</dt>
            <dd className="text-[#e7e7df]">{user.email}</dd>
          </dl>
        </section>

        <section className="mt-10 border-t border-white/[0.07]">
          <h2 className="mt-8 text-[15px] font-medium text-[#c2c2ba]">
            Time zone
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[#979793]">
            Captured from your browser at sign-up. Days on your Heatmap are
            attributed in this time zone, so change it when you travel.
          </p>
          <form
            action={updateTimezoneAction}
            className="mt-5 flex items-end gap-3"
          >
            <div className="flex flex-col gap-2 text-[12px] text-[#979793]">
              <Label htmlFor="timezone-select">IANA time zone</Label>
              <Select defaultValue={timezone} name="timezone">
                <SelectTrigger className="min-w-56" id="timezone-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SubmitButton pendingLabel="Saving…">Save</SubmitButton>
          </form>
        </section>

        <section className="mt-10 border-t border-white/[0.07]">
          <h2 className="mt-8 text-[15px] font-medium text-[#c2c2ba]">
            GitHub
          </h2>
          {githubAccount ? (
            <p className="mt-2 text-[13px] leading-6 text-[#979793]">
              GitHub is connected
              {typeof user.githubUsername === "string" && user.githubUsername
                ? ` as ${user.githubUsername}`
                : ""}
              . Counted commits will be ingested from this account.
            </p>
          ) : (
            <div className="mt-3">
              <p className="text-[13px] leading-6 text-[#979793]">
                Connect GitHub to start counting public commits. Google sign-in
                works without it.
              </p>
              <div className="mt-4">
                <ConnectGitHubButton />
              </div>
            </div>
          )}
        </section>

        <section className="mt-10 border-t border-white/[0.07]">
          <h2 className="mt-8 text-[15px] font-medium text-[#c2c2ba]">
            Danger zone
          </h2>
          <p className="mt-2 max-w-md text-[13px] leading-6 text-[#979793]">
            One button, immediate and permanent. Deletes your account, your
            sessions, and every Application, solve, and commit day you have
            recorded.
          </p>
          <div className="mt-5">
            <DeleteAccountButton />
          </div>
        </section>
      </main>
    </div>
  );
}
