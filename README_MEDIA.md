# Media hydration in production

On Railway, large media assets (flyers, gallery, venue) are not stored in Git. Instead, the server downloads release archives on startup and extracts them into `dist/public/assets`.

- Source release: GitHub Releases on this repo
- Default tag: `v0.1`
- Override with env var: `MEDIA_RELEASE_TAG` (e.g. `v0.2`)

Flow on startup:

1. `ensureMediaAssets()` downloads these files if the target folders are empty:
   - `flyers.tar.gz` -> `dist/public/assets/flyers/`
   - `gallery-freakfest.tar.gz` -> `dist/public/assets/gallery/freakfest/`
   - `venue.tar.gz` -> `dist/public/assets/venue/`
2. A `manifest.json` is generated in `dist/public/assets/gallery/freakfest/` listing images for the Gallery UI.

Local dev:
- You can place the same folders under `client/public/assets/` to test without the release.

Troubleshooting:
- Set `MEDIA_RELEASE_TAG` to the desired release and redeploy.
- Check server logs for lines prefixed with `[media]`.
