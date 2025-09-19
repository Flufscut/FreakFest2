# FreakFest2 v0.1 Media Assets

This release includes the large media assets excluded from the main branch to keep the repository lightweight.

Included archives:
- flyers.tar.gz — all flyer PNGs
- gallery-freakfest.tar.gz — all gallery JPGs
- venue.tar.gz — DJI venue video

Usage:
1) Download the archives from this release.
2) Extract into `client/public/assets/` so the paths are:
   - `client/public/assets/flyers/*`
   - `client/public/assets/gallery/freakfest/*`
   - `client/public/assets/venue/*`
3) Run the app:
```bash
npm install
npm run dev
```

Notes:
- Media files are tracked via Git LFS in the repo; this release provides direct archives for convenience.
