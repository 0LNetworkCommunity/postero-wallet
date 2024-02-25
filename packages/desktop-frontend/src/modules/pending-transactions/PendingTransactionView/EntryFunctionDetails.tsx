import { Buffer } from "buffer";
import _ from "lodash";
import { FC, useMemo } from "react";
import { View, Text } from "react-native";
import { BCS, TxnBuilderTypes } from "aptos";
import tw from "twrnc";
import Hex from "../../ui/Hex";

const { EntryFunction, TransactionPayloadEntryFunction } = TxnBuilderTypes;

interface Props {
  payload: Buffer;
}

const EntryFunctionDetails: FC<Props> = ({ payload }) => {
  const entryFunctionPayload = useMemo(() => {
    const deserializer = new BCS.Deserializer(payload);
    const entryFunctionPayload = new TransactionPayloadEntryFunction(
      EntryFunction.deserialize(deserializer)
    );
    return entryFunctionPayload;
  }, [payload]);

  const moduleAddress = _.trimStart(
    Buffer.from(entryFunctionPayload.value.module_name.address.address)
      .toString("hex")
      .toUpperCase(),
    "00"
  );

  return (
    <View>
      <View>
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={tw.style("text-sm text-slate-900", {
            fontFamily: "mononoki-Bold",
          })}
        >
          <Text>{moduleAddress}</Text>
          <Text>::</Text>
          <Text>{entryFunctionPayload.value.module_name.name.value}</Text>
          <Text>::</Text>
          <Text>{entryFunctionPayload.value.function_name.value}</Text>
        </Text>
      </View>
      <View>
        <Text>Args</Text>

        {entryFunctionPayload.value.args.map((arg, index) => (
          <View key={index}>
            <Text>{`${index}`}</Text>
            <Hex value={arg} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default EntryFunctionDetails;
