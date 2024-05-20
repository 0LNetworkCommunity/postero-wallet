import styled from "@emotion/native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ArrowNarrowLeftIcon } from "../../icons/ArrowNarrowLeftIcon";
import Text from "../Text";

const Container = styled.View({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 16,
});

interface Props {
  onPress: () => void;
}

export function BackButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <ArrowNarrowLeftIcon color="#525252" />
        <Text text sm medium style={{ color: "#525252", marginLeft: 6 }}>
          Back
        </Text>
      </Container>
    </TouchableOpacity>
  );
}
