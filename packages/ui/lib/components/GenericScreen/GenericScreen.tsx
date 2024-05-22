import { ReactNode } from "react";
import { View, SafeAreaView } from "react-native";
import styled from "@emotion/native";

import Text from "../../components/Text";
import { BackButton } from "../BackButton";

const Head = styled.View({
  padding: 16,
  marginBottom: 24,
  width: "100%",
});

const Body = styled.View({
  flex: 1,
});

const Container = styled.SafeAreaView({
  flex: 1,
  justifyContent: "space-between",
  backgroundColor: "#FFFFFF",
});

interface Props {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  body: ReactNode;
  footer: ReactNode;
}

export function GenericScreen({
  title,
  subtitle,
  body,
  footer,
  onBack,
}: Props) {
  return (
    <Container>
      {(onBack || title || subtitle) && (
        <Head>
          {onBack && <BackButton onPress={onBack} />}

          {title && (
            <Text display xs regular>
              {title}
            </Text>
          )}

          {subtitle && (
            <Text text sm regular secondary style={{ marginTop: 8 }}>
              {subtitle}
            </Text>
          )}
        </Head>
      )}

      <Body>{body}</Body>

      <View>{footer}</View>
    </Container>
  );
}
