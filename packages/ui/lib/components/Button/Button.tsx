import { ReactNode, useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

// border-radius: var(--radius-sm, 6px);
// border: 1px solid var(--Component-colors-Components-Buttons-Secondary-color-button-secondary-color-border, #0F0F0F);
// background: var(--Component-colors-Components-Buttons-Secondary-color-button-secondary-color-bg, #0F0F0F);

// /* Shadows/shadow-xs */
// box-shadow: 0px 1px 2px 0px rgba(20, 20, 20, 0.05);

// Component colors/Components/Buttons/Secondary color/button-secondary-color-border

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F0F0F",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 6,
    justifyContent: "center",
    flexDirection: "row",
  },
  containerHover: {
    backgroundColor: "#292929",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
});

interface Props {
  title: string;
}

function Button({ title }: Props): ReactNode {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      style={[styles.container, hovered && styles.containerHover]}
      onPress={() => console.log("lol")}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export default Button;
