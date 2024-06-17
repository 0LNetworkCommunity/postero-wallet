# Postero

Postero is the official wallet for Open Libra.

# Architecture

The wallet is built around a client server architecture. The client and server communicate with [GraphQL](https://graphql.org/).
The backend is built with [Nest](https://nestjs.com/) and the frontend with [React Native](https://reactnative.dev/) and  [Expo](https://expo.dev/).

## Desktop App

This Postero desktop app utilizes [Electron](https://www.electronjs.org/) to encapsulate both the backend and frontend, facilitating communication via [IPC](https://www.electronjs.org/docs/latest/tutorial/ipc).
There are companion browser extensions for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/postero/) and [Chrome](https://chromewebstore.google.com/detail/postero/obmmpbppiajcobdoedkkgckeacgdpgde) that faciliate integration with web apps. They communicate with the browser-helper. A simple Rust application that forwards the [native messaging](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging) channel to a WebSocket server.
Currently, the WebSocket server operates over TCP, with plans to transition to [UDS](https://en.wikipedia.org/wiki/Unix_domain_socket) once [supported by Tokio on Windows](https://github.com/tokio-rs/mio/issues/1609).

You can visit [0l.fyi/postero](https://0l.fyi/postero) to enable the wallet integration.

### Run locally

We highly recommend using [nvm](https://github.com/nvm-sh/nvm) to ensure the appropriate version of Node.js is used. [Yarn](https://yarnpkg.com/) as required to install the project dependencies.
The [Rust toolchain](https://rustup.rs/) is required to build the browser-helper.

#### Build the browser-helper

```sh
cd browser-helper
cargo build
```

#### Start the frontend

```sh
cd packages/desktop-frontend
nvm use
yarn install
yarn run web
```

#### Start the backend

```sh
cd packages/desktop-backend
nvm use
yarn install
yarn run start:dev
```

### Package the app

```sh
cd desktop-builder
nvm use
./build.sh
```

## Mobile App

Currently, exploration is underway to determine the optimal approach for integrating the server into the mobile app. Challenges exist in running the backend within a dedicated thread with a communication channel for the UI thread. One possibility is embedding the server within the Expo app to evaluate performance and responsiveness. Further investigation is ongoing to refine the mobile app experience.

### Internal Testing

The app is still in an early stage and is currently distributed to limited set of users for internal testing. If you need to get access, share your email address associated with your Google account (for Android) or with your Apple account (for iOS).

You can install the Android app from the [Play Store](https://play.google.com/apps/internaltest/4701749236707025974).

