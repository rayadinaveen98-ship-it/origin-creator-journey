# ORIGIN — Creator Journey · V6 frozen release

**Source successfully uploaded 27 October 2026.** The original standalone cinematic experience is preserved byte-for-byte (SHA-256: `2988addb825d5021c343e2969157ac602fbbf5db795821390c547705e9189cb7`).

This repository uses 51 small source chunks in `source/parts/` so the original 6.6 MB image-embedded V6 page can be safely transferred via GitHub. The reconstruction script `scripts/assemble-v6.mjs` joins them and **refuses to build if the original SHA-256 does not match**.

## Website: Cloudflare Pages
The GitHub Actions workflow writes the verified website to `www/index.html` and commits it back to `main`.

Connect this repository to Cloudflare Pages with:
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank (the generated `www/index.html` is committed already)
- Output directory: `www`
- Root directory: repository root

The generated static HTML is self-contained, including the nine original cinematic artworks. Its size (~6.6 MB) is below Cloudflare Pages' 25 MiB per-file limit.

**GitHub cannot authorize Cloudflare on your behalf.** A Cloudflare account owner must connect or approve the GitHub repository if not already authorized. A repository commit by itself does not confirm a Cloudflare deployment.

## Android debug APK
- Android app label: `ORIGIN`
- Android ID: `com.origin.creatorjourney`
- Framework: Capacitor 8
- Workflow: [Assemble V6 website and build Android APK](./.github/workflows/origin-v6.yml)

Open the **Actions** tab and select the latest run. If the `android-debug` job succeeds, open its artifact named `ORIGIN-V6-Android-APK`. Inside is `ORIGIN-V6-debug.apk`, an installable *debug build*, not a signed Play Store release.

## Development and compatibility
- `npm install` (Node 22+) followed by `node scripts/assemble-v6.mjs` reconstructs the website.
- For Android: `npx cap add android && npx cap sync android && cd android && ./gradlew assembleDebug`.
- V6 artwork, interface and features are unchanged; no V7 work is in scope.
- Local notes remain device-specific. APK download and export behaviors require testing on a physical Android phone.
- No API keys, credentials, or private user data are in this repository.
