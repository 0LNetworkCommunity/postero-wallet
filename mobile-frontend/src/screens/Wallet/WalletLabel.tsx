import { useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import tw from "twrnc";
import debounce from "lodash/debounce";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
}

export function WalletLabel({ value, onChange }: Props) {
  const [inputValue, setInputValue] = useState("");
  const ref = useRef<(value: string) => void>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    ref.current = onChange;
  }, [onChange]);

  const debouncedCallback = useMemo(() => {
    const fn = (value: string) => {
      ref.current?.(value);
    };

    return debounce(fn, 500);
  }, []);

  const onChangeText = (value: string) => {
    debouncedCallback(value);
    setInputValue(value);
  };

  return (
    <TextInput
      value={inputValue}
      style={tw.style("font-semibold text-gray-900 text-xl flex-1")}
      onChangeText={onChangeText}
    />
  );
}
