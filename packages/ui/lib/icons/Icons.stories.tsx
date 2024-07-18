import React, { createElement } from "react";
import { View } from "react-native";

import { IconProps } from "./types";

import { ArrowNarrowLeftIcon } from "./ArrowNarrowLeftIcon";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { Copy03Icon } from "./Copy03Icon";
import { DotsHorizontalIcon } from "./DotsHorizontalIcon";
import { DotsVerticalIcon } from "./DotsVerticalIcon";
import { Download01Icon } from "./Download01Icon";
import { Download02Icon } from "./Download02Icon";
import { Droplets03Icon } from "./Droplets03Icon";
import { Edit04Icon } from "./Edit04Icon";
import { EyeIcon } from "./EyeIcon";
import { EyeOffIcon } from "./EyeOffIcon";
import { LockedIcon } from "./LockedIcon";
import { PasscodeLockIcon } from "./PasscodeLockIcon";
import { PlusIcon } from "./PlusIcon";
import { QrScanIcon } from "./QrScanIcon";
import { SwitchVerticalIcon } from "./SwitchVerticalIcon";
import { UnlockedIcon } from "./UnlockedIcon";
import { XCloseIcon } from "./XCloseIcon";
import { Cube04Icon } from "./Cube04Icon";
import { Key01Icon } from "./Key01Icon";
import { RefreshCw02Icon } from "./RefreshCw02Icon";
import { Trash01Icon } from "./Trash01Icon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";

type IconComponent = ({ size, color }: IconProps) => React.JSX.Element;

function IconsStory() {
  const color = "#525252";
  const size = 32;

  const icons = [
    ArrowNarrowLeftIcon,
    ArrowUpRightIcon,
    Copy03Icon,
    DotsHorizontalIcon,
    DotsVerticalIcon,
    Download01Icon,
    Download02Icon,
    Droplets03Icon,
    Edit04Icon,
    EyeIcon,
    EyeOffIcon,
    LockedIcon,
    PasscodeLockIcon,
    PlusIcon,
    QrScanIcon,
    SwitchVerticalIcon,
    UnlockedIcon,
    XCloseIcon,
    Cube04Icon,
    Key01Icon,
    RefreshCw02Icon,
    Trash01Icon,
    ChevronLeftIcon,
  ];

  const rows: IconComponent[][] = [];
  const rowCount = Math.ceil(icons.length / 6);

  for (let y = 0; y < rowCount; ++y) {
    const row: IconComponent[] = [];
    for (let x = 0; x < 6; ++x) {
      const i = y * 6 + x;

      if (i < icons.length) {
        row.push(icons[i]);
      }
    }
    rows.push(row);
  }

  return (
    <View>
      {rows.map((row, y) => (
        <View
          key={y}
          style={{ flexDirection: "row" }}
        >
          {row.map((icon, x) => {
            return (
              <View
                style={{
                  padding: 8,
                  borderBottomWidth: 1,
                  borderRightWidth: 1,
                  borderLeftWidth: x === 0 ? 1 : 0,
                  borderTopWidth: y === 0 ? 1 : 0,
                }}
              >
                {createElement(icon, { size, color, key: x })}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default {
  title: "icons",
  component: IconsStory,
};

export const Default = {};
