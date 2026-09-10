import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/account/app-header";
import { SignOutButton } from "@/components/account/sign-out-button";
import { DeleteApplicationButton } from "@/components/applications/delete-application-button";
import { PipelineStatusForm } from "@/components/applications/pipeline-status-form";
import { QuickAddApplicationForm } from "@/components/applications/quick-add-form";
import { HeatmapGrid, HeatmapLegend } from "@/components/heatmap/heatmap-grid";
import { getDatabase } from "@/db";
import { applications } from "@/db/schema";
import { applicationActivityContributions } from "@/lib/applications/activity";
import { pipelineStatusLabels } from "@/lib/applications/pipeline";
import { buildHeatmap } from "@/lib/heatmap/heatmap";
import { currentStreak } from "@/lib/heatmap/streak";
import { getCurrentSession } from "@/lib/session";

// Session-dependent; rendered on demand, never at build time.
export const dynamic = "force-dynamic";

const upcomingInputs = [
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
  const timeZone = user.timezone || "UTC";

  const rows = await getDatabase()
    .select()
    .from(applications)
    .where(eq(applications.userId, user.id))
    .orderBy(desc(applications.updatedAt), desc(applications.createdAt));

  const heatmap = buildHeatmap({
    now: new Date(),
    timeZone,
    activity: applicationActivityContributions(rows, timeZone),
  });
  const hitDays = new Set(
    heatmap.weeks
      .flatMap((week) => week.days)
      .filter((day) => day.status === "hit")
      .map((day) => day.date),
  );
  const streak = currentStreak(hitDays, heatmap.today);

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
            {rows.length === 0
              ? "Your empty board is ready."
              : "The work leaves a mark."}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#979793]">
            {rows.length === 0
              ? "Every square starts Gray. Today stays Pending until you record a Hit. This is the honest picture of the work ahead."
              : "Every Application you log or move turns its day Blue. Today stays Pending until you record a Hit."}
          </p>
        </section>

        <section className="border-b border-white/[0.07] py-10">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] text-[#979793]">Your year</p>
              <h2 className="mt-2 text-xl font-normal tracking-[-0.02em] text-[#e7e7df]">
                Show up, then watch it add up.
              </h2>
            </div>
            <p className="font-mono text-[10px] text-[#979793]">
              Current streak: {streak} {streak === 1 ? "day" : "days"}
            </p>
          </div>
          <HeatmapGrid heatmap={heatmap} />
          <HeatmapLegend />
          <p className="mt-5 max-w-xl text-[13px] leading-6 text-[#979793]">
            Gray days are visible. Pending means today is not decided yet. Your
            first Activity will turn this empty board into a record.
          </p>
        </section>

        <section className="grid gap-px border-b border-white/[0.07] py-10 sm:grid-cols-3">
          <article className="pr-8">
            <p className="font-mono text-[10px] text-[#979793]">01</p>
            <h2 className="mt-3 text-[15px] font-medium text-[#c2c2ba]">
              Quick-add an Application
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-[#979793]">
              Company, role, URL, and Pipeline status. Every create or update
              counts as Job-app activity.
            </p>
            <QuickAddApplicationForm />
          </article>
          {upcomingInputs.map((path, index) => (
            <article
              className="pr-8 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-white/[0.07]"
              key={path.title}
            >
              <p className="font-mono text-[10px] text-[#979793]">
                0{index + 2}
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

        <section className="border-b border-white/[0.07] py-10">
          <p className="font-mono text-[10px] text-[#979793]">Pipeline</p>
          <h2 className="mt-2 text-xl font-normal tracking-[-0.02em] text-[#e7e7df]">
            {rows.length === 0
              ? "Nothing in motion yet."
              : `${rows.length} ${rows.length === 1 ? "application" : "applications"} in motion.`}
          </h2>
          {rows.length === 0 ? (
            <p className="mt-3 max-w-lg text-[13px] leading-6 text-[#979793]">
              Quick-add your first Application above. Moving it along the
              Pipeline — Saved, Applied, OA, Interview, Offer — keeps counting
              as activity, automatically.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {rows.map((application) => (
                <li
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
                  key={application.id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-[#e7e7df]">
                      {application.company}
                      <span className="text-[#979793]">
                        {" "}
                        · {application.role}
                      </span>
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-[#979793]">
                      {pipelineStatusLabels[application.status]}
                      {application.deadline
                        ? ` · Due ${application.deadline}`
                        : ""}
                      {application.url ? (
                        <>
                          {" · "}
                          <a
                            className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-[#c2c2ba]"
                            href={application.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Posting
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PipelineStatusForm
                      applicationId={application.id}
                      status={application.status}
                    />
                    <DeleteApplicationButton applicationId={application.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
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
