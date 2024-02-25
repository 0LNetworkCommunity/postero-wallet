import { FC, PropsWithChildren } from "react";
import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: 'rgba(250, 250, 250, 0.80)',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 0,
    userSelect: "none",
    appRegion: "drag",
  },
  shadow: {
    display: 'flex',
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0.5,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontFamily: 'SF Pro',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 20,
  },

  button: {
    userSelect: "none",
    appRegion: 'no-drag',
  }
});

type Props = PropsWithChildren<{
  title: string;
}>;

const TitleBar: FC<Props> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.shadow}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    </View>
  );
};

export default TitleBar;
