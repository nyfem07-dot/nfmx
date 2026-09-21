# Toolbox

A polished web utility platform — everyday internet tools in one honest,
fast, ad-free place. Built with Next.js, TypeScript and Tailwind CSS.

## What's included in this first version

- A full site experience: homepage, tool directory with live search,
  category pages, and a reusable tool page shell.
- **12 fully working tools**, running entirely in your browser (no
  uploads, no backend): Compress Image, Image Converter, Resize Image,
  PDF Merge, PDF Split, PDF Compressor, QR Generator, Word Counter,
  Text Cleaner, JSON Formatter, Unit Converter and Password Generator.
- **5 tools clearly marked "Coming soon"**: Remove Background, Global
  Radio, Currency Converter, Video Compressor, Audio Converter — these
  need capabilities (ML models, live data feeds, media encoding) this
  first version doesn't ship yet.
- Dark/light theme toggle, responsive layout (phone, tablet, desktop),
  and a centralized tool registry (`src/lib/tools.ts`) for adding new
  tools later.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build for production

```bash
npm run build
npm run start
```

## Project structure

```
src/
  app/                    Routes (home, /tools, /category, tool pages)
  components/             Shared UI (header, footer, cards, search)
  components/tools/        Individual tool implementations
  lib/tools.ts             Centralized tool definitions — add new tools here
  lib/categories.ts        Category definitions
```

## Adding a new tool

1. Add an entry to the `tools` array in `src/lib/tools.ts`.
2. If it's ready to use, build a component in `src/components/tools/`
   and register it in `src/components/ToolRegistry.tsx`. Otherwise leave
   `status: "soon"` and it will automatically show a "Coming soon" page.
