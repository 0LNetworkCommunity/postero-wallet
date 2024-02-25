import _ from "lodash";
import { Component, ForwardedRef, ReactNode, createRef } from "react";
import { LayoutChangeEvent, View } from "react-native";
import tw from "twrnc";
import PanelResizeHandle from "./PanelResizeHandle";
import {
  LEFT_PANEL_HIDE_THRESHOLD,
  LEFT_PANEL_MAX_WIDTH,
  LEFT_PANEL_MIN_WIDTH,
  RIGHT_PANEL_HIDE_THRESHOLD,
  RIGHT_PANEL_MAX_WIDTH,
  RIGHT_PANEL_MIN_WIDTH,
  SIDE_PANEL_INITIAL_WIDTH,
} from "./constants";
import Panel from "./Panel";
import Toolbar from "./Toolbar";
import { windowStateContext } from "../../window-state/context";

const setPanelWidth = (panel: View | undefined | null, width: number) => {
  if (!panel) {
    return;
  }

  const div = panel as unknown as HTMLDivElement;
  if (width === 0) {
    div.style.display = 'none';
  } else {
    div.style.display = 'flex';
    div.style.width = `${width}px`;
  }
};

interface PanelGroupWrapperState {
  width: number;
  height: number;
}

interface PanelGroupWrapperProps {
  leftPanel: ReactNode;
  mainPanel: ReactNode;
  rightPanel?: ReactNode;
}

type Props = PanelGroupWrapperState & PanelGroupWrapperProps;

interface State {
  showLeftPanel: boolean;
  showRightPanel: boolean;
}

enum ResizeActionSide {
  Left,
  Right,
}

interface ResizeAction {
  side: ResizeActionSide;
  initialPosition: number;
  currentPosition: number;
}

class PanelGroup extends Component<Props, State> {
  static contextType = windowStateContext;

  private showLeftPanel = true;

  private showRightPanel = true;

  private width: number;

  private height: number;

  private leftPanel = createRef<View>();
  private leftPanelWidth = SIDE_PANEL_INITIAL_WIDTH;
  private leftPanelWidthOffset = 0;

  private rightPanel = createRef<View>();
  private rightPanelWidth = SIDE_PANEL_INITIAL_WIDTH;
  private rightPanelWidthOffset = 0;

  private leftResizeHandle = createRef<PanelResizeHandle>();

  private rightResizeHandle = createRef<PanelResizeHandle>();

  private resizeAction?: ResizeAction;

  private windowResize = (event: Event) => {
    this.width = window.innerWidth;
    this.updateLayout();
  };

  private onResizeHandlePressIn = (
    resizeHandle: PanelResizeHandle,
    event: MouseEvent
  ) => {
    const side =
      resizeHandle === this.leftResizeHandle.current
        ? ResizeActionSide.Left
        : ResizeActionSide.Right;

    this.resizeAction = {
      side,
      initialPosition: event.pageX,
      currentPosition: event.pageX,
    };
    document.body.style.cursor = "col-resize",

    this.forceUpdate();
  };

  private onResizeHanelPressOut = (event: MouseEvent) => {
    if (!this.resizeAction) {
      return;
    }

    const currentPosition = event.pageX;
    const delta = currentPosition - this.resizeAction.initialPosition;

    if (this.resizeAction.side === ResizeActionSide.Left) {
      this.leftPanelWidthOffset = 0;
      if (this.showLeftPanel) {
        this.leftPanelWidth = _.clamp(
          this.leftPanelWidth + delta,
          LEFT_PANEL_MIN_WIDTH,
          LEFT_PANEL_MAX_WIDTH
        );
      }
    } else {
      this.rightPanelWidthOffset = 0;
      if (this.showRightPanel) {
        this.rightPanelWidth = _.clamp(
          this.rightPanelWidth - delta,
          RIGHT_PANEL_MIN_WIDTH,
          this.width * RIGHT_PANEL_MAX_WIDTH
        );
      }
    }

    this.resizeAction = undefined;

    document.body.style.cursor = "";

    this.updateLayout();
    this.forceUpdate();
  };

  private readonly onMouseUp = (event: MouseEvent) => {
    this.onResizeHanelPressOut(event);
  };

  private updateLayout() {
    let leftPanelWidth = 0;
    let rightPanelWidth = 0;

    if (this.showLeftPanel) {
      leftPanelWidth = _.clamp(
        this.leftPanelWidth + this.leftPanelWidthOffset,
        LEFT_PANEL_MIN_WIDTH,
        LEFT_PANEL_MAX_WIDTH
      );
    }

    if (this.showRightPanel) {
      rightPanelWidth = _.clamp(
        this.rightPanelWidth + this.rightPanelWidthOffset,
        RIGHT_PANEL_MIN_WIDTH,
        this.width * RIGHT_PANEL_MAX_WIDTH,
      );
    }

    setPanelWidth(this.leftPanel.current, leftPanelWidth);
    setPanelWidth(this.rightPanel.current, rightPanelWidth);
  }

