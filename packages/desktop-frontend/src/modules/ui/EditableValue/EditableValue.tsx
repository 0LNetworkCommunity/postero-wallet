import { FC, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  TextStyle,
} from "react-native";
import tw from "twrnc";

interface Props {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  style?: StyleProp<TextStyle>;
}

const EditableValue: FC<Props> = ({ value, placeholder, onChange, style }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(() => value);

  const emptyValue = !value || value.trim().length === 0;

  if (editing) {
    return (
      <View>
        <TextInput
          autoFocus
          style={style}
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={() => {
            onChange(inputValue);
            setEditing(false);
          }}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        setInputValue(value);
        setEditing(true);
      }}
    >
      {emptyValue ? (
        <Text style={[style, tw.style("text-gray-400")]}>{placeholder}</Text>
      ) : (
        <Text style={style}>{value}</Text>
      )}
    </TouchableOpacity>
  );
};

export default EditableValue;
