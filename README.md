# On Purpose website

The live static website is served from this repository root. Open `index.html`
locally or serve the repository and visit `/`.

Brand assets live in `images/`; rotating community photos are listed in
`data/heroes.json`; calendar and Instagram data are stored in `data/`. GitHub
Actions refreshes those files hourly through `scripts/sync.js`. Before a commit,
run `node scripts/sync.js` with `API_EVENTS_URL` and `API_INSTA_URL` configured.

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
