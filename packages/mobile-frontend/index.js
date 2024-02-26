import "reflect-metadata";

import 'react-native-gesture-handler';

global.Buffer = require('buffer').Buffer;

import "@azure/core-asynciterator-polyfill";

import { registerRootComponent } from "expo";

import App from "./src/modules/mobile/App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
