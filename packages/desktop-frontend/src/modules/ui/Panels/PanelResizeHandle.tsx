import { Component, createRef, ReactNode } from "react";
import { View } from "react-native";
import tw from "twrnc";

import { PANEL_RESIZE_HANDLE_WIDTH } from "./constants";
import { WindowState } from "../../window-state/types";
import { SettingsContext } from "../../settings/types";
import { settingsContext } from "../../settings/context";

interface Props {
  active: boolean;
  onPressIn: (target: PanelResizeHandle, event: MouseEvent) => void;
  align: "left" | "right";
}

interface State {
  hovered: boolean;
}

class PanelResizeHandle extends Component<Props, State> {
  static contextType = settingsContext;

  public state: State = { hovered: false };

  private readonly container = createRef<View>();

  private readonly onMouseDown = (event: MouseEvent) => {
    this.props.onPressIn(this, event);
  };

  private readonly onMouseOver = () => {
    if (!this.state.hovered) {
      this.setState({ hovered: true });
    }
  };

  private readonly onMouseOut = () => {
    if (this.state.hovered) {
      this.setState({ hovered: false });
    }
  };

  public componentDidMount() {
    const divContainer = this.container.current! as unknown as HTMLDivElement;

    divContainer.addEventListener("mousedown", this.onMouseDown);
    divContainer.addEventListener("mouseover", this.onMouseOver);
    divContainer.addEventListener("mouseout", this.onMouseOut);
  }

  public componentWillUnmount() {
    const divContainer = this.container.current! as unknown as HTMLDivElement;

    divContainer.removeEventListener("mousedown", this.onMouseDown);
    divContainer.removeEventListener("mouseover", this.onMouseOver);
    divContainer.removeEventListener("mouseout", this.onMouseOut);
  }

  public render(): ReactNode {
    const windowState = WindowState.Foreground;
    const { accentColor } = this.context as SettingsContext;

    return (
      <View
        ref={this.container}
        style={tw.style({
          height: "100%",
          width: PANEL_RESIZE_HANDLE_WIDTH,
          cursor: "col-resize",
          appRegion: "no-drag",
          userSelect: "none",
          flexDirection: this.props.align === "right" ? "row-reverse" : "row",
          marginLeft:
            this.props.align === "right"
              ? `-${PANEL_RESIZE_HANDLE_WIDTH}px`
              : 0,
          marginRight:
            this.props.align === "left" ? `-${PANEL_RESIZE_HANDLE_WIDTH}px` : 0,
          position: "relative",
          zIndex: 999,
        })}
      >
        <View
          style={tw.style({
            height: "100%",
            width: 2,
            backgroundColor: accentColor,
            opacity:
              windowState === WindowState.Foreground &&
              (this.props.active || this.state.hovered)
                ? ".6"
                : "0",
            transition: "opacity 100ms ease-in-out",
          })}
        />
      </View>
    );
  }
}

export default PanelResizeHandle;
