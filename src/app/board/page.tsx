import { redirect } from "next/navigation";

import { AppHeader } from "@/components/account/app-header";
import { SignOutButton } from "@/components/account/sign-out-button";
import { getCurrentSession } from "@/lib/session";

// Session-dependent; rendered on demand, never at build time.
export const dynamic = "force-dynamic";

const inputPaths = [
  {
    title: "Quick-add an Application",
    description:
      "Company, role, URL, and Pipeline status. Every create or update counts as Job-app activity.",
  },
  {
    title: "Log a LeetCode solve",
    description:
      "Paste a problem URL. Title and difficulty are fetched for you; solves paint the day Yellow.",
  },
  {
    title: "Count your public commits",
    description:
      "Pushes to public, non-fork repositories become Green days with zero logging.",
  },
] as const;

export default async function BoardPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/");
  }

  const user = session.user;

  return (
    <div className="mx-auto flex min-h-svh max-w-[1200px] flex-col px-5 sm:px-7 lg:px-12">
      <AppHeader>
        <span className="text-[#979793]">{user.email}</span>
        <SignOutButton />
      </AppHeader>

      <main className="flex-1 pb-16">
        <section className="border-b border-white/[0.07] py-16">
          <p className="text-xs text-[#979793]">
            Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-normal tracking-[-0.03em] text-[#e7e7df]">
            Your empty board is ready.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#979793]">
            The Heatmap, Streak, and day math arrive in the next milestone. This
            screen already knows what you will feed it — three kinds of
            progress, one honest picture.
          </p>
        </section>

        <section className="grid gap-px border-b border-white/[0.07] py-10 sm:grid-cols-3">
          {inputPaths.map((path, index) => (
            <article
              key={path.title}
              className="pr-8 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-white/[0.07]"
            >
              <p className="font-mono text-[10px] text-[#979793]">
                0{index + 1}
              </p>
              <h2 className="mt-3 text-[15px] font-medium text-[#c2c2ba]">
                {path.title}
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-[#979793]">
                {path.description}
              </p>
              <span className="mt-5 inline-block rounded border border-white/10 px-2 py-1 text-[10px] text-[#979793]">
                Arriving with the next milestone
              </span>
            </article>
          ))}
        </section>
      </main>

      <footer className="flex items-center justify-between py-8 text-[11px] text-[#979793]">
        <a href="/" className="font-medium text-[#c2c2ba]">
          Grindboard
        </a>
        <span>A little work. A visible difference.</span>
        <a href="/settings">Settings</a>
      </footer>
    </div>
  );
}
