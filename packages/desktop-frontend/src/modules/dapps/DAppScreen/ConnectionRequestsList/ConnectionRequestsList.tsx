import { FC } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

import { ConnectionRequest } from "../../types";
import ConnectionRequestListItem from "./ConnectionRequestListItem";

interface Props {
  connectionRequests: ConnectionRequest[];
  onApprove: (connectionRequest: ConnectionRequest) => void;
  onDeny: (connectionRequest: ConnectionRequest) => void;
}

const ConnectionRequestsList: FC<Props> = ({
  connectionRequests,
  onApprove,
  onDeny,
}) => {
  if (!connectionRequests.length) {
    return null;
  }

  return (
    <View style={tw.style("pt-3 pb-2")}>
      <View>
        <Text style={tw`text-sm font-medium text-gray-900`}>
          Connection Request
        </Text>
      </View>
      <View>
        {connectionRequests!.map((request) => (
          <ConnectionRequestListItem
            key={request.id}
            connectionRequest={request}
            onApprove={() => onApprove(request)}
            onDeny={() => onDeny(request)}
          />
        ))}
      </View>
    </View>
  );
};

export default ConnectionRequestsList;
