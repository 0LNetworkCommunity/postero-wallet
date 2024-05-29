import styled from "@emotion/native";
import { useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  View,
  TextInput as RNTextInput,
  Keyboard,
} from "react-native";
import { getLocales } from "expo-localization";
import _ from "lodash";
import { fonts } from "../../theme";

const amountText = {
  fontFamily: fonts.primary[400],
  fontSize: 36,
};

const Symbol = styled.Text({
  ...amountText,
});

const TextInput = styled.TextInput({
  ...amountText,
});

const InputContextSizeHelper = styled.Text({
  ...amountText,
});

const decimalSeparator = getLocales()[0].decimalSeparator || ".";
const ZERO_ASCII = "0".charCodeAt(0);
const NINE_ASCII = "9".charCodeAt(0);

function cleanDecimalInput(input: string): string {
  let out = "";
  let decimalSeparatorPosition: number | undefined = undefined;

  for (let i = 0; i < input.length; ++i) {
    // Reached the max number of decimals
    if (
      decimalSeparatorPosition !== undefined &&
      out.length - decimalSeparatorPosition > 6
    ) {
      break;
    }

    if (
      decimalSeparatorPosition === undefined &&
      input[i] === decimalSeparator
    ) {
      // Add a leading 0 if the first character is a decimal separator
      if (i === 0) {
        out = out.concat("0");
      }
      decimalSeparatorPosition = out.length;
      out = out.concat(decimalSeparator);
    } else {
      const code = input.charCodeAt(i);
      // Filters numerical characters
      if (code >= ZERO_ASCII && code <= NINE_ASCII) {
        out = out.concat(input[i]);
      }
    }
  }

  let decimals =
    decimalSeparatorPosition !== undefined
      ? out.slice(decimalSeparatorPosition + 1)
      : "";

  let integer = out.slice(0, decimalSeparatorPosition);
  if (integer.length > 0) {
    let i = 0;
    while (i < integer.length - 1 && integer[i] === "0") {
      ++i;
    }

    integer = integer.slice(i);

    const splitedInteger: string[] = [];
    for (let i = integer.length; i >= 0; i -= 3) {
      const start = Math.max(0, i - 3);
      if (start !== i) {
        splitedInteger.push(integer.slice(start, i));
      }
    }
    splitedInteger.reverse();
    integer = splitedInteger.join(" ");
  }

  if (decimalSeparatorPosition !== undefined) {
    return `${integer}${decimalSeparator}${decimals}`;
  }
  return integer;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function AmountInputInner({
  value: initialValue,
  onChange,
  containerWidth,
}: Props & { containerWidth: number }) {
  const value = useMemo(() => cleanDecimalInput(initialValue), [initialValue]);

  const textInput = useRef<RNTextInput>(null);
  const [symbolWidth, setSymbolWidth] = useState<number>();
  const [textWidth, setTextWidth] = useState(0);

  const inputMaxWidth = containerWidth - (symbolWidth ?? 0);
  const inputTextWidth = _.clamp(textWidth, symbolWidth ?? 0, inputMaxWidth);

  const onChangeText = (newValue: string) => {
    // Checking if the only difference between the new and the current input value
    // is the removal of a whitespace.
    // If that's the case, we remove the character preceding the whitespace that
    // was removed.
    if (newValue.length === value.length - 1) {
      let i = 0;
      while (i < newValue.length && newValue[i] === value[i]) {
        ++i;
      }

      if (i > 0 && value[i] === " ") {
        const currentRemaning = value.slice(i + 1);
        const newRemaining = newValue.slice(i);
        if (currentRemaning === newRemaining) {
          onChange(
            cleanDecimalInput(`${newValue.slice(0, i - 1)}${newRemaining}`)
          );
          return;
        }
      }
    }

    onChange(cleanDecimalInput(newValue));
  };
  const containsDecimalSeparator = value.includes(decimalSeparator);

  return (
    <View style={{ width: "100%" }}>
      {/**
       * Hidden element containning a copy of the input text used to
       * determine the width of the text in the text input
       */}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          top: 0,
          opacity: 0,
        }}
      >
        <InputContextSizeHelper
          numberOfLines={1}
          lineBreakStrategyIOS="none"
          onLayout={(event: LayoutChangeEvent) => {
            setTextWidth(event.nativeEvent.layout.width);
          }}
        >
          {value}
        </InputContextSizeHelper>
      </View>

      <Symbol
        style={{
          position: "absolute",
          right: (containerWidth - inputTextWidth) / 2 - (symbolWidth ?? 0) / 2,
        }}
        onLayout={
          symbolWidth === undefined
            ? (event) => setSymbolWidth(event.nativeEvent.layout.width)
            : undefined
        }
      >
        {" Ƚ"}
      </Symbol>

      <View>
        <TextInput
          ref={textInput}
          autoFocus
          numberOfLines={1}
          textAlign="right"
          selectionColor="#CD3B42"
          value={value}
          onChangeText={onChangeText}
          style={{
            paddingRight:
              (containerWidth - inputTextWidth) / 2 + (symbolWidth ?? 0) / 2,
            width: containerWidth,
          }}
          inputMode={containsDecimalSeparator ? "numeric" : "decimal"}
          keyboardType={containsDecimalSeparator ? "numeric" : "decimal-pad"}
          returnKeyType="done"
          returnKeyLabel="Done"
          onSubmitEditing={() => {
            textInput.current?.blur();
            Keyboard.dismiss();
          }}
          placeholder="0"
        />
      </View>
    </View>
  );
}

function ContainerWidthWrapper(props: Props) {
  const [width, setWidth] = useState<number>();

  const onLayout = (event: LayoutChangeEvent) => {
    if (width !== event.nativeEvent.layout.width) {
      setWidth(event.nativeEvent.layout.width);
    }
  };

  return (
    <View style={{ width: "100%", overflow: "hidden" }} onLayout={onLayout}>
      {width && <AmountInputInner {...props} containerWidth={width} />}
    </View>
  );
}

export function AmountInput(props: Props) {
  return <ContainerWidthWrapper {...props} />;
}
