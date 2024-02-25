import { forwardRef, useEffect } from "react";
import { View, ViewProps } from "react-native";

type Props = ViewProps & {
  onMount: (panel: any) => void;
};

const Panel = forwardRef<View, Props>(function Panel(
  { onMount, ...props },
  ref
) {
  useEffect(() => {
    onMount(ref);
  }, []);

  return <View {...props} ref={ref} />;
});

export default Panel;
