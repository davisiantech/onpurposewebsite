# On Purpose YA Website

Source code for the On Purpose Young Adults website, a ministry of the Calhoun Seventh-day Adventist Church.

Visit [onpurposeya.com](https://onpurposeya.com).

## Hero photos

The homepage randomly selects one photo each time it loads. You can add as many curated hero photos as you like in the `images` folder using the `hero-` naming format:

- `hero-1.jpg`
- `hero-2.jpg`
- `hero-3.jpg`
- `hero-4.jpg` (or `.jpeg`, `.png`, `.webp`, etc.)

Whenever you add or remove hero photos, running `node scripts/sync.js` (or the automated GitHub workflow) automatically scans the `images` folder and updates `data/heroes.json`.

Landscape or portrait images both work because the site crops them to the hero frame. People-focused photos with the subject near the center will crop best.

The hero-photo bank is separate from the automatic Instagram feed, so a new Instagram flyer cannot appear in the hero.

## Automatic content

The existing GitHub workflow continues to refresh calendar and Instagram data. Instagram images remain in `images/instagram`; the curated hero files are not changed by that workflow.

This repository is public only for deployment purposes. It is not intended for external use, contribution, or distribution.

All content © On Purpose YA, Calhoun SDA Church.
