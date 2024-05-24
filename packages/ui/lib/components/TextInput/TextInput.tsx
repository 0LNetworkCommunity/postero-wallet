import React, {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from "react-native";
import Text from "../Text";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import styled from "@emotion/native";
import { IconProps } from "../../icons/types";

const Container = styled.View({
  borderRadius: 6,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#D6D6D6",
  backgroundColor: "#FFFFFF",
  shadowColor: "#141414",
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  flexDirection: "row",
  paddingHorizontal: 8,
});

const IconsContainer = styled.View({
  flexDirection: "row",
});

const IconContainer = styled.View({
  paddingVertical: 16,
  paddingHorizontal: 8,
});

const StyledTextInput = styled.TextInput({
  fontSize: 16,
  padding: 16,
  flexBasis: 0,
  flexGrow: 1,
  paddingVertical: 16,
  paddingHorizontal: 8,
});

interface Props {
  label?: string;

  icons?: {
    icon: (props: IconProps) => ReactNode;
    onPress: () => void;
  }[];

  style?: StyleProp<ViewStyle>;
}

interface TextInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  isFocused: () => boolean;
}

export const TextInput = forwardRef<
  TextInputRef,
  Props & Omit<TextInputProps, "style">
>(function TextInput({ label, icons, style, ...props }, ref) {
  const textInputRef = useRef<RNTextInput>(null);
  const [focused, setFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textInputRef.current?.focus();
    },
    blur: () => {
      textInputRef.current?.blur();
    },
    clear: () => {
      textInputRef.current?.clear();
    },
    isFocused: (): boolean => {
      return textInputRef.current?.isFocused() ?? false;
    },
  }));

  return (
    <View style={style}>
      {label && (
        <TouchableWithoutFeedback
          onPress={() => {
            textInputRef.current?.focus();
          }}
        >
          <Text text sm medium style={{ marginBottom: 6 }}>
            {label}
          </Text>
        </TouchableWithoutFeedback>
      )}
      <Container style={[focused && { borderColor: "#CD3B42" }]}>
        <StyledTextInput
          selectionColor="#141414"
          {...props}
          ref={textInputRef}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
        />
        {icons && icons.length > 0 && (
          <IconsContainer>
            {icons.map((icon, index) => (
              <TouchableOpacity key={index} onPress={icon.onPress}>
                <IconContainer>
                  {icon.icon({ size: 16, color: "#141414" })}
                </IconContainer>
              </TouchableOpacity>
            ))}
          </IconsContainer>
        )}
      </Container>
    </View>
  );
});
