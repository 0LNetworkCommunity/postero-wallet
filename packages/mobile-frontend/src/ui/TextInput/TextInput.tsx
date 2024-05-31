import { View, Text, StyleSheet, TextInput as RNTextInput, TextInputProps } from "react-native";

interface Props {
  label: string;
  hint?: string;
}

function TextInput({ label, hint, ...props }: Props & TextInputProps) {
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <RNTextInput
        {...props}
        style={styles.textInputContainer}
      />
      {hint && <Text>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  textInputContainer: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000000",
    padding: 8,
  },
});

export default TextInput;
