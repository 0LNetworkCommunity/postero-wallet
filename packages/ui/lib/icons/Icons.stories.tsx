import { View } from "react-native";
import UnlockedIcon from "./UnlockedIcon";
import LockedIcon from "./LockedIcon";
import EyeIcon from "./EyeIcon";
import EyeOffIcon from "./EyeOffIcon";
import QrScanIcon from "./QrScanIcon";
import SwitchVerticalIcon from "./SwitchVerticalIcon";

function IconsStory() {
  const color = "#525252";
  const size = 32;

  return (
    <View>
      <UnlockedIcon size={size} color={color} />
      <LockedIcon size={size} color={color} />
      <EyeIcon size={size} color={color} />
      <EyeOffIcon size={size} color={color} />
      <QrScanIcon size={size} color={color} />
      <SwitchVerticalIcon size={size} color={color} />
    </View>
  );
}

export default {
  title: "icons",
  component: IconsStory,
};

export const Default = {};
