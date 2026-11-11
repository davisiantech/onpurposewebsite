# On Purpose website

The official logos use the October 2026 Blue Ridge identity. The page
palette adds warm cream, peach, golden yellow, and a deeper blue, with Fraunces headings and Inter body text. The main slogan uses the original
vector artwork in `images/design/purpose-isnt-accidental.svg`, with the small
wordmark removed from its bottom.
The opening uses two optimized community photos with lightweight vector trails.
The next calendar event is automatically featured in the curved yellow field.
The complete calendar below includes every upcoming event, including that
featured event, with no fixed count limit. Venue/city labels link to full map
addresses; events without locations omit the location line. Recognized forms and registration
URLs get RSVP labels; other links get More info.
Calendar descriptions show a short
excerpt with Read more / Read less for longer descriptions. More info continues
to open registration when present, or the Google Calendar event otherwise.

## Community photo performance

Original `images/hero-*` photos are kept as source files. Visitors receive the
640px or 1200px WebP versions in `images/optimized/`, with responsive image sizes
and a small initial fallback. To add or replace a community photo, keep the
`hero-N` naming pattern and run `node scripts/optimize-photos.js` with `cwebp`
installed (`brew install webp` on macOS). Commit the resulting variants along
with the originals. The normal sync discovers optimized variants automatically;
photos without variants still work using their source image.

The live static website is served from this repository root. Open `index.html`
locally or serve the repository and visit `/`.

Brand assets live in `images/`; rotating community photos are listed in
`data/heroes.json`; calendar and Instagram data are stored in `data/`. GitHub
Actions refreshes those files hourly through `scripts/sync.js`. Before a commit,
run `node scripts/sync.js` with `API_EVENTS_URL` and `API_INSTA_URL` configured.

## Sync troubleshooting

Each feed syncs independently. If one fails, GitHub Actions still commits
successful updates and keeps the failed feed's previous snapshot. The run
remains marked as failed so connection problems stay visible.

An Instagram HTTP 401 or 403 means the feed endpoint rejected authorization.
Reconnect or renew Instagram authorization with the feed provider. If that
produces a new feed URL, update `API_INSTA_URL` under GitHub repository Settings
→ Secrets and variables → Actions. Rerun **Sync Data** using **Run workflow**
to verify the connection. Do not commit tokens or private feed URLs to this repo.

## Quarterly Sabbath School studies

Edit the [published study Sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vR1SEVnzQVH01qT8E3yKlHLagS7gePJO1ve6qRfERps2G4T7JdC6jpu6Hr51j8dR3Qoh1c0AWGaOwZ4/pubhtml).
Use one row per study with these headers:

`quarter, year, start_date, end_date, title, description, material_url`

Dates accept `YYYY-MM-DD` or `M/D/YYYY`. Both dates are inclusive. Title and
dates are required; the material link and description are optional. Enter
future studies in advance and leave automatic republishing enabled in Google
Sheets. A description-only row continues the preceding valid study, although
keeping the description in one cell is easiest.

The hourly GitHub Action fetches the published CSV and commits
`data/studies.json` automatically. No new secrets or manual code edits are
needed. The homepage selects the active study in the `America/New_York`
timezone. When date ranges overlap, the study with the latest start date wins.
No current study means only the normal weekly Sabbath School invitation shows.
Failed fetches or an entirely invalid set of studies preserve the last
successful snapshot. A valid empty Sheet clears the study list.

The calendar subscription points to the same public calendar identified by
the existing event feed. Event registration and calendar-event actions remain
independent of this subscription link.
The subscription button opens the public iCal feed using `webcal` so a
registered calendar app can handle subscribing. The device/browser controls
which app opens and whether a chooser is shown. Google Calendar on the web
does not universally handle this protocol; it can subscribe to the HTTPS feed
through its "From URL" option. The website does not force an app chooser.
