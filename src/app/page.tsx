import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

const activities = [
  { name: "Applications", color: "blue" },
  { name: "LeetCode solves", color: "yellow" },
  { name: "Counted commits", color: "green" },
] as const;

// Deterministic illustration only; real calendar and activity data come later.
const previewDays = Array.from({ length: 364 }, (_, day) => {
  const week = Math.floor(day / 7);
  const seed = (day * 17 + week * 13) % 101;
  const active = seed < 22 + week * 0.9;
  return {
    id: `sample-day-${day}`,
    color: active ? activities[seed % activities.length].color : "gray",
    intensity: active ? 0.45 + (seed % 4) * 0.18 : 1,
  };
});

const principles = [
  {
    title: "Three kinds of progress. One place.",
    description:
      "Track an Application, log a LeetCode solve, or count commits from a public, non-fork repository. Different work. The same forward motion.",
  },
  {
    title: "Every day tells the truth.",
    description:
      "A day takes the color of its strongest activity: applications first, then solves, then commits. Days without a Hit stay Gray. Nothing gets hidden.",
  },
  {
    title: "Consistency, without shortcuts.",
    description:
      "One Hit keeps your Streak going. One missed day resets it. No freezes, no catch-up days. Just a record of showing up.",
  },
];

export default function Home() {
  return (
    <div className={styles.landing} id="top">
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="Grindboard home">
          <span className={styles.mark} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          Grindboard
        </a>
        <nav aria-label="Main navigation" className={styles.navigation}>
          <a href="#about">The idea</a>
          <a href="#preview" className={styles.headerAction}>
            See the board <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.eyebrow}>
            For the work between where you are and what&apos;s next.
          </p>
          <h1 id="hero-title">
            The work
            <br />
            <span>leaves a mark.</span>
          </h1>
          <p className={styles.introduction}>
            The applications. The problems solved. The code shipped.
            <br className={styles.desktopBreak} />
            Your entire job hunt, one day at a time.
          </p>
          <Button asChild className={styles.primaryAction}>
            <a href="#preview">
              Explore the board <ArrowDown size={16} aria-hidden="true" />
            </a>
          </Button>
          <p className={styles.heroNote}>
            Three activities. One honest picture.
          </p>
        </section>

        <section
          id="preview"
          className={styles.preview}
          aria-labelledby="preview-title"
        >
          <div className={styles.previewHeader}>
            <div>
              <p className={styles.eyebrow}>The bigger picture</p>
              <h2 id="preview-title">A year of showing up.</h2>
            </div>
            <span className={styles.previewLabel}>Illustrative preview</span>
          </div>

          <div className={styles.board}>
            <div className={styles.boardHeader}>
              <span>Activity overview</span>
              <span className={styles.mono}>52 weeks</span>
            </div>
            <div className={styles.heatmapScroll}>
              <div className={styles.heatmapCanvas}>
                <div className={styles.quarters} aria-hidden="true">
                  <span>First quarter</span>
                  <span>Second quarter</span>
                  <span>Third quarter</span>
                  <span>Fourth quarter</span>
                </div>
                <div className={styles.gridRow}>
                  <div className={styles.dayLabels} aria-hidden="true">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>
                  <div
                    className={styles.heatmap}
                    role="img"
                    aria-label="Illustrative 52-week heatmap: blue application days, yellow LeetCode days, green commit days, and Gray days without activity. Activity becomes more consistent across the year."
                  >
                    {previewDays.map((day) => (
                      <span
                        key={day.id}
                        data-color={day.color}
                        className={styles.cell}
                        style={
                          { "--intensity": day.intensity } as CSSProperties
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.boardFooter}>
              <ul className={styles.legend} aria-label="Activity colors">
                {activities.map((activity) => (
                  <li key={activity.color}>
                    <span
                      data-color={activity.color}
                      className={styles.swatch}
                      aria-hidden="true"
                    />
                    {activity.name}
                  </li>
                ))}
                <li>
                  <span
                    className={styles.swatch}
                    data-color="gray"
                    aria-hidden="true"
                  />
                  No activity
                </li>
              </ul>
              <span className={styles.sampleLabel}>
                Sample data, not a live account
              </span>
            </div>
          </div>
          <p className={styles.previewCaption}>
            Not every day looks the same. They all belong in the picture.
          </p>
        </section>

        <section
          id="about"
          className={styles.about}
          aria-labelledby="about-title"
        >
          <div className={styles.aboutIntro}>
            <p className={styles.eyebrow}>Less managing. More doing.</p>
            <h2 id="about-title">
              You do the work.
              <br />
              <span>Let it add up.</span>
            </h2>
            <p>
              The job hunt can feel like standing still.
              <br />
              Grindboard gives your effort a little perspective.
            </p>
          </div>
          <div className={styles.principles}>
            {principles.map((principle, index) => (
              <article className={styles.principle} key={principle.title}>
                <span className={styles.number} aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <div>
            <p className={styles.eyebrow}>Progress is a practice.</p>
            <h2 id="closing-title">Make the days count.</h2>
          </div>
          <a href="#preview">
            Take a closer look <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className={styles.footer}>
        <a href="#top" className={styles.footerBrand}>
          Grindboard
        </a>
        <span>A little work. A visible difference.</span>
        <a href="#top">
          Back to top <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
