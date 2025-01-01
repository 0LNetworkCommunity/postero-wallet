import React, { forwardRef } from 'react';
import { Text, TextProps } from 'react-native';
import Decimal from 'decimal.js';

type Props = Omit<TextProps, 'children'> & {
  children: Decimal;
};

const LibraAmount = forwardRef<Text, Props>(function LibraAmount(
  { children: amount, ...props },
  ref,
) {
  return (
    <Text
      {...props}
      ref={ref}
    >
      {`Ƚ ${amount.toNumber().toLocaleString(undefined, {
        maximumFractionDigits: 6,
      })}`}
    </Text>
  );
});

export default LibraAmount;
