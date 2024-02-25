import { FC, PropsWithChildren, useMemo } from "react";
import { AptosClient } from "aptos";
import aptosContext from "./context";

const AptosProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = useMemo(() => {
    return new AptosClient("https://rpc.0l.fyi");
  }, []);

  return (
    <aptosContext.Provider value={client}>
      {children}
    </aptosContext.Provider>
  );
};

export default AptosProvider;