  private mouseMove = (event: MouseEvent) => {
    // No active dragging
    if (!this.resizeAction) {
      return;
    }

    // Mouse is out of the window
    if (event.clientX < 0 || event.clientX > this.width!) {
      return;
    }

    this.resizeAction.currentPosition = event.clientX;

    // Drag distance in pixel.
    // If delta is negative, the handler is dragged to the left.
    // If delta is postive, the handler is dragged to the right.
    // -x <----- 0 -----> +x
    const delta = event.clientX - this.resizeAction.initialPosition;

    if (this.resizeAction.side === ResizeActionSide.Left) {
      // Left handle is being dragged. With need to apply the offset to
      // the left panel
      this.leftPanelWidthOffset = delta;

      if (this.showLeftPanel) {
        if (this.leftPanelWidth + delta < LEFT_PANEL_HIDE_THRESHOLD) {
          this.hideLeftPanel();
        } else {
          this.updateLayout();
        }
      } else {
        if (this.leftPanelWidth + delta > LEFT_PANEL_MIN_WIDTH) {
          // this will trigger a re-render show we can skip the rest
          // for now and let onPanelMount call updateLayout
          this.onShowLeftPanel();
        }
      }
    } else {
      // Right handle is being dragged. With need to apply the offset to
      this.rightPanelWidthOffset = -delta;

      if (this.showRightPanel) {
        if (this.rightPanelWidth - delta < RIGHT_PANEL_HIDE_THRESHOLD) {
          this.hideRightPanel();
        } else {
          this.updateLayout();
        }
      } else {
        if (this.rightPanelWidth - delta > RIGHT_PANEL_MIN_WIDTH) {
          // this will trigger a re-render show we can skip the rest
          // for now and let onPanelMount call updateLayout
          this.onShowRightPanel();
        }
      }
    }

  };

  public constructor(props: Props) {
    super(props);
    this.width = props.width;
    this.height = props.height;
  }

  public render(): ReactNode {
    const { leftPanel, rightPanel, mainPanel } = this.props;
    const { showLeftPanel, showRightPanel } = this;

    return (
      <View
        style={tw.style({
          display: "flex",
          flexDirection: "col",
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 900,
        })}
      >
        <Toolbar
          leftSidebarVisible={this.showLeftPanel}
          rightSidebarVisible={this.showRightPanel}
          onToggleLeftSidebar={() => this.toggleLeftPanel()}
          onToggleRightSidebar={() => this.toggleRightPanel()}
        />

        <View
          style={tw.style({
            display: "flex",
            flexDirection: "row",
            width: "100%",
            flexGrow: 1,
            position: "relative",
            zIndex: 900,
          })}
          onLayout={(event) => this.onLayout(event)}
        >
          {showLeftPanel && (
            <>
              <Panel
                ref={this.leftPanel}
                onMount={(panel) => this.onPanelMount(panel)}
              >
                {leftPanel}
              </Panel>
              <PanelResizeHandle
                ref={this.leftResizeHandle}
                onPressIn={this.onResizeHandlePressIn}
                active={this.resizeAction?.side === ResizeActionSide.Left}
                align="right"
              />
            </>
          )}

          <View
            style={tw.style({
              flexGrow: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-1px 0px 1px 0px rgba(0, 0, 0, 0.05)",
            })}
          >
            <View
              style={{
                width: "100%",
                flexGrow: 1,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Panel
                onMount={(panel) => this.onPanelMount(panel)}
                style={{ flexGrow: 1 }}
              >
                {mainPanel}
              </Panel>
              {showRightPanel && (
                <>
                  <PanelResizeHandle
                    ref={this.rightResizeHandle}
                    onPressIn={this.onResizeHandlePressIn}
                    active={this.resizeAction?.side === ResizeActionSide.Right}
                    align="left"
                  />
                  <Panel
                    ref={this.rightPanel}
                    onMount={(panel) => this.onPanelMount(panel)}
                  >
                    {rightPanel}
                  </Panel>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  public componentDidMount(): void {
    window.addEventListener("mousemove", this.mouseMove);
    window.addEventListener("resize", this.windowResize);
    window.addEventListener("mouseup", this.onMouseUp);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("mousemove", this.mouseMove);
    window.removeEventListener("resize", this.windowResize);
  }

  private onShowLeftPanel() {
    this.showLeftPanel = true;

    this.updateLayout();
    this.forceUpdate();
  }

  private toggleLeftPanel() {
    if (this.showLeftPanel) {
      this.hideLeftPanel();
    } else {
      this.onShowLeftPanel();
    }
  }

  private toggleRightPanel() {
    if (this.showRightPanel) {
      this.hideRightPanel();
    } else {
      this.onShowRightPanel();
    }
  }

  private onShowRightPanel() {
    this.showRightPanel = true;

    this.updateLayout();
    this.forceUpdate();
  }

  private hideLeftPanel() {
    this.showLeftPanel = false;

    this.updateLayout();
    this.forceUpdate();
  }

  private hideRightPanel() {
    this.showRightPanel = false;

    this.updateLayout();
    this.forceUpdate();
  }

  private onLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;

    if (this.width === width && this.height === height) {
      return;
    }

    this.width = width;
    this.height = height;
  }

  // This callback is necessary to set the wdith of the panel
  // when it is mounted
  private onPanelMount(panel: ForwardedRef<View>) {
    this.updateLayout();
  }
}

class PanelGroupWrapper extends Component<PanelGroupWrapperProps, PanelGroupWrapperState> {
  public state: PanelGroupWrapperState = {
    width: 0,
    height: 0,
  };

  public render(): ReactNode {
    const { width, height } = this.state;
    if (width === 0 || height === 0) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            if (width !== this.state.width || height !== this.state.height) {
              this.setState({
                width,
                height,
              });
            }
          }}
        />
      );
    }
    return (
      <PanelGroup {...this.props} width={width} height={height} />
    );
  }
}

export default PanelGroupWrapper;
