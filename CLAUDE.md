# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Burger Lions** — a WebAR restaurant menu app. Customers browse a 32-item menu with live 3D thumbnails, then place dishes in Augmented Reality before ordering. No build step; all AR libraries load from CDN.

## Development Commands

```bash
npm install      # Install the `serve` package (only dev dependency)
npm run dev      # Serve static files at http://localhost:3000
```

`npm run build` is a no-op — this is a pure static project.

## Architecture

### Pages

**`index.html`** — the full menu app. Loads `foods/menu.json`, renders 32 items across 4 categories (Burgers, Sides, Drinks, Desserts) with lazy 3D thumbnails and a full 3D modal. AR button routing:

| Device | AR capability | Result |
|---|---|---|
| Android Chrome + ARCore | `webxr` detected | Three.js WebXR carousel — tap surface to place, swipe to cycle items |
| iOS Safari | `arkit` detected | Redirect to `advanced-ar.html?item=N` (Quick Look) |
| Android without WebXR | `none` + mobile UA | Redirect to `advanced-ar.html?item=N` (Scene Viewer) |
| Desktop | `none` + not mobile | In-page 3D modal (no AR) |

AR capability is cached in `localStorage` key `bl-ar-cap`. Theme and language are stored under `bl-theme` / `bl-lang`.

**`advanced-ar.html`** — model-viewer-based AR page. Primary experience for iOS (Quick Look) and fallback for Android without WebXR (Scene Viewer). Accepts `?item=N` (global menu index) from index.html. No in-AR overlays — the AR scene shows only the 3D model. Supports EN/KA language and Day/Night theme, both synced to the same localStorage keys as index.html.

### Data

**`foods/menu.json`** — array of 32 items. Each item has: `name`, `name_ka`, `category`, `category_ka`, `description`, `description_ka`, `price`, `model` (filename of the GLB to load).

### 3D assets

- `food.glb` — generic food model (placeholder for most items)
- `Druidi.glb` — Druidi burger model (used for the Druidi item and as a second placeholder)

Both files are in the project root. AR sessions show no name/price labels — clean, immersive model-only view.

## Key design decisions

- Three.js is loaded **lazily** on first AR tap (not on page load) to avoid blocking the menu.
- Thumbnails are loaded **staggered** (150 ms apart) via IntersectionObserver to prevent competing WebGL context inits.
- The WebXR carousel in index.html is **category-scoped** — only items in the same category as the tapped item appear in the carousel.
- `advanced-ar.html` navigates through **all 32 items** (simple prev/next), not category-scoped.
- AR labels (name, price) are intentionally absent from both AR flows — AR is for immersive 3D viewing only.
