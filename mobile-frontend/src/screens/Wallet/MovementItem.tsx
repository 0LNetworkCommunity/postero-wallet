import { FC, useMemo } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import BN from "bn.js";
import Decimal from "decimal.js";

import {
  BlockMetadataTransaction,
  Movement,
  ScriptUserTransaction,
  TransactionType,
  UserTransaction,
} from "../../movements";
import LibraAmount from "../../ui/LibraAmount";
import { ArrowUpRightIcon, Download01Icon, TransactionListItem } from "@postero/ui";

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});

interface Props {
  movement: Movement;
}

const MovementItem: FC<Props> = ({ movement }) => {
  const { transaction } = movement;
  let timestamp: BN | undefined;

  if (transaction.type !== TransactionType.Genesis) {
    timestamp = (
      transaction as
        | UserTransaction
        | ScriptUserTransaction
        | BlockMetadataTransaction
    ).timestamp;
  }

  const dateLabel = useMemo(() => {
    if (!timestamp) {
      return "";
    }

    return dateTimeFormatter.format(
      new Date(timestamp.div(new BN(1e3)).toNumber())
    );
  }, [timestamp]);

  if (transaction.type === TransactionType.User) {
    const userTransaction = transaction as UserTransaction;

    if (Buffer.from('01', 'hex').equals(userTransaction.moduleAddress)) {
      if (userTransaction.moduleName === 'ol_account') {
        if (userTransaction.functionName === 'transfer') {

          const args: string[] = JSON.parse(userTransaction.arguments);

          return (
            <View style={tw.style("py-2 px-3 h-16 flex-col justify-between")}>
              <TransactionListItem
                label={
                  movement.unlockedAmount.isNeg()
                    ? "Sent LIBRA"
                    : "Received LIBRA"
                }
                statusLabel="Confirmed"
                success
                icon={
                  movement.unlockedAmount.isNeg()
                    ? ArrowUpRightIcon
                    : Download01Icon
                  }
                amountLabel={`${new Decimal(args[1]).div(1e6)} Ƚ`}
                feeLabel={`Fee: ${userTransaction.gasUsed.toString(10)} Ƚ`}
              />
            </View>
          );
        }
      }
    }

    // return (
    //   <View style={tw.style("py-2 px-3 h-16 flex-col justify-between")}>
    //     <Text>
    //       {userTransaction.moduleAddress}
    //       {userTransaction.moduleName}
    //       {userTransaction.functionName}
    //     </Text>
    //   </View>
    // );
  }

  return (
    <View style={tw.style("py-2 px-3 h-16 flex-col justify-between")}>
      {(() => {
        switch (
          movement.transaction.type
          // case TransactionType.Genesis:
          //   return <GenesisMovement movement={movement} />;
          //   case TransactionType.BlockMetadata:
          //     return <BlockMetadataMovement movement={movement} />;
          //   case TransactionType.User:
          //     return <UserMovement movement={movement} />;
        ) {
        }
        return null;
      })()}

      <View style={{ flexDirection: 'row' }}>
        <LibraAmount
          style={tw.style(
            "font-mono",
            movement.unlockedAmount.isPos() && "text-green-600",
            movement.unlockedAmount.isNeg() && "text-red-600",
            movement.unlockedAmount.isZero() && "text-slate-800"
          )}
        >
          {movement.unlockedAmount}
        </LibraAmount>
        {!movement.lockedAmount.isZero() && (
          <Text>
            {" - "}
            <LibraAmount
              style={tw.style(
                "font-mono",
                movement.lockedAmount.isPos() && "text-green-600",
                movement.lockedAmount.isNeg() && "text-red-600",
                movement.lockedAmount.isZero() && "text-slate-800"
              )}
            >
              {movement.lockedAmount}
            </LibraAmount>
          </Text>
        )}
      </View>

      <View style={tw.style("flex-row justify-between")}>
        <View style={tw.style("pt-1 pr-2")}>
          <Text style={tw.style("text-xs text-gray-500")}>{dateLabel}</Text>
        </View>

        <View style={tw.style("pt-1")}>
          <Text style={tw.style("text-xs text-gray-500")}>
            {`#${transaction.version}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MovementItem;
