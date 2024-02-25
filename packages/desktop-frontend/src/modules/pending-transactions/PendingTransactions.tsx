import { FC, useState } from "react";
import { usePendingTransactions } from "./hook";
import PendingTransactionList from "./PendingTransactionList";
import PanelPreview from "../preview-panel/PanelPreview";
import PendingTransactionView from "./PendingTransactionView";

const PendingTransactions: FC = () => {
  const [activeTransactionId, setActiveTransactionId] = useState<string>();
  const pendingTransactions = usePendingTransactions();

  return (
    <>
      <PendingTransactionList
        pendingTransactions={pendingTransactions}
        onItemPress={(pendingTransaction) => {
          setActiveTransactionId(pendingTransaction.id);
        }}
      />

      <PanelPreview>
        {activeTransactionId &&
          pendingTransactions.find((it) => it.id === activeTransactionId) && (
            <PendingTransactionView id={activeTransactionId} />
          )}
      </PanelPreview>
    </>
  );
};

export default PendingTransactions;
