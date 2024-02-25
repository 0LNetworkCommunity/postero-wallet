import { FC } from "react";
import WalletView from "../../modules/wallets/WalletView/WalletView";

const WalletWindow: FC = () => {
  const params = JSON.parse(
    new URL(location.toString()).searchParams.get("params")!
  ) as {
    id: string;
  };

  const { id } = params;

  return <WalletView id={id} />;
};

export default WalletWindow;
