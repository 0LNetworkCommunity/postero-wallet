import { formatDistanceToNowStrict } from "date-fns";
import { forwardRef, useEffect, useState } from "react";
import { Text, TextProps } from "react-native";

type Props = Omit<TextProps, "children"> & {
  children: Date;
};

const Countdown = forwardRef<Text, Props>(function CountDown(
  { children, ...props },
  ref
) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(formatDistanceToNowStrict(children));

    const interval = setInterval(() => {
      setValue(formatDistanceToNowStrict(children));
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [children]);

  return (
    <Text {...props} ref={ref}>
      {value}
    </Text>
  );
});

export default Countdown;
