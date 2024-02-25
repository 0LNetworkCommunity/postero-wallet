import { FC, PropsWithChildren, useEffect, useState } from "react";
import { gql, useApolloClient, useSubscription } from "@apollo/client";

import { windowStateContext } from "./context";
import { Window } from "./types";

const GET_WINDOW = gql`
  query GetWindow {
    window {
      state
      frame
    }
  }
`;

const ON_WINDOW_UPDATED = gql`
  subscription OnWindowUpdated {
    windowUpdated {
      state
      frame
    }
  }
`;

type Props = PropsWithChildren<{}>;

const WindowStateProvider: FC<Props> = ({ children }) => {
  const [window, setWindow] = useState<Window>();
  const apolloClient = useApolloClient();

  useSubscription<{ windowUpdated: Window }>(ON_WINDOW_UPDATED, {
    onData: (res) => {
      if (!res.data.data) {
        return;
      }
      setWindow(res.data.data.windowUpdated);
    },
  });

  useEffect(() => {
    const load = async () => {
      const res = await apolloClient.query<{
        window: Window;
      }>({
        query: GET_WINDOW,
      });
      setWindow(res.data.window);
    };
    load();
  }, []);

  if (!window) {
    return null;
  }

  return (
    <windowStateContext.Provider value={window}>
      {children}
    </windowStateContext.Provider>
  );
};

export default WindowStateProvider;
