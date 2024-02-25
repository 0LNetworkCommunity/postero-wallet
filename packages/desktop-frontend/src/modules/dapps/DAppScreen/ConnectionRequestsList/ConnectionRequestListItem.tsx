import { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { ConnectionRequest } from "../../types";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Countdown from "../../../ui/Countdown";

interface Props {
  connectionRequest: ConnectionRequest;
  onApprove: () => void;
  onDeny: () => void;
}

const ConnectionRequestListItem: FC<Props> = ({
  connectionRequest,
  onApprove,
  onDeny,
}) => {
  return (
    <View
      key={connectionRequest.id}
      style={tw.style(
        "py-2 flex-row",
        "justify-between",
        "border-b border-gray-900/5"
      )}
    >
      <Text style={tw.style("text-gray-600")}>
        <Countdown>{connectionRequest.createdAt}</Countdown>
        {" ago"}
      </Text>

      <View style={tw.style("flex-row")}>
        <TouchableOpacity onPress={onApprove}>
          <CheckCircleIcon style={tw.style("w-8 h-8 text-green-700")} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDeny}>
          <XCircleIcon style={tw.style("w-8 h-8 text-red-500")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConnectionRequestListItem;
