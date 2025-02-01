
# WIP Carpe 2.0
[nothing to see here]

# Developers
OL uses `bun` for dev and deploy of NodeJS projects (instead of Yarn or NPM). see: https://bun.sh/

## Storybook
To get an overview of components you can run an app to preview content using Storybook: https://storybook.js.org/.

In this project, the app `ui` will display the Storybook UI components navigator. Run with:
```
cd ui
bun install
# start the browser view of the Storybook navigator
bun run dev
```
# Mobile Frontend
WARN: as of Feb 1 2025, this package does not build.
Local dependencies cannot be loaded:

```
Web Bundling failed 28707ms index.js (1 module)
Unable to resolve "@postero/ui" from "src/screens/WalletDetails/WalletDetails.tsx"
```
# Roadmap
- [] Fix local module deps
- [] make mobile frontend build
- [] remove Apollo for client side state
- [] minimalist android demo
