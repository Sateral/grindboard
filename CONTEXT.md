# Grindboard

A single-user grind tracker that renders the entire job-hunt grind — job applications, LeetCode, and commits — as one unforgiving GitHub-style heatmap, so the grind becomes as visible and addictive as a contribution graph.

## Language

**User**:
A person with an account. Anyone can sign up; the app is public to join but each User sees only their own grind.
_Avoid_: member, subscriber

**Activity**:
One of the three tracked grind types: job-app activity, a LeetCode solve, or counted commits.
_Avoid_: event, entry

**Hit**:
A calendar day on which at least one Activity was recorded. A single Hit of any kind is enough for the day. A Hit is attributed to the entry day — the day it was logged — in the User's own timezone.
_Avoid_: check-in, contribution

**Pending day**:
Today's square before any Hit is recorded — not yet colored, not yet Gray.

**Gray day**:
A calendar day with no Hit. The visible-shame square.
_Avoid_: rest day, off day

**Streak**:
An unbroken run of consecutive Hit-days ending today or yesterday. One Gray day resets it to zero; there is no freeze.

**Heatmap**:
The centerpiece grid: one square per calendar day, colored by the day's strongest Activity. Gray when empty.

**Blue day**:
A Hit where job-app activity occurred. Precedence: Blue > Yellow > Green.

**Yellow day**:
A Hit from LeetCode solves alone. Intensity reflects the number of problems.

**Green day**:
A Hit from commits alone. Intensity reflects the number of commits.

**Job-app activity**:
Creating or updating an Application. Happens automatically on mutation — never a manual ritual.
_Avoid_: check-in, punch-in

**Application**:
A tracked job opening the user is pursuing: company, role, URL, and Pipeline status.
_Avoid_: job, posting, listing

**Pipeline**:
The fixed Application status sequence: Saved → Applied → OA → Interview → Offer or Rejected.

**LeetCode solve**:
A logged problem, validated by its problem URL; title and difficulty are auto-fetched. Solves are honor-system — the public API cannot verify them.
_Avoid_: problem entry, submission

**Counted commit**:
A push to a public, non-fork GitHub repository. Private repos and forks do not count in v1.
_Avoid_: push, contribution

**Deadline**:
A date attached to an Application by which some action is due — an OA date or an application closing date.
_Avoid_: due date, cutoff
