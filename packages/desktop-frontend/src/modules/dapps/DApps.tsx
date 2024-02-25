import { FC, useState } from "react";

import DAppList from "./DAppList";

const DApps: FC = () => {
  const [activeDAppId, setActiveDAppId] = useState<string>();

  return (
    <DAppList
      activeDAppId={activeDAppId}
      onDAppPress={(dAppId: string) => {
        setActiveDAppId(dAppId)
      }}
    />
  );
};

export default DApps;
