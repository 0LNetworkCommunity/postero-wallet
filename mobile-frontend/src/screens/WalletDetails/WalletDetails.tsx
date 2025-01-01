import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { WalletDetails as WalletDetailsView } from "@postero/ui";
import { ModalStackParams } from "../params";

const WalletDetailsScreeen: FC<
  StackScreenProps<ModalStackParams, "WalletDetails">
> = ({ route, navigation }) => {
  const { label, address } = route.params;
  return (
    <WalletDetailsView
      label={label}
      address={address}
      onClose={() => navigation.pop()}
    />
  );
};

export default WalletDetailsScreeen;
