
# WIP Carpe 2.0
[nothing to see here]


Targeting:
- Mobile iOS and Android
- Desktop Windows and MacOs
- Browsers Chrome and Firefox

# Developers
A react-native wallet platform built with `expo` https://expo.dev/.
An architecture used by the best in class wallets such as Coinbase Wallet and Metamask. More motivations here: https://www.coinbase.com/blog/announcing-coinbases-successful-transition-to-react-native

## Dev environment

### NodeJS
OL uses `bun` for dev and deploy of NodeJS projects (instead of Yarn or NPM). Install instructions: https://bun.sh/

For your development builds you should target a web build (as opposed to mobile).

### Mobile
The `expo` toolchain offers a number of solutions for mobile development. Installing local emulators on your device is a real pain, more here: https://docs.expo.dev/get-started/set-up-your-environment/

Alternatively, you can use the commercial product called `EAS`: more here: https://expo.dev/eas
This will create builds in the cloud, and allow you to install a preview app on a device, through `Expo Go`.

### Expo Troubleshooting
There are many competing dependencies in the expo and nodejs stack.

You should check the `expo` installation with:

```
# choose application
cd ui
# run the expo-doctor app
bunx expo-doctor

```

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
- [] remove shims
- [] minimalist android demo
