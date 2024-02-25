import { ReactNode } from "react";

export interface PreviewPanelContext {
  preview: ReactNode;
  setPreview(preview: ReactNode): void;
}
