import { ReactNode, memo } from "react";
import { getLocales } from "expo-localization";

import { Text } from "../Text";

const [locale] = getLocales();

const numberFormatter = new Intl.NumberFormat(locale.languageTag, {
  style: "currency",
  currency: "USD",
});

const kSymbolLeading = numberFormatter.format(9).startsWith("9");

function formatInt(input: string): string {
  const blocksCount = Math.ceil(input.length / 3);
  if (blocksCount < 2) {
    return input;
  }

  const blocks = new Array<string>(blocksCount);
  let cursor = input.length;
  for (let i = blocksCount - 1; i >= 0; --i) {
    blocks[i] = input.substring(cursor - 3, cursor);
    cursor -= 3;
  }
  return blocks.join(locale.digitGroupingSeparator ?? " ");
}

const defaultRenderer = (symbol) => <Text>{symbol}</Text>;

interface Props {
  amount: number;
  renderSymbol?: (symbol: string) => ReactNode;
  renderDecimals?: (symbol: string) => ReactNode;
  renderInteger?: (symbol: string) => ReactNode;
  symbolLeading?: boolean;
}

export const MoneyAmount = memo(
  ({
    amount,
    renderSymbol = defaultRenderer,
    renderDecimals = defaultRenderer,
    renderInteger = defaultRenderer,
    symbolLeading,
  }: Props) => {
    const [int, dec] = amount.toString(10).split(".");

    return (
      <Text>
        {(symbolLeading || (symbolLeading === undefined && kSymbolLeading)) &&
          renderSymbol("Ƚ ")}
        {renderInteger(formatInt(int))}
        {dec && renderDecimals(`${locale.decimalSeparator}${dec}`)}
        {(!symbolLeading || (symbolLeading === undefined && !kSymbolLeading)) &&
          renderSymbol(" Ƚ")}
      </Text>
    );
  }
);
