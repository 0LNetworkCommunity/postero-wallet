import { createElement, ReactNode } from "react";
import { View } from "react-native";
import styled from "@emotion/native";

import { Text } from "../Text";

const Container = styled.View({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
});

const IconContainer = styled.View({
  width: 32,
  height: 32,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#D6D6D6",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 16,
});

interface Props {
  label: string;
  statusLabel: string;
  amountLabel: string;
  feeLabel: string;
  success?: boolean;
  icon: (props: { size: number; color: string }) => ReactNode;
}

export function TransactionListItem({ label, statusLabel, amountLabel, feeLabel, success, icon }: Props) {
  return (
    <Container>
      <IconContainer>
        {createElement(icon, { size: 20, color: "#CD3B42" })}
      </IconContainer>

      <View style={{ flexGrow: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexGrow: 1, paddingRight: 8 }}>
            <Text text md regular>
              {label}
            </Text>
          </View>
          <Text text md regular>
            {amountLabel}
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flexGrow: 1, paddingRight: 8 }}>
            <Text
              text
              sm
              medium
              style={{ color: success ? "#079455" : "#D92D20" }}
            >
              {statusLabel}
            </Text>
          </View>
          <Text text sm regular quarterary>
            {feeLabel}
          </Text>
        </View>
      </View>
    </Container>
  );
}
