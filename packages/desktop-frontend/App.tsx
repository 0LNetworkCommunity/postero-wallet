import * as Device from 'expo-device';

export const loadApp = () => {
  switch (Device.deviceType) {
    case Device.DeviceType.TV:
      break;

    case Device.DeviceType.TABLET:
      break;

    case Device.DeviceType.PHONE:
      const mobile = require("./src/modules/mobile/App").default;
      return mobile;

    case Device.DeviceType.DESKTOP:
      const desktop = require("./src/modules/core/App").default;
      return desktop;

    case Device.DeviceType.UNKNOWN:
    default:
      break;
  }

  return null;
};

