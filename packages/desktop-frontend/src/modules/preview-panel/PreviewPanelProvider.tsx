import React, { FC, PropsWithChildren, ReactNode } from "react";
import { previewPanelContext } from "./context";

type Props = PropsWithChildren<{
  preview: ReactNode;
  setPreview: (preview: ReactNode) => void;
}>;

const PreviewProvider: FC<Props> = ({ preview, setPreview, children }) => {
  return (
    <previewPanelContext.Provider value={{ preview, setPreview }}>
      {children}
    </previewPanelContext.Provider>
  );
};

export default PreviewProvider;
