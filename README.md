# On Purpose website

The live static website is served from this repository root. Open `index.html`
locally or serve the repository and visit `/`.

Brand assets live in `images/`; rotating community photos are listed in
`data/heroes.json`; calendar and Instagram data are stored in `data/`. GitHub
Actions refreshes those files hourly through `scripts/sync.js`. Before a commit,
run `node scripts/sync.js` with `API_EVENTS_URL` and `API_INSTA_URL` configured.
