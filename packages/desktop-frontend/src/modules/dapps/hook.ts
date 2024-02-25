import _ from "lodash";
import { useEffect, useState } from "react";
import { gql, useApolloClient, useSubscription } from "@apollo/client";
import {
  ConnectionRequest,
  RawDApp,
  DApp,
  RawConnectionRequest,
} from "./types";

const GET_DAPPS = gql`
  query GetDApps {
    dApps {
      id
      name
      host
      description
      icon
      status
    }
  }
`;

const DAPP_STATUS_CHANGE = gql`
  subscription OnDAppStatusChange {
    dAppStatusChange {
      id
      name
      host
      description
      icon
      status
    }
  }
`;

const GET_DAPP = gql`
  query GetDApp($id: ID!) {
    dApp(id: $id) {
      id
      name
      host
      description
      icon
      status
      connectionRequests {
        id
        createdAt
      }
    }
  }
`;

const NEW_CONNECTION_REQUEST = gql`
  subscription NewConnectionRequest($dAppId: ID!) {
    newConnectionRequest(dAppId: $dAppId) {
      id
      createdAt
    }
  }
`;

const CONNECTION_REQUEST_REMOVED = gql`
  subscription ConnectionRequestRemoved {
    connectionRequestRemoved
  }
`;

const NEW_DAPP = gql`
  subscription NewDApp {
    newDApp {
      id
      name
      host
      description
      icon
      status
      connectionRequests {
        id
        createdAt
      }
    }
  }
`;

const connectionRequestMapper = (
  rawConnectionRequest: RawConnectionRequest
): ConnectionRequest => {
  return {
    id: rawConnectionRequest.id,
    createdAt: new Date(rawConnectionRequest.createdAt),
  };
};

const dAppMapper = (dApp: RawDApp): DApp => {
  return {
    ...dApp,
    connectionRequests: dApp.connectionRequests.map((it) =>
      connectionRequestMapper(it)
    ),
  };
};

export const useDApp = (dAppId: string): DApp | null => {
  const [dApp, setDApp] = useState<DApp>();
  const [connectionRequests, setConnectionRequests] = useState<
    ConnectionRequest[]
  >([]);
  const apolloClient = useApolloClient();

  useSubscription<{
    connectionRequestRemoved: string;
  }>(CONNECTION_REQUEST_REMOVED, {
    onData(options) {
      const connectionRequestId = options.data.data?.connectionRequestRemoved;
      if (connectionRequestId) {
        setConnectionRequests((prev) => {
          return prev.filter((it) => it.id !== connectionRequestId);
        });
      }
    },
  });

  useEffect(() => {
    const getDApp = async (dAppId: string) => {
      const res = await apolloClient.query<{ dApp: RawDApp }>({
        query: GET_DAPP,
        variables: {
          id: dAppId,
        },
      });
      const dApp: DApp = dAppMapper(res.data.dApp);
      setDApp(dApp);
      if (dApp.connectionRequests) {
        setConnectionRequests((prev) => {
          return [...prev, ...dApp.connectionRequests];
        });
      }
    };

    getDApp(dAppId);

    apolloClient
      .subscribe<{ newConnectionRequest: ConnectionRequest }>({
        query: NEW_CONNECTION_REQUEST,
        variables: {
          dAppId,
        },
      })
      .subscribe((res) => {
        const newConnectionRequest = res.data?.newConnectionRequest;
        if (newConnectionRequest) {
          setConnectionRequests((prev) => {
            return [newConnectionRequest, ...prev];
          });
        }
      });
  }, [dAppId]);

  if (!dApp) {
    return null;
  }

  return {
    ...dApp,
    connectionRequests,
  };
};

export const useDApps = () => {
  const apolloClient = useApolloClient();
  const [dApps, setDApps] = useState<DApp[]>([]);

  useSubscription<{ newDApp: RawDApp }>(NEW_DAPP, {
    onData: (res) => {
      const dApp = dAppMapper(res.data.data!.newDApp);

      if (dApp) {
        setDApps((prev) => {
          const newValue = [...prev, dApp];
          _.sortBy(newValue, "id");
          return newValue;
        });
      }
    },
  });

  useSubscription<{ dAppStatusChange: DApp }>(DAPP_STATUS_CHANGE, {
    onData: (res) => {
      const dApp = res.data.data?.dAppStatusChange;

      if (dApp) {
        setDApps((prev) => {
          const newValue = [...prev.filter((it) => it.id !== dApp.id), dApp];
          _.sortBy(newValue, "id");
          return newValue;
        });
      }
    },
  });

  useEffect(() => {
    const getDApps = async () => {
      const res = await apolloClient.query<{ dApps: DApp[] }>({
        query: GET_DAPPS,
      });
      setDApps(res.data.dApps);
    };
    getDApps();
  }, []);

  return dApps;
};
