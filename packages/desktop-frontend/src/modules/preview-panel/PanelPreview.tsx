import { PropsWithChildren, Component, ReactNode } from "react";
import { previewPanelContext } from "./context";
import { PreviewPanelContext } from "./types";

type Props = PropsWithChildren<{}>;

class PanelPreview extends Component<Props> {
  static contextType = previewPanelContext;

  public componentDidMount(): void {
    (this.context as PreviewPanelContext).setPreview(this.props.children);
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.children !== this.props.children) {
      (this.context as PreviewPanelContext).setPreview(this.props.children);
    }
  }

  public componentWillUnmount(): void {
    (this.context as PreviewPanelContext).setPreview(undefined);
  }

  public render(): ReactNode {
    return null;
  }
}

export default PanelPreview;
