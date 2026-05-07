# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A WebAR (Web-based Augmented Reality) restaurant menu app. It detects the user's platform and routes them to the appropriate AR experience — iOS devices get a Model-Viewer / WebXR / Quick Look experience, Android devices get a MindAR image-tracking experience. No build step exists; all AR libraries load from CDN.

## Development Commands

```bash
npm install      # Install the `serve` package (only dev dependency)
npm run dev      # Serve static files at http://localhost:3000
```

`npm run build` is a no-op — this is a pure static project.

## Architecture

**Entry point: `index.html`** — performs client-side user-agent detection and immediately redirects:
- iOS (iPhone/iPad/iPod or MacIntel + touch) → `advanced-ar.html`
- All other devices → `mind-ar-fallback.html`

**`advanced-ar.html`** — uses Google's `<model-viewer>` (v3.4.0) with WebXR, Scene Viewer, and Quick Look support for native iOS AR. Includes a fallback button that links to `mind-ar-fallback.html`.

**`mind-ar-fallback.html`** — uses A-Frame (v1.4.2) + MindAR (v1.2.5) for image-target AR. The user points the camera at the trained marker image; when detected, `food.glb` is placed in AR. The `.mind` marker file (`menu-marker.mind`) was pre-trained offline.

**3D assets:**
- `food.glb` — the single GLB model displayed in both AR flows
- `menu-marker.mind` — MindAR compiled image marker for Android tracking

## Environment & Deployment

The app is designed for **Google AI Studio** (app ID: `957efad7-9fb1-4302-955b-95d1be8c400c`), which injects secrets at runtime. For local development:

1. Copy `.env.example` → `.env.local`
2. Set `GEMINI_API_KEY` (only needed if adding Gemini AI features)
3. Run `npm run dev`

Camera permission (`camera`) is declared in `metadata.json` and required by both AR flows.
