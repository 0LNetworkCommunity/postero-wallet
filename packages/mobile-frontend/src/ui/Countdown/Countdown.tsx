import { useEffect, useState } from "react";
import { Text } from "react-native";

interface Props {
  date: Date;
}

export function Countdown({ date }: Props) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const duration = Math.floor((date.getTime() - now) / 1_000);

      if (duration <= 0) {
        setLabel("00:00");
      } else {
        const elems: string[] = [];
        const secs = `${duration % 60}`.padStart(2, "0");
        let mins = Math.floor(duration / 60);
        const hours = Math.floor(mins / 60);
        mins = mins % 60;

        elems.push(`${hours}`.padStart(2, "0"));
        elems.push(`${mins}`.padStart(2, "0"));
        elems.push(secs);
        setLabel(elems.join(":"));
      }
    };

    const interval = setInterval(() => {
      update();
    });

    return () => {
      clearInterval(interval);
    };
  }, [date]);

  return <Text>{label}</Text>;
}

export default Countdown;
