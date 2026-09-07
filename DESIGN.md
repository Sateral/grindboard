# Grindboard — Product Landing Design

> Quiet editorial software for making invisible effort visible.

This document is the source of truth for Grindboard's public landing page and visual language. It replaces the previous OpenSea-inspired direction. The interface should feel considered, calm, human, and confident rather than futuristic, gamified, or dashboard-heavy.

## Product Context

Grindboard is a single-user grind tracker for the work involved in finding a job. It brings three kinds of effort into one honest calendar:

- Applications: creating or updating an Application.
- LeetCode solves: logging a problem by its URL.
- Counted commits: pushes to public, non-fork repositories.

The product's central metaphor is a GitHub-style yearly heatmap. Each day becomes a Hit when activity is recorded. Days without a Hit remain visible Gray. Today's square is Pending until something is logged. A Streak runs across consecutive Hit-days and resets on the first missed day.

The landing page should sell perspective, not productivity theater. It should make the user feel that the work they already do can add up to something visible.

## Design Direction

### Mood

- Quiet, warm, grounded, and observant.
- Editorial rather than SaaS-marketing polished.
- Spacious without feeling empty.
- Clear enough to feel trustworthy before authentication exists.
- More like a thoughtful independent product than a trading terminal or startup template.

### Avoid

- Purple, violet, neon, or blue-purple gradients.
- Glows, gradients, glassmorphism, and ambient blobs.
- Icon grids used as decorative feature cards.
- Excessive badges, pills, status labels, or dashboard chrome.
- Fake metrics presented as real user data.
- Aggressive gamification, flames, trophies, or streak theatrics.
- Huge marketing claims or generic startup language.
- Multiple competing calls to action.
- Decorative illustrations that compete with the heatmap.

### Core Principle

The heatmap is the product's visual identity. Everything else is typography, spacing, and framing. Color belongs primarily to activity data; the surrounding interface stays restrained and neutral.

## Color Tokens

The palette is warm near-black, not pure black and not blue-black.

| Name | Value | Role |
| --- | --- | --- |
| Background | `#10110f` | Page background and outer canvas |
| Surface | `#141513` | Heatmap board and elevated visual surfaces |
| Surface raised | `#1b1d1f` | Cards and secondary content surfaces |
| Surface subtle | `#26272d` | Small active or highlighted controls, used sparingly |
| Text | `#e7e7df` | Primary text; warm paper white |
| Text soft | `#c2c2ba` | Supporting copy and secondary emphasis |
| Text muted | `#979793` | Eyebrows, metadata, captions, and quiet navigation |
| Hairline | `rgba(255, 255, 255, 0.07)` | Borders and section dividers |
| Activity blue | `#6799bc` | Application days |
| Activity yellow | `#c1aa67` | LeetCode days |
| Activity green | `#729c83` | Commit days |
| Inactive gray | `#2c2e29` | Days without activity |

### Color Rules

- Use warm neutrals for the interface and copy.
- Activity colors should be desaturated and earthy, never electric or fluorescent.
- Activity colors may vary in opacity to show intensity.
- Do not use activity colors for large backgrounds or buttons.
- The primary CTA is an off-white surface with dark text, not a colored button.
- Selection and focus states use soft paper-white contrast rather than blue.

## Typography

### Primary Typeface

Use Inter or an equivalent neutral grotesk for all UI and editorial copy.

- Regular `400` for body copy and large statements.
- Medium `500` for wordmarks, headings, and actions.
- Avoid heavy `600` and `700` weights except where required for accessibility.

### Mono Typeface

Use JetBrains Mono or an equivalent mono typeface only for compact metadata:

- Heatmap period labels.
- Sample-data labels.
- Numeric values.
- Small status annotations.

Mono should support the product's measured character, not turn the page into a terminal.

### Type Scale

| Role | Size | Weight | Notes |
| --- | --- | --- | --- |
| Hero statement | `clamp(46px, 11.5vw, 88px)` | 400–500 | Tight tracking, short line breaks |
| Section heading | `32px–40px` | 400 | Warm, restrained hierarchy |
| Preview heading | `19px–23px` | 400 | Never oversized |
| Body | `13px–16px` | 400 | Relaxed line-height, muted where secondary |
| Eyebrow | `11px–12px` | 400 | Quiet, sentence case |
| Metadata | `9px–11px` | 400 | Mono, muted |

### Type Treatment

- Use tight negative tracking only on large headings.
- Keep body line-height between `1.7` and `1.9` for breathing room.
- Prefer sentence case. Avoid all-caps tracking-heavy labels.
- Use line breaks intentionally in the hero and supporting sections.
- The first line of a major statement may be paper white; the second line may soften to muted text.

## Layout

### Page Frame

- Maximum content width: `1200px`.
- Horizontal padding: `48px` desktop, `28px` tablet, `20px` mobile.
- The page is centered, with generous vertical rhythm.
- The header is approximately `100px` desktop and `80px` mobile.
- The footer is quiet and compact, never a second navigation system.

### Page Sequence

1. Minimal header and wordmark.
2. Centered hero statement and one primary action.
3. Full-width heatmap preview.
4. Three short explanatory principles.
5. Quiet closing action.
6. Minimal footer.

### Header

The header is a quiet horizontal line, not an application toolbar.

- Left: a small geometric Grindboard mark and wordmark.
- Right: one contextual link such as `The idea` and one outlined action that signs people in (`Sign in`, linking to the closing sign-in row).
- No search box, account avatar, icon rail, sidebar, or decorative chrome on the public landing page.
- Use a thin bottom hairline only when needed to anchor the page.

### Hero

The hero is centered and generous.

- Small eyebrow above the title: a human description of the product's emotional territory.
- Main line: `The work` followed by `leaves a mark.` on a new line.
- The second line may use muted text to create hierarchy without a gradient.
- Supporting paragraph is short and specific: applications, problems solved, code shipped.
- One off-white button with a simple downward arrow: `Explore the board`.
- A small supporting sentence below the button: `Three activities. One honest picture.`

### Heatmap Preview

The heatmap is the only large visual object on the page.

- Label it explicitly as `Illustrative preview` or `Sample data, not a live account`.
- Use a warm near-black board with an 8px radius and a subtle inset hairline.
- Show `52 weeks` in small mono metadata.
- Render 52 columns and 7 rows of square cells.
- Keep inactive cells dominant; let consistency build gradually across the year.
- Use blue, yellow, and green activity cells with varied opacity.
- Include quiet weekday labels and quarter labels, never loud axis graphics.
- Include a small bottom legend: Blue, Yellow, Green, No activity.
- Include a single sentence below the board that reinforces perspective rather than performance.
- Horizontal overflow is acceptable on small screens; the board must remain legible.

### Principles Section

Use a two-column editorial layout on desktop and one column on mobile.

The left column contains one heading and a short framing paragraph. The right column contains three numbered principles separated by hairlines.

Recommended copy structure:

- `Three kinds of progress. One place.`
- `Every day tells the truth.`
- `Consistency, without shortcuts.`

Each principle has:

- A small mono number such as `01`.
- A concise heading.
- One paragraph of clear product explanation.

Do not use an icon for each principle. The numbers and rules are enough visual structure.

### Closing Section

The closing action is a quiet bordered row, not a large colored banner.

- Eyebrow: `Progress is a practice.`
- Heading: `Make the days count.`
- Right side: two quiet hairline buttons that begin the real flow: `Continue with GitHub` and `Continue with Google`. The buttons carry the browser's IANA time zone into the OAuth state so a new User's day boundaries are right from sign-up.

### Footer

The footer should feel like the end of an editorial page:

- Left: Grindboard wordmark.
- Center: a short line such as `A little work. A visible difference.`
- Right: `Back to top` with a small arrow.
- Use muted text and generous spacing.
- Do not add legal, product, or account links until those destinations exist.

## Components

### Wordmark

- Small geometric four-square mark in warm paper white.
- Wordmark beside it, `19px` desktop and `17px` mobile.
- No flame, rocket, checkmark, or gradient symbol.

### Primary Action

- Off-white fill `#e7e7df`.
- Dark text `#171816`.
- `46px` tall.
- `4px` radius.
- Compact horizontal padding.
- Hover moves toward pure white.
- Label is an action, not a slogan: `Explore the board`.

### Text Link

- Muted or paper-white text depending on importance.
- Small arrow icon is allowed when it communicates movement.
- Underline or hairline border may appear on the closing action.

### Cards and Borders

- Prefer one large framed board over many small cards.
- Use `8px` radius for the heatmap board.
- Use `4px` radius for buttons and small labels.
- Use `rgba(255,255,255,0.07)` hairlines rather than visible heavy borders.
- Avoid drop shadows. The surface contrast and spacing should create hierarchy.

## Responsive Behavior

### Desktop

- Centered content at up to `1200px`.
- Hero can reach `88px` type.
- Principles use two columns.
- Heatmap can display all 52 weeks without clipping.

### Tablet

- Reduce page padding to approximately `28px`.
- Keep the hero centered.
- Preserve the two-column principles layout where space allows.
- Reduce heatmap cell size before reducing information.

### Mobile

- Page padding: `20px`.
- Header remains minimal and wraps only when necessary.
- Hero type scales between `46px` and `68px`.
- Hide intentional desktop-only line breaks in body copy.
- Principles become one column.
- Heatmap scrolls horizontally inside its own region.
- Closing action stacks vertically.
- Footer may wrap; no information should be clipped.

## Accessibility

- Keep one `h1` describing the product promise.
- Preserve a logical heading hierarchy through the preview and principles.
- Provide a skip link.
- Use visible `:focus-visible` outlines with sufficient contrast.
- Give the heatmap a concise accessible description explaining the color meanings.
- Never communicate activity using color alone in the legend.
- Support `prefers-reduced-motion` and avoid animation as decoration.

## Content Voice

Write like a thoughtful coach, not a productivity influencer.

- Specific over clever.
- Honest over motivational.
- Warm, spare, and direct.
- Acknowledge that job hunting is difficult without dramatizing it.
- Use the domain terms `Activity`, `Hit`, `Gray day`, `Pending day`, and `Streak` consistently.
- Avoid phrases such as `unlock your potential`, `level up`, `crush your goals`, and `supercharge your grind`.

## Implementation Notes

- Keep the landing page server-rendered and data-free.
- Preview heatmap values must be deterministic so screenshots and tests remain stable.
- Always label preview values as illustrative or sample data.
- Keep page-specific composition in `src/app/page.tsx` and page-specific visual rules in `src/app/page.module.css`.
- Keep global CSS limited to tokens, typography, base resets, selection, and accessibility behavior.
- Do not introduce a new component library or animation dependency for the landing page.
